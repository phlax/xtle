# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.shortcuts import get_object_or_404

from xtle.core.data_api import DataAPI

from .forms import TeamAddForm, TeamEditForm
from .models import Team


class TeamAdminAddAPI(DataAPI):

    @property
    def data(self):

        form = TeamAddForm(self.kwargs)

        if form.is_valid():
            data = form.cleaned_data
            data["code"] = data["name"].lower().replace(" ", "-")
            Team.objects.create(**data)
            return {"api": {"xtle.admin.teams.add": {"code": data["code"]}}}


class TeamAdminDeleteAPI(DataAPI):

    @property
    def data(self):
        for team in Team.objects.filter(code__in=self.kwargs["items"]):
            team.delete()
        return {"api": {"xtle.admin.teams.delete": {}}}


class TeamAdminEditAPI(DataAPI):

    @property
    def data(self):
        team = get_object_or_404(Team, pk=self.kwargs["pk"])
        form = TeamEditForm(self.kwargs, instance=team)

        if form.is_valid():
            form.save()
            return {"api": {"xtle.admin.teams.edit": {"response": "success"}}}
