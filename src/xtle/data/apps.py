# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLEDataConfig(AppConfig):
    name = "xtle.data"
    label = "xtle_data"
    verbose_name = "Xtle Data"
    version = "0.1.4"

    def ready(self):
        importlib.import_module("xtle.data.models")
        importlib.import_module("xtle.data.getters")
        importlib.import_module("xtle.data.receivers")
