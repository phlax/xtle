# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLELogConfig(AppConfig):
    name = "xtle.log"
    label = "xtle_log"
    verbose_name = "Xtle Log"
    version = "0.1.1"

    def ready(self):
        importlib.import_module("xtle.log.getters")
