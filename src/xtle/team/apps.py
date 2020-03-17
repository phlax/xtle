# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLETeamConfig(AppConfig):
    name = "xtle.team"
    label = "xtle_team"
    verbose_name = "XTLE Team"

    def ready(self):
        importlib.import_module("xtle.team.providers")
        # importlib.import_module("xtle.team.getters")
        # importlib.import_module("xtle.team.receivers")
