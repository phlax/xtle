# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import hashlib

from django.forms import ValidationError
from django.http import Http404
from django.utils.functional import cached_property

from xtle.accounts.search import UserSearch
from xtle.checks.utils import get_qualitycheck_list
from xtle.core.delegate import scores
from xtle.core.data_api import DataAPI
from xtle.core.url_helpers import split_xtle_path
from xtle.core.utils.stats import TOP_CONTRIBUTORS_CHUNK_SIZE
from xtle.i18n import formatter
from xtle.language.models import Language
from xtle.project.models import Project, ProjectSet
from xtle.statistics.forms import StatsForm

from .models import Directory
from .search import DirectorySearch


class BreadcrumbPathsAPI(DataAPI):

    @property
    def search(self):
        return self.kwargs['search']

    @property
    def language_code(self):
        return self.resolved.kwargs["language_code"]

    @property
    def project_code(self):
        return self.resolved.kwargs["project_code"]

    @property
    def data(self):
        return {
            "xtle.breadcrumb.paths": DirectorySearch(
                user=self.user,
                project=self.project_code,
                language=self.language_code,
                fields=("text", ),
                flat=True,
                path=self.path).data}


class ChecksDisplay(object):

    def __init__(self, context):
        self.context = context

    @property
    def check_schema(self):
        return get_qualitycheck_list(self.context)

    @cached_property
    def check_data(self):
        return self.context.data_tool.get_checks()

    @property
    def checks_by_category(self):
        _checks = []
        for check in self.check_schema:
            if check["code"] not in self.check_data:
                continue
            check["count"] = self.check_data[check["code"]]
            check["count_display"] = formatter.number(check["count"])
            _checks.append(check)
        return _checks


class StatsAPI(DataAPI):

    @property
    def data(self):
        obj = Project.objects.get(code="tutorial")
        # checks = obj.data_tool.get_checks()
        self.score_context = obj
        # scores = self.top_scorer_data
        # ChecksDisplay(obj).checks_by_category
        # get_translation_states(self.object)
        ctx = dict(data=dict(__schema__=dict()))
        ctx["data"]["__schema__"]["contributors"] = ("username", "md5", "score")
        ctx["data"]["contributors"] = (
            ("foo",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(), 7),
            ("bar",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(), 23),
            ("baz",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(), 73),
            ("other",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(), 73))
        ctx["data"]["__schema__"]["checks"] = ("name", "critical", "count")
        ctx["data"]["checks"] = (
            ("Acronyms", True, 7),
            ("Brackets", True, 13),
            ("Double quotes", False, 17),
            ("Double spaces", False, 73))
        return {
            "api": {"xtle.stats": ctx["data"]}}

    @cached_property
    def scores(self):
        return scores.get(
            self.score_context.__class__)(
                self.score_context)

    # @persistent_property
    @property
    def top_scorer_data(self):
        chunk_size = TOP_CONTRIBUTORS_CHUNK_SIZE

        def scores_to_json(score):
            score["user"] = score["user"].to_dict()
            return score
        top_scorers = self.scores.display(
            limit=chunk_size,
            formatter=scores_to_json)
        return dict(
            items=list(top_scorers),
            has_more_items=len(self.scores.top_scorers) > chunk_size)


class TopContributorsAPI(DataAPI):
    form_class = StatsForm

    @cached_property
    def request_kwargs(self):
        stats_form = self.get_form()
        if not stats_form.is_valid():
            raise Http404(
                ValidationError(stats_form.errors).messages)
        return stats_form.cleaned_data

    @cached_property
    def xtle_path(self):
        (language_code, project_code,
         dir_path, filename) = split_xtle_path(self.path)
        if language_code and project_code:
            return (
                "/%s/%s/"
                % (language_code, project_code))
        elif language_code:
            return "/%s/" % language_code
        elif project_code:
            return "/projects/%s/" % project_code

    @cached_property
    def object(self):
        return (
            self.xtle_path
            and Directory.objects.get(xtle_path=self.xtle_path)
            or Directory.objects.projects)

    def get_object(self):
        return self.object

    def get_form(self):
        # kwargs = self.resolved.kwargs.copy()
        return self.form_class(dict(path=self.path, offset=0))

    @property
    def offset(self):
        return self.request_kwargs.get("offset") or 0

    @property
    def limit(self):
        return TOP_CONTRIBUTORS_CHUNK_SIZE

    @cached_property
    def scores(self):
        return scores.get(
            self.score_context.__class__)(
                self.score_context)

    @property
    def score_context(self):
        (language_code, project_code,
         dir_path, filename) = split_xtle_path(self.path)
        if language_code and project_code:
            return self.object.translationproject
        elif language_code:
            return Language.objects.get(code=language_code)
        elif project_code:
            return Project.objects.get(code=project_code)
        return ProjectSet(
            Project.objects.for_user(self.user)
                           .select_related("directory"))

    def get_context_data(self, **kwargs_):

        def scores_to_json(score):
            score["user"] = score["user"].to_dict()
            return score
        top_scorers = self.scores.display(
            offset=self.offset,
            limit=self.limit,
            formatter=scores_to_json)
        return dict(
            items=list(top_scorers),
            has_more_items=(
                len(self.scores.top_scorers)
                > (self.offset + self.limit)))

    @property
    def data(self):
        # data = self.get_context_data()
        return {
            "api": {"xtle.stats": []}}


class LanguageAdminAPI(DataAPI):

    @property
    def data(self):
        return {
            "api": {
                "xtle.admin.languages": {
                    "languages": ["en", "ca", "es"]}}}


class ProjectAdminAPI(DataAPI):

    @property
    def data(self):
        return {
            "api": {
                "xtle.admin.projects": {
                    "projects": ["en", "ca", "es"]}}}


class UserAdminAPI(DataAPI):

    @property
    def data(self):
        search = UserSearch(fields=["text", "md5"])
        return {"api": {"xtle.admin.user.search": search.data}}


class TeamAdminAPI(DataAPI):

    @property
    def data(self):
        return {"api": {"xtle.admin.teams": {"teams": ["en", "ca", "es"]}}}
