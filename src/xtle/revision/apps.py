# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLERevisionConfig(AppConfig):
    name = "xtle.revision"
    label = "xtle_revision"
    verbose_name = "Xtle Revision"

    def ready(self):
        importlib.import_module("xtle.revision.getters")
        importlib.import_module("xtle.revision.receivers")
