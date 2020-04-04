# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle language. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLEFormatConfig(AppConfig):

    name = "xtle.format"
    label = "xtle_format"
    verbose_name = "XTLE Format"

    def ready(self):
        importlib.import_module("xtle.format.models")
        importlib.import_module("xtle.format.receivers")
        importlib.import_module("xtle.format.getters")
        importlib.import_module("xtle.format.providers")
        importlib.import_module("xtle.format.formats.providers")