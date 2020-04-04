# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLEStoreConfig(AppConfig):
    name = "xtle.store"
    label = "xtle_store"
    verbose_name = "Xtle Store"

    def ready(self):
        importlib.import_module("xtle.store.getters")
        importlib.import_module("xtle.store.providers")
        importlib.import_module("xtle.store.receivers")
