# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from collections import OrderedDict

from django.shortcuts import get_object_or_404

from django_remote_forms.forms import RemoteForm

from xtle.core.views import Data

from .forms import TeamAddForm, TeamEditForm, TeamMembersForm
from .models import Team
from .search import TeamSearch


class TeamAdminData(Data):

    def get_data(self):
        context = super(TeamAdminData, self).get_data()
        team = get_object_or_404(Team, code=self.kwargs["team"])
        context["data"]["object"] = dict(
            name=team.name,
            pk=team.pk,
            all_projects=team.all_projects,
            all_languages=team.all_languages)
        form = TeamEditForm(instance=team)
        member_types = (
            "members",
            "contributors",
            "translators",
            "reviewers",
            "admins")
        for k in member_types:
            qs = getattr(team, k)
            count = qs.count()
            # not very optimal
            items = [
                {"username": member.username, "pk": member.pk}
                for member
                in getattr(team, k).all()[:10]]
            context["data"]["object"][k] = dict(items=items, count=count)
        context["data"]["form"] = RemoteForm(form).as_dict()
        context["data"]["form"]["fieldsets"] = OrderedDict(form.Meta.fieldsets)

        members_form = TeamMembersForm(instance=team)
        context["data"]["members_form"] = RemoteForm(
            members_form).as_dict()
        del context["data"]["members_form"]["data"]
        context["data"]["members_form"]["fieldsets"] = OrderedDict(
            members_form.Meta.fieldsets)
        return context


class TeamsAdminData(Data):

    def get_data(self):
        context = super(TeamsAdminData, self).get_data()
        context["data"]["__schema__"]["xtle.admin.teams"] = ("code", "name")
        context["data"]["xtle.admin.teams"] = TeamSearch(
            fields=["text", "name"]).data
        return context


class TeamAdminAddData(Data):

    def get_data(self):
        context = super(TeamAdminAddData, self).get_data()
        form = TeamAddForm()
        context["data"]["form"] = RemoteForm(form).as_dict()
        context["data"]["form"]["fieldsets"] = OrderedDict(form.Meta.fieldsets)
        return context
