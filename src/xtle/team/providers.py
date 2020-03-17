# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.core.delegate import data_api
from xtle.core.plugin import provider

from .data_api import (
    TeamAdminAddAPI,
    TeamAdminEditAPI,
    TeamAdminDeleteAPI)


@provider(data_api)
def gather_data_api(**kwargs_):
    return {
        "xtle.admin.teams.edit": TeamAdminEditAPI,
        "xtle.admin.teams.delete": TeamAdminDeleteAPI,
        "xtle.admin.teams.add": TeamAdminAddAPI}
