# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLEConfigConfig(AppConfig):

    name = "xtle.config"
    label = "xtle_config"
    verbose_name = "Xtle Config"

    def ready(self):
        importlib.import_module("xtle.config.getters")
