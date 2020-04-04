# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import logging
import os
import shutil
import uuid
from functools import lru_cache

from bulk_update.helper import bulk_update

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.functional import cached_property

from xtle.core.delegate import (
    config, response as xtle_response, revision, state as xtle_state)
from xtle.app.models import Directory
from xtle.project.models import Project
from xtle.store.constants import XTLE_WINS, SOURCE_WINS
from xtle.store.models import Store

from .apps import XTLEFSConfig
from .decorators import emits_state, responds_to_state
from .delegate import fs_finder, fs_matcher, fs_resources
from .exceptions import FSStateError
from .models import StoreFS
from .signals import fs_post_pull, fs_post_push, fs_pre_pull, fs_pre_push


logger = logging.getLogger(__name__)


class Plugin(object):
    """Base Plugin implementation"""

    ns = "xtle.fs.plugin"
    sw_version = XTLEFSConfig.version

    name = None

    def __init__(self, project):
        if not isinstance(project, Project):
            raise TypeError(
                "xtle_fs.Plugin expects a Project")
        self.project = project

    def __eq__(self, other):
        return (
            isinstance(other, self.__class__)
            and self.project == other.project
            and self.name == other.name)

    def __str__(self):
        return "<%s(%s)>" % (self.__class__.__name__, self.project)

    @property
    def cache_key(self):
        return (
            "%s.%s.%s.%s"
            % (self.project.code,
               self.xtle_revision,
               self.sync_revision,
               self.fs_revision))

    @property
    def is_cloned(self):
        return os.path.exists(self.project.local_fs_path)

    @property
    def latest_hash(self):
        raise NotImplementedError

    @property
    def finder_class(self):
        return fs_finder.get(self.__class__)

    @property
    def fs_url(self):
        fs_type = self.project.config["xtle_fs.fs_type"]
        fs_url = self.project.config["xtle_fs.fs_url"]
        parse_placeholder = (
            fs_type == "localfs"
            and fs_url.startswith("{XTLE_TRANSLATION_DIRECTORY}"))
        if parse_placeholder:
            return os.path.join(
                settings.XTLE_TRANSLATION_DIRECTORY,
                fs_url[28:])
        return fs_url

    @property
    def fs_revision(self):
        return self.latest_hash

    @property
    def xtle_revision(self):
        return revision.get(Directory)(
            self.project.directory).get(key="stats")

    @property
    def response_class(self):
        return xtle_response.get(self.state_class)

    @property
    def sync_revision(self):
        return revision.get(
            Project)(self.project).get(key="xtle.fs.sync")

    @cached_property
    def matcher_class(self):
        return fs_matcher.get(self.__class__)

    @property
    def store_fs_class(self):
        from .models import StoreFS

        return StoreFS

    @cached_property
    def matcher(self):
        return self.matcher_class(self)

    @cached_property
    def xtle_user(self):
        User = get_user_model()
        username = config.get(
            self.project.__class__,
            instance=self.project,
            key="xtle_fs.xtle_user")
        if username:
            try:
                return User.objects.get(username=username)
            except User.DoesNotExist:
                logger.warning(
                    "Misconfigured xtle_fs user: %s",
                    username)

    @cached_property
    def resources(self):
        return fs_resources.get(self.__class__)(self.project)

    @cached_property
    def state_class(self):
        return xtle_state.get(self.__class__)

    @lru_cache(maxsize=None)
    def get_fs_path(self, xtle_path):
        """
        Reverse match an FS filepath from a ``Store.xtle_path``.

        :param xtle_path: A ``Store.xtle_path``
        :returns: An filepath relative to the FS root.
        """
        return self.matcher.reverse_match(xtle_path)

    def create_store_fs(self, items, **kwargs):
        if not items:
            return
        to_add = []
        paths = [
            x.xtle_path
            for x in items]
        stores = dict(
            Store.objects.filter(
                xtle_path__in=paths).values_list("xtle_path", "pk"))
        for item in items:
            to_add.append(
                self.store_fs_class(
                    project=self.project,
                    xtle_path=item.xtle_path,
                    path=item.fs_path,
                    store_id=stores.get(item.xtle_path),
                    **kwargs))
        self.store_fs_class.objects.bulk_create(to_add)

    def delete_store_fs(self, items, **kwargs):
        if not items:
            return
        self.store_fs_class.objects.filter(
            pk__in=[fs.kwargs["store_fs"] for fs in items]).delete()

    def update_store_fs(self, items, **kwargs):
        if not items:
            return
        self.store_fs_class.objects.filter(
            pk__in=[fs.kwargs["store_fs"] for fs in items]).update(**kwargs)

    def clear_repo(self):
        if self.is_cloned:
            shutil.rmtree(self.project.local_fs_path)

    def expire_sync_cache(self):
        revision.get(Project)(self.project).set(
            keys=["xtle.fs.sync"], value=uuid.uuid4().hex)

    def find_translations(self, fs_path=None, xtle_path=None):
        """
        Find translation files from the file system

        :param fs_path: Path glob to filter translations matching FS path
        :param xtle_path: Path glob to filter translations to add matching
          ``xtle_path``
        :yields xtle_path, fs_path: Where `xtle_path` and `fs_path` are
          matched paths.
        """
        return self.matcher.matches(fs_path, xtle_path)

    def fetch(self):
        """
        Pull the FS from external source if required.
        """
        raise NotImplementedError

    def push(self, paths=None, message=None, response=None):
        """
        Push the FS to an external source if required.
        """
        raise NotImplementedError

    def reload(self):
        self.project.config.reload()
        if "matcher" in self.__dict__:
            del self.__dict__["matcher"]
        if "xtle_user" in self.__dict__:
            del self.__dict__["xtle_user"]

    def response(self, state):
        return self.response_class(state)

    def state(self, fs_path=None, xtle_path=None):
        """
        Get a state object for showing current state of FS/Xtle

        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
          ``xtle_path``
        :returns state: Where ``state`` is an instance of self.state_class
        """
        if not self.is_cloned:
            raise FSStateError(
                "Filesystem has not been fetched. "
                "Use `xtle fs fetch ...` first.")
        return self.state_class(
            self, fs_path=fs_path, xtle_path=xtle_path)

    @responds_to_state
    @transaction.atomic
    def add(self, state, response, fs_path=None, xtle_path=None, **kwargs):
        """
        Stage untracked or removed Stores or files

        :param force: Re-add removed Stores or files.
        :param update: Add to ``xtle``, ``fs`` or ``all``.
        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
           of self.respose_class
        """
        force = kwargs.get("force", False)
        update = kwargs.get("update", "all")
        untracked = []
        if update == "all":
            untracked = state["fs_untracked"] + state["xtle_untracked"]
        elif update == "xtle":
            untracked = state["fs_untracked"]
        elif update == "fs":
            untracked = state["xtle_untracked"]
        self.create_store_fs(untracked)
        if force:
            if update in ["all", "xtle"]:
                self.update_store_fs(
                    state["fs_removed"],
                    resolve_conflict=XTLE_WINS)
            if update in ["all", "fs"]:
                self.update_store_fs(
                    state["xtle_removed"],
                    resolve_conflict=SOURCE_WINS)
        if update in ["all", "xtle"]:
            for fs_state in state["fs_untracked"]:
                response.add("added_from_fs", fs_state=fs_state)
        if update in ["all", "fs"]:
            for fs_state in state["xtle_untracked"]:
                response.add("added_from_xtle", fs_state=fs_state)
        if force:
            if update in ["all", "xtle"]:
                for fs_state in state["fs_removed"]:
                    response.add("readded_from_xtle", fs_state=fs_state)
            if update in ["all", "fs"]:
                for fs_state in state["xtle_removed"]:
                    response.add("readded_from_fs", fs_state=fs_state)
        if response.made_changes:
            self.expire_sync_cache()
        return response

    @responds_to_state
    @transaction.atomic
    def resolve(self, state, response, fs_path=None, xtle_path=None,
                merge=True, xtle_wins=False):
        """
        Resolve conflicting translations

        Default is to merge with FS winning

        :param merge: Merge Xtle and FS, defaults to True, otherwise overwrite
        :param xtle_wins: Use unit from Xtle where conflicting
        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
            of self.respose_class
        """
        kwargs = {}
        if xtle_wins:
            kwargs["resolve_conflict"] = XTLE_WINS
        else:
            kwargs["resolve_conflict"] = SOURCE_WINS
        if merge:
            kwargs["staged_for_merge"] = True
        self.create_store_fs(state["conflict_untracked"], **kwargs)
        self.update_store_fs(state["conflict"], **kwargs)
        action_type = (
            "staged_for_%s_%s"
            % ((merge and "merge" or "overwrite"),
               (xtle_wins and "xtle" or "fs")))
        for fs_state in state["conflict"] + state["conflict_untracked"]:
            response.add(action_type, fs_state=fs_state)
        if response.made_changes:
            self.expire_sync_cache()
        return response

    @responds_to_state
    @transaction.atomic
    def rm(self, state, response, fs_path=None, xtle_path=None, **kwargs):
        """
        Stage translations for removal.

        If ``force``=``True`` is present it will also:
        - stage untracked files from FS
        - stage untracked Stores

        :param force: Fetch conflicting translations.
        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
             of self.respose_class
        """
        force = kwargs.get("force", False)
        update = kwargs.get("update", "all")
        to_create = []
        to_update = state["both_removed"]
        if update in ["all", "fs"]:
            to_update += state["xtle_removed"]
        if update in ["all", "xtle"]:
            to_update += state["fs_removed"]
        if force:
            to_update += state["conflict"]
            to_create += state["conflict_untracked"]
            if update in ["all", "fs"]:
                to_create += state["xtle_untracked"]
            if update in ["all", "xtle"]:
                to_create += state["fs_untracked"]
        self.update_store_fs(to_update, staged_for_removal=True)
        self.create_store_fs(to_create, staged_for_removal=True)
        for fs_state in to_create + to_update:
            response.add("staged_for_removal", fs_state=fs_state)
        if response.made_changes:
            self.expire_sync_cache()
        return response

    @responds_to_state
    @transaction.atomic
    def unstage(self, state, response, fs_path=None, xtle_path=None):
        """
        Unstage files staged for addition, merge or removal
        """
        to_remove = []
        to_update = (
            state["remove"]
            + state["merge_xtle_wins"]
            + state["merge_fs_wins"]
            + state["xtle_staged"]
            + state["fs_staged"])
        for fs_state in state["xtle_ahead"] + state["fs_ahead"]:
            if fs_state.store_fs.resolve_conflict in [SOURCE_WINS, XTLE_WINS]:
                to_update.append(fs_state)
        for fs_state in to_update:
            should_remove = (
                fs_state.store_fs
                and not fs_state.store_fs.last_sync_revision
                and not fs_state.store_fs.last_sync_hash)
            if should_remove:
                to_remove.append(fs_state)
        to_update = list(set(to_update) - set(to_remove))
        self.update_store_fs(
            to_update,
            resolve_conflict=None,
            staged_for_merge=False,
            staged_for_removal=False)
        self.delete_store_fs(to_remove)
        updated = sorted(
            to_remove + to_update,
            key=lambda x: x.xtle_path)
        for fs_state in updated:
            response.add("unstaged", fs_state=fs_state)
        if response.made_changes:
            self.expire_sync_cache()
        return response

    @responds_to_state
    def sync_merge(self, state, response, fs_path=None,
                   xtle_path=None, update="all"):
        """
        Perform merge between Xtle and working directory

        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance#
             of self.respose_class
        """
        sfs = {}
        for fs_state in (state['merge_xtle_wins'] + state['merge_fs_wins']):
            sfs[fs_state.kwargs["store_fs"]] = fs_state
        _sfs = StoreFS.objects.filter(
            id__in=sfs.keys()).select_related("store", "store__data")
        for store_fs in _sfs:
            fs_state = sfs[store_fs.id]
            fs_state.store_fs = store_fs
            xtle_wins = (fs_state.state_type == "merge_xtle_wins")
            store_fs = fs_state.store_fs
            update_revision = store_fs.file.pull(
                merge=True,
                xtle_wins=xtle_wins,
                user=self.xtle_user)
            if update == "all":
                update_revision = store_fs.file.push()
            state.resources.xtle_revisions[
                store_fs.store_id] = update_revision
            state.resources.file_hashes[
                store_fs.xtle_path] = store_fs.file.latest_hash
            if xtle_wins:
                response.add("merged_from_xtle", fs_state=fs_state)
            else:
                response.add("merged_from_fs", fs_state=fs_state)
        if response.made_changes:
            self.expire_sync_cache()
        return response

    @responds_to_state
    @emits_state(pre=fs_pre_pull, post=fs_post_pull)
    def sync_pull(self, state, response, fs_path=None, xtle_path=None):
        """
        Pull translations from working directory to Xtle

        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
            of self.respose_class
        """
        sfs = {}
        for fs_state in (state['fs_staged'] + state['fs_ahead']):
            sfs[fs_state.kwargs["store_fs"]] = fs_state
        _sfs = StoreFS.objects.filter(
            id__in=sfs.keys()).select_related("store", "store__data")
        for store_fs in _sfs:
            store_fs.file.pull(user=self.xtle_user)
            if store_fs.store and store_fs.store.data:
                state.resources.xtle_revisions[
                    store_fs.store_id] = store_fs.store.data.max_unit_revision
            state.resources.file_hashes[
                store_fs.xtle_path] = store_fs.file.latest_hash
            fs_state = sfs[store_fs.id]
            fs_state.store_fs = store_fs
            response.add("pulled_to_xtle", fs_state=fs_state)
        return response

    @responds_to_state
    @emits_state(pre=fs_pre_push, post=fs_post_push)
    def sync_push(self, state, response, fs_path=None, xtle_path=None):
        """
        Push translations from Xtle to working directory.

        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
            of self.respose_class
        """
        pushable = state['xtle_staged'] + state['xtle_ahead']
        stores_fs = StoreFS.objects.filter(
            id__in=[
                fs_state.store_fs.id
                for fs_state
                in pushable])
        stores_fs = {sfs.id: sfs for sfs in stores_fs.select_related("store")}
        for fs_state in pushable:
            store_fs = stores_fs[fs_state.store_fs.id]
            fs_state.store_fs = store_fs
            store_fs.file.push()
            state.resources.xtle_revisions[
                store_fs.store_id] = store_fs.store.data.max_unit_revision
            state.resources.file_hashes[
                store_fs.xtle_path] = store_fs.file.latest_hash
            response.add('pushed_to_fs', fs_state=fs_state)
        return response

    @responds_to_state
    def sync_rm(self, state, response, fs_path=None, xtle_path=None):
        """
        Remove Store and files from working directory that are staged for
        removal.

        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
            of self.respose_class
        """
        sfs = {}
        for fs_state in state['remove']:
            sfs[fs_state.kwargs["store_fs"]] = fs_state
        for store_fs in StoreFS.objects.filter(id__in=sfs.keys()):
            fs_state = sfs[store_fs.pk]
            store_fs.file.delete()
            if store_fs.store and store_fs.store.data:
                state.resources.xtle_revisions[
                    store_fs.store_id] = store_fs.store.data.max_unit_revision
            response.add("removed", fs_state=fs_state, store_fs=store_fs)
        return response

    @responds_to_state
    @transaction.atomic
    def sync(self, state, response, fs_path=None,
             xtle_path=None, update="all"):
        """
        Synchronize all staged and non-conflicting files and Stores, and push
        changes upstream if required.

        :param fs_path: FS path glob to filter translations
        :param xtle_path: Xtle path glob to filter translations
        :returns response: Where ``response`` is an instance
            of self.respose_class
        """
        self.sync_rm(
            state, response, fs_path=fs_path, xtle_path=xtle_path)
        if update in ["all", "xtle"]:
            self.sync_merge(
                state, response,
                fs_path=fs_path,
                xtle_path=xtle_path,
                update=update)
            self.sync_pull(
                state, response, fs_path=fs_path, xtle_path=xtle_path)
        if update in ["all", "fs"]:
            self.sync_push(
                state, response, fs_path=fs_path, xtle_path=xtle_path)
            self.push(response)
        sync_types = [
            "pushed_to_fs", "pulled_to_xtle",
            "merged_from_xtle", "merged_from_fs"]
        fs_to_update = {}
        file_hashes = state.resources.file_hashes
        xtle_revisions = state.resources.xtle_revisions
        for sync_type in sync_types:
            if sync_type in response:
                for response_item in response.completed(sync_type):
                    store_fs = response_item.store_fs
                    last_sync_revision = None
                    if store_fs.store_id in xtle_revisions:
                        last_sync_revision = xtle_revisions[store_fs.store_id]
                    file_hash = file_hashes.get(
                        store_fs.xtle_path, store_fs.file.latest_hash)
                    store_fs.file.on_sync(
                        file_hash,
                        last_sync_revision,
                        save=False)
                    fs_to_update[store_fs.id] = store_fs
        if fs_to_update:
            bulk_update(
                list(fs_to_update.values()),
                update_fields=[
                    "last_sync_revision", "last_sync_hash",
                    "resolve_conflict", "staged_for_merge"])
        if response.made_changes:
            self.expire_sync_cache()
        return response
