# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import logging
import os

from django.utils.termcolors import PALETTES, NOCOLOR_PALETTE

from xtle.core.exceptions import MissingPluginError, NotConfiguredError
from xtle.core.management.subcommands import CommandWithSubcommands
from xtle.fs.utils import FSPlugin
from xtle.project.models import Project

from .fs_commands.add import AddCommand
from .fs_commands.fetch import FetchCommand
from .fs_commands.info import ProjectInfoCommand
from .fs_commands.resolve import ResolveCommand
from .fs_commands.rm import RmCommand
from .fs_commands.state import StateCommand
from .fs_commands.sync import SyncCommand
from .fs_commands.unstage import UnstageCommand

PALETTES[NOCOLOR_PALETTE]["FS_MISSING"] = {}
PALETTES["light"]["FS_MISSING"] = {'fg': 'magenta'}
PALETTES["dark"]["FS_MISSING"] = {'fg': 'magenta'}
PALETTES[NOCOLOR_PALETTE]["XTLE_MISSING"] = {}
PALETTES["light"]["XTLE_MISSING"] = {'fg': 'magenta'}
PALETTES["dark"]["XTLE_MISSING"] = {'fg': 'magenta'}
PALETTES[NOCOLOR_PALETTE]["FS_UNTRACKED"] = {}
PALETTES["light"]["FS_UNTRACKED"] = {'fg': 'red'}
PALETTES["dark"]["FS_UNTRACKED"] = {'fg': 'red'}
PALETTES[NOCOLOR_PALETTE]["FS_STAGED"] = {}
PALETTES["light"]["FS_STAGED"] = {'fg': 'green'}
PALETTES["dark"]["FS_STAGED"] = {'fg': 'green'}
PALETTES[NOCOLOR_PALETTE]["FS_UPDATED"] = {}
PALETTES["light"]["FS_UPDATED"] = {'fg': 'green'}
PALETTES["dark"]["FS_UPDATED"] = {'fg': 'green'}
PALETTES[NOCOLOR_PALETTE]["FS_CONFLICT"] = {}
PALETTES["light"]["FS_CONFLICT"] = {'fg': 'red', 'opts': ('bold',)}
PALETTES["dark"]["FS_CONFLICT"] = {'fg': 'red', 'opts': ('bold',)}
PALETTES[NOCOLOR_PALETTE]["FS_REMOVED"] = {}
PALETTES["light"]["FS_REMOVED"] = {'fg': 'red'}
PALETTES["dark"]["FS_REMOVED"] = {'fg': 'red'}
PALETTES[NOCOLOR_PALETTE]["FS_ERROR"] = {}
PALETTES["light"]["FS_ERROR"] = {'fg': 'red', 'opts': ('bold',)}
PALETTES["dark"]["FS_ERROR"] = {'fg': 'red', 'opts': ('bold',)}

# This must be run before importing the rest of the Django libs.
os.environ["DJANGO_COLORS"] = "light"
os.environ['DJANGO_SETTINGS_MODULE'] = 'xtle.app.settings'


logger = logging.getLogger('xtle.fs')


class Command(CommandWithSubcommands):
    help = "Xtle FS."
    subcommands = {
        "add": AddCommand,
        "fetch": FetchCommand,
        "info": ProjectInfoCommand,
        "rm": RmCommand,
        "resolve": ResolveCommand,
        "state": StateCommand,
        "sync": SyncCommand,
        "unstage": UnstageCommand}

    def handle(self, *args, **kwargs):
        any_configured = False
        for project in Project.objects.order_by("pk"):
            try:
                plugin = FSPlugin(project)
                self.stdout.write(
                    "%s\t%s"
                    % (project.code, plugin.fs_url))
                any_configured = True
            except (MissingPluginError, NotConfiguredError):
                pass
        if not any_configured:
            self.stdout.write("No projects configured")
