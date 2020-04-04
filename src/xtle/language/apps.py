# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle language. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLELanguageConfig(AppConfig):
    name = "xtle.language"
    label = "xtle_language"
    verbose_name = "Xtle Language"
    version = "0.1.4"

    def ready(self):
        importlib.import_module("xtle.language.getters")
        importlib.import_module("xtle.language.receivers")
        importlib.import_module("xtle.language.providers")
