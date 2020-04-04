# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLEFSConfig(AppConfig):

    name = "xtle.fs"
    label = "xtle_fs"
    verbose_name = "Xtle Filesystem synchronisation"
    version = "0.1.3"

    def ready(self):
        importlib.import_module("xtle.fs.models")
        importlib.import_module("xtle.fs.getters")
        importlib.import_module("xtle.fs.providers")
        importlib.import_module("xtle.fs.receivers")
        importlib.import_module("xtle.fs.management.commands.fs")
