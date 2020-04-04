# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.db import models
from django.utils.functional import cached_property

from xtle.core.exceptions import MissingPluginError, NotConfiguredError
from xtle.project.models import Project
from xtle.store.constants import XTLE_WINS, SOURCE_WINS
from xtle.store.models import Store

from .delegate import fs_file
from .managers import StoreFSManager, validate_store_fs
from .utils import FSPlugin


class AbstractStoreFS(models.Model):
    project = models.ForeignKey(
        Project, related_name='store_fs', on_delete=models.CASCADE)
    xtle_path = models.CharField(max_length=255, blank=False)
    path = models.CharField(max_length=255, blank=False)
    store = models.ForeignKey(
        Store, related_name='fs', blank=True, null=True,
        on_delete=models.SET_NULL)
    last_sync_revision = models.IntegerField(blank=True, null=True)
    last_sync_mtime = models.DateTimeField(null=True, blank=True)
    last_sync_hash = models.CharField(max_length=64, blank=True, null=True)
    staged_for_removal = models.BooleanField(default=False)
    staged_for_merge = models.BooleanField(default=False)
    resolve_conflict = models.IntegerField(
        blank=True, null=True,
        default=0,
        choices=[(0, ""),
                 (XTLE_WINS, "xtle"),
                 (SOURCE_WINS, "fs")])

    objects = StoreFSManager()

    class Meta(object):
        abstract = True

    @cached_property
    def plugin(self):
        try:
            return FSPlugin(self.project)
        except (NotConfiguredError, MissingPluginError):
            return None

    @cached_property
    def file(self):
        if self.plugin:
            file_adapter = fs_file.get(self.plugin.__class__)
            if file_adapter:
                return file_adapter(self)

    def save(self, *args, **kwargs):
        validated = validate_store_fs(
            store=self.store,
            project=self.project,
            xtle_path=self.xtle_path,
            path=self.path)
        self.store = validated.get("store")
        self.project = validated.get("project")
        self.xtle_path = validated.get("xtle_path")
        self.path = validated.get("path")
        return super(AbstractStoreFS, self).save(*args, **kwargs)
