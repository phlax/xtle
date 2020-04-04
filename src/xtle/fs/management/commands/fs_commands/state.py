# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.fs.display import StateDisplay
from xtle.fs.management.commands import FSAPISubCommand


STATE_COLORMAP = {
    "conflict": ("CONFLICT", "CONFLICT"),
    "conflict_untracked": ("CONFLICT", "CONFLICT"),
    "remove": ("MISSING", "MISSING"),
    "merge_fs_wins": ("UPDATED", "UPDATED"),
    "merge_xtle_wins": ("UPDATED", "UPDATED"),
    "fs_ahead": (None, "UPDATED"),
    "fs_staged": ("MISSING", "STAGED"),
    "fs_untracked": ("MISSING", "UNTRACKED"),
    "fs_removed": (None, "REMOVED"),
    "xtle_untracked": ("UNTRACKED", "REMOVED"),
    "xtle_staged": ("STAGED", "REMOVED"),
    "xtle_removed": ("REMOVED", None),
    "xtle_ahead": ("UPDATED", None)}


class StateCommand(FSAPISubCommand):
    help = ("Show state of tracked and untracked files and Stores for the "
            "specified project")
    api_method = "state"

    def add_arguments(self, parser):
        super(StateCommand, self).add_arguments(parser)
        parser.add_argument(
            '-t', '--type',
            action='append',
            dest='state_type',
            help='State type')

    @property
    def colormap(self):
        return STATE_COLORMAP

    def display(self, **options):
        return StateDisplay(self.handle_api(**options))

    def is_empty(self, display):
        return not display.context.has_changed
