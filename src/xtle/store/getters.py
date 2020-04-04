# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.conf import settings
from django.core.exceptions import ValidationError

from xtle.core.delegate import (
    comparable_event, deserializers, frozen, grouped_events, lifecycle, review,
    search_backend, serializers, states, uniqueid, versioned, wordcount)
from xtle.core.plugin import getter
from xtle.config.delegate import (
    config_should_not_be_appended, config_should_not_be_set)
from xtle.misc.util import import_func

from .models import Store, Suggestion, SuggestionState, Unit
from .unit.search import DBSearchBackend
from .unit.timeline import (
    ComparableUnitTimelineLogEvent, UnitTimelineGroupedEvents, UnitTimelineLog)
from .utils import (
    FrozenUnit, SuggestionsReview, UnitLifecycle, UnitUniqueId,
    UnitWordcount)
from .versioned import VersionedStore


wordcounter = None
suggestion_states = None


@getter(states, sender=Suggestion)
def get_suggestion_states(**kwargs_):
    global suggestion_states

    if not suggestion_states:
        suggestion_states = dict(
            SuggestionState.objects.values_list("name", "pk"))
    return suggestion_states


@getter(wordcount, sender=Unit)
def get_unit_wordcount(**kwargs_):
    global wordcounter

    if not wordcounter:
        wordcounter = UnitWordcount(
            import_func(settings.XTLE_WORDCOUNT_FUNC))
    return wordcounter


@getter(frozen, sender=Unit)
def get_frozen_unit(**kwargs_):
    return FrozenUnit


@getter(search_backend, sender=Unit)
def get_search_backend(**kwargs_):
    return DBSearchBackend


@getter(review, sender=Suggestion)
def get_suggestions_review(**kwargs_):
    return SuggestionsReview


@getter(uniqueid, sender=Unit)
def get_unit_uniqueid(**kwargs_):
    return UnitUniqueId


@getter(lifecycle, sender=Unit)
def get_unit_lifecylcle(**kwargs_):
    return UnitLifecycle


@getter(comparable_event, sender=UnitTimelineLog)
def get_unit_timeline_log_comparable_event(**kwargs_):
    return ComparableUnitTimelineLogEvent


@getter(grouped_events, sender=UnitTimelineLog)
def get_unit_timeline_log_grouped_events(**kwargs_):
    return UnitTimelineGroupedEvents


@getter([config_should_not_be_set, config_should_not_be_appended])
def serializer_should_not_be_saved(**kwargs):

    if kwargs["key"] == "xtle.core.serializers":
        if not isinstance(kwargs["value"], list):
            return ValidationError(
                "xtle.core.serializers must be a list")
        available_serializers = serializers.gather(kwargs["sender"]).keys()
        for k in kwargs["value"]:
            if k not in available_serializers:
                return ValidationError(
                    "Unrecognised xtle.core.serializers: '%s'" % k)
    elif kwargs["key"] == "xtle.core.deserializers":
        if not isinstance(kwargs["value"], list):
            return ValidationError(
                "xtle.core.deserializers must be a list")
        available_deserializers = deserializers.gather(kwargs["sender"]).keys()
        for k in kwargs["value"]:
            if k not in available_deserializers:
                return ValidationError(
                    "Unrecognised xtle.core.deserializers: '%s'" % k)


@getter(versioned, sender=Store)
def get_versioned_store(**kwargs_):
    return VersionedStore
