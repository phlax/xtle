# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import logging
from collections import OrderedDict

from django.utils.functional import cached_property

from xtle.core.response import ItemResponse, Response
from xtle.store.models import Store


logger = logging.getLogger(__name__)

FS_RESPONSE = OrderedDict()
FS_RESPONSE["pulled_to_xtle"] = {
    "title": "Pulled to Xtle",
    "description":
        "Stores updated where filesystem version was new or newer"}
FS_RESPONSE["added_from_xtle"] = {
    "title": "Added from Xtle",
    "description":
        "Files staged from Xtle that were new or newer than their files"}
FS_RESPONSE["added_from_fs"] = {
    "title": "Added from filesystem",
    "description":
        ("Files staged from the filesystem that were new or newer than their "
         "Xtle Stores")}
FS_RESPONSE["pushed_to_fs"] = {
    "title": "Pushed to filesystem",
    "description":
        "Files updated where Xtle Store version was new or newer"}
FS_RESPONSE["staged_for_overwrite_fs"] = {
    "title": "Staged for overwrite from filesystem",
    "description":
        ("Files staged to overwrite the corresponding Store")}
FS_RESPONSE["staged_for_overwrite_xtle"] = {
    "title": "Staged for overwrite from xtle",
    "description":
        ("Stores staged to overwrite the corresponding file")}
FS_RESPONSE["staged_for_removal"] = {
    "title": "Staged for removal",
    "description":
        ("Files or Stores staged for removal where the corresponding "
         "file/Store is missing")}
FS_RESPONSE["removed"] = {
    "title": "Removed",
    "description":
        ("Files or Stores removed that no longer had corresponding files or "
         "Stores")}
FS_RESPONSE["staged_for_merge_fs"] = {
    "title": "Staged for merge (FS Wins)",
    "description":
        ("Files or Stores staged for merge where the corresponding "
         "file/Store has also been updated or created")}
FS_RESPONSE["staged_for_merge_xtle"] = {
    "title": "Staged for merge (Xtle Wins)",
    "description":
        ("Files or Stores staged for merge where the corresponding "
         "file/Store has also been updated or created")}
FS_RESPONSE["merged_from_fs"] = {
    "title": "Merged from fs",
    "description":
        ("Merged - FS won where unit updates conflicted")}
FS_RESPONSE["merged_from_xtle"] = {
    "title": "Merged from xtle",
    "description":
        ("Merged - Xtle won where unit updates conflicted")}
FS_RESPONSE["unstaged"] = {
    "title": "Unstaged",
    "description":
        ("Files or Stores that were previously staged for addition, "
         "merge or removal were unstaged")}


class ProjectFSItemResponse(ItemResponse):

    def __str__(self):
        return (
            "<%s(%s)%s: %s %s::%s>"
            % (self.__class__.__name__,
               self.response.context,
               self.failed and " FAILED" or "",
               self.action_type,
               self.xtle_path,
               self.fs_path))

    @property
    def fs_path(self):
        return self.fs_state.fs_path

    @property
    def fs_state(self):
        return self.kwargs["fs_state"]

    @property
    def xtle_path(self):
        return self.fs_state.xtle_path

    @cached_property
    def store(self):
        if self.fs_state.store:
            return self.fs_state.store
        if self.store_fs:
            return self.store_fs.store
        try:
            return Store.objects.get(
                xtle_path=self.fs_state.xtle_path)
        except Store.DoesNotExist:
            return None

    @property
    def store_fs(self):
        return self.fs_state.store_fs


class ProjectFSResponse(Response):

    response_class = ProjectFSItemResponse

    @property
    def response_types(self):
        return FS_RESPONSE.keys()
