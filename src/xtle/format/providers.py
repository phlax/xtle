# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from collections import OrderedDict

from xtle.core.delegate import format_registration
from xtle.core.plugin import provider

from .default import XTLE_FORMATS


@provider(format_registration)
def register_formats(**kwargs_):
    return OrderedDict(XTLE_FORMATS)
