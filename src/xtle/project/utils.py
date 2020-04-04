# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.core.paths import Paths
from xtle.store.models import Store

from .apps import XTLEProjectConfig


class ProjectPaths(Paths):
    ns = "xtle.project"
    sw_version = XTLEProjectConfig.version

    @property
    def store_qs(self):
        return Store.objects.filter(
            translation_project__project_id=self.context.id)
