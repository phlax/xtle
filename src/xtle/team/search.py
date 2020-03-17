# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from xtle.core.search import SearchContext

from .models import Team


class TeamSearch(SearchContext):

    def __init__(self, fields=None, models=None, flat=False):
        self.flat = flat
        if models:
            self._models = models
        if fields:
            self._fields = fields

    @property
    def models(self):
        return self._models or (Team, )

    @property
    def fields(self):
        return (
            self._fields
            or ["text"])
