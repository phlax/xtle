# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django import forms

from .models import Team


class PaginatingModelChoiceIterator(forms.models.ModelChoiceIterator):

    def __iter__(self):
        if self.field.empty_label is not None:
            yield ("", self.field.empty_label)
        queryset = self.queryset
        # Can't use iterator() when queryset uses prefetch_related()
        if not queryset._prefetch_related_lookups:
            queryset = queryset.iterator()
        i = 0
        for obj in queryset:
            yield self.choice(obj)
            i += 1
            if (i > 10):
                return


class PaginatingModelMultipleChoiceField(forms.ModelMultipleChoiceField):
    """
    for initial view, only pass the first n items,
    but use full queryset when validating
    """

    def __init__(self, queryset, **kwargs):
        super().__init__(queryset, **kwargs)
        self.queryset = self.queryset[:10]

    def _get_choices(self):
        if hasattr(self, '_choices'):
            return self._choices
        return PaginatingModelChoiceIterator(self)

    choices = property(
        _get_choices,
        forms.ModelMultipleChoiceField._set_choices)

    def to_python(self, value):
        return super().to_python(value)

    def has_changed(self, initial, data):
        return super().has_changed(initial, data)


class TeamAddForm(forms.ModelForm):

    class Meta(object):
        model = Team
        fields = ["name", "all_projects", "all_languages"]
        fieldsets = (
            ("main",
             {"fields": ["name", "all_projects", "all_languages"],
              "label": "Team configuration"}), )


class TeamMembersForm(forms.Form):

    def __init__(self, *args, **kwargs):
        self.instance = kwargs.pop("instance")
        super().__init__(*args, **kwargs)
        self.fields["members"] = forms.MultipleChoiceField(
            choices=self.instance.members.all().values_list(
                "id", "username")[:10])

    class Meta(object):
        model = Team
        fields = ["members"]
        fieldsets = (
            ("main",
             {"fields": ["members"],
              "label": "Team members"}), )
        field_classes = {
            "members": PaginatingModelMultipleChoiceField}


class TeamEditForm(forms.ModelForm):

    class Meta(object):
        model = Team
        fields = ["name", "all_projects", "all_languages"]
        fieldsets = (
            ("main",
             {"fields": ["name", "all_projects", "all_languages"],
              "label": "Team configuration"}), )
