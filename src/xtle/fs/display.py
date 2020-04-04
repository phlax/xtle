# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.core.display import Display, ItemDisplay, SectionDisplay
from xtle.fs.response import FS_RESPONSE
from xtle.fs.state import FS_STATE


BOTH_EXISTS_ACTIONS = [
    "merged_from_fs", "merged_from_xtle",
    "pulled_to_xtle", "pushed_to_fs",
    "staged_for_merge_fs", "staged_for_merge_xtle"]
FS_EXISTS_ACTIONS = BOTH_EXISTS_ACTIONS + ["added_from_fs"]
STORE_EXISTS_ACTIONS = BOTH_EXISTS_ACTIONS + ["added_from_xtle"]
BOTH_EXISTS_STATES = [
    "fs_ahead", "xtle_ahead",
    "conflict", "conflict_untracked",
    "merge_fs_wins", "merge_xtle_wins"]
FS_EXISTS_STATES = BOTH_EXISTS_STATES + [
    "fs_untracked", "fs_staged", "xtle_removed"]
STORE_EXISTS_STATES = BOTH_EXISTS_STATES + [
    "xtle_untracked", "xtle_staged", "fs_removed"]


class FSItemDisplay(ItemDisplay):

    def __str__(self):
        return (
            "  %s\n   <-->  %s\n"
            % (self.xtle_path, self.fs_path))

    @property
    def xtle_path(self):
        return (
            self.item.xtle_path
            if self.store_exists
            else "(%s)" % self.item.xtle_path)

    @property
    def fs_path(self):
        return (
            self.item.fs_path
            if self.file_exists
            else "(%s)" % self.item.fs_path)


class ResponseItemDisplay(FSItemDisplay):

    @property
    def action_type(self):
        return self.item.action_type

    @property
    def file_exists(self):
        return (
            self.action_type in FS_EXISTS_ACTIONS
            or (self.state_type
                in ["conflict", "conflict_untracked"])
            or (self.action_type == "staged_for_removal"
                and (self.state_type
                     in ["fs_untracked", "xtle_removed"])))

    @property
    def fs_added(self):
        return (
            self.action_type == "added_from_fs"
            and self.state_type not in ["conflict", "conflict_untracked"])

    @property
    def xtle_added(self):
        return (
            self.action_type == "added_from_xtle"
            and self.state_type not in ["conflict", "conflict_untracked"])

    @property
    def state_item(self):
        return self.item.fs_state

    @property
    def state_type(self):
        return self.state_item.state_type

    @property
    def store_exists(self):
        return (
            self.action_type in STORE_EXISTS_ACTIONS
            or (self.state_type
                in ["conflict", "conflict_untracked"])
            or (self.action_type == "staged_for_removal"
                and (self.state_type
                     in ["xtle_untracked", "fs_removed"])))


class ResponseTypeDisplay(SectionDisplay):
    item_class = ResponseItemDisplay


class ResponseDisplay(Display):
    context_info = FS_RESPONSE
    section_class = ResponseTypeDisplay
    no_results_msg = "No changes made"


class StateItemDisplay(FSItemDisplay):

    @property
    def state_type(self):
        return self.item.state_type

    @property
    def file(self):
        if self.item.store_fs:
            return self.item.store_fs.file

    @property
    def file_exists(self):
        return (
            self.state_type in FS_EXISTS_STATES
            or (self.state_type == "remove"
                and self.file.file_exists))

    @property
    def store_exists(self):
        return (
            self.state_type in STORE_EXISTS_STATES
            or (self.state_type == "remove"
                and self.file.store_exists))

    @property
    def tracked(self):
        return self.item.store_fs and True or False


class StateTypeDisplay(SectionDisplay):
    item_class = StateItemDisplay


class StateDisplay(Display):
    context_info = FS_STATE
    section_class = StateTypeDisplay
