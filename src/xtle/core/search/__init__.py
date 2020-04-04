# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
#
# This file is a part of the Pootle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from haystack.query import SearchQuerySet

from .base import SearchBackend
from .broker import SearchBroker
from .backends import ElasticSearchBackend


class SearchContext(object):
    _models = None
    _fields = None
    flat = False

    @property
    def sqs(self):
        return SearchQuerySet().models(*self.models).filter(**self.filters)

    @property
    def data(self):
        return list(self.sqs.values_list(*self.fields, flat=self.flat))

    @property
    def filters(self):
        return {}


__all__ = ('SearchBackend', 'SearchBroker', 'ElasticSearchBackend')
