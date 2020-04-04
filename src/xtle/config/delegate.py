# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.core.plugin.delegate import Getter


config_should_not_be_set = Getter(
    providing_args=["instance", "key", "value"])
config_should_not_be_appended = Getter(
    providing_args=["instance", "key", "value"])
