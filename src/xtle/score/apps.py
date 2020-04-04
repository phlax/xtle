# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class XTLEScoreConfig(AppConfig):

    name = "xtle.score"
    label = "xtle_score"
    verbose_name = "Xtle Score"
    version = "0.1.2"

    def ready(self):
        importlib.import_module("xtle.score.getters")
        importlib.import_module("xtle.score.providers")
        importlib.import_module("xtle.score.receivers")
