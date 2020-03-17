# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from haystack import indexes

from .models import Team


class TeamIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(model_attr="code", document=True)
    name = indexes.CharField(model_attr="name")

    class Meta(object):
        model = Team

    def get_model(self):
        return Team

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
