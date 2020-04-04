# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.fs.management.commands import FSAPISubCommand


class RmCommand(FSAPISubCommand):
    help = "Stage files and/or stores for removal."
    api_method = "rm"

    def add_arguments(self, parser):
        super(RmCommand, self).add_arguments(parser)
        parser.add_argument(
            "--force",
            action="store_true",
            dest="force",
            help=("Stage for removal conflicting/untracked files and/or "
                  "stores"))
