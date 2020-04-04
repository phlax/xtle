# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import importlib

from django.apps import AppConfig


class AccountsConfig(AppConfig):

    name = "xtle.accounts"
    label = "xtle_accounts"
    verbose_name = "Accounts"
    version = "0.1.1"

    def ready(self):
        importlib.import_module("xtle.accounts.getters")
        importlib.import_module("xtle.accounts.receivers")
