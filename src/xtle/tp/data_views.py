
from collections import OrderedDict

from chango.core.data import Data

from xtle.app.models import Directory
from xtle.app.search import DirectorySearch
from xtle.app.views import BrowseData
from xtle.core.delegate import search_backend, scores
from xtle.store.forms import UnitSearchForm
from xtle.store.models import Unit
from xtle.store.unit.results import GroupedResults

from .search import TPSearchContext


class TPTranslateData(Data):

    def get_data(self):
        context = super(TPTranslateData, self).get_data()
        kwargs = self.kwargs
        kwargs["filename"] = kwargs.get("filename", "")
        project_code = kwargs["project_code"]
        # language_code = kwargs["language_code"]
        search_form = UnitSearchForm(dict(path=self.path), user=self.user)
        if not search_form.is_valid():
            # fix this validation
            errors = search_form.errors.as_data()
            if "path" in errors:
                for error in errors["path"]:
                    if error.code == "max_length":
                        return dict(errors=['Path too long.'])
                    elif error.code == "required":
                        return dict(errors=['Arguments missing.'])
                return dict(errors=["form invalid"])
        total, start, end, units_qs = search_backend.get(Unit)(
            self.user, **search_form.cleaned_data).search()
        context["data"] = {
            'start': start,
            'end': end,
            'total': total,
            'units': GroupedResults(units_qs).data}
        context["data"]["languages"] = (
            TPSearchContext(
                user=self.user,
                project=project_code,
                fields=["language_code"],
                flat=True).data)
        context["data"]["projects"] = OrderedDict(
            TPSearchContext(
                user=self.user,
                project=project_code,
                fields=["language_code", "language"]).data)
        return context


def check_permission(permission_codename, user, obj=None):
    """Checks if the current user has `permission_codename`
    permissions.
    """
    if user.is_superuser:
        return True

    # `view` permissions are project-centric, and we must treat them
    # differently
    if permission_codename == 'view':
        if obj is None:
            return True  # Always allow to view language pages
        return obj.is_accessible_by(user)

    permissions = user.get_user_permissions()
    return (
        "administrate" in permissions
        or permission_codename in permissions)


class TPData(BrowseData):

    @property
    def has_admin_access(self):
        if self.user.is_anonymous:
            return False
        return check_permission('administrate', self.user)

    @property
    def store_data(self):
        context = super(TPData, self).get_data()
        language_code = self.kwargs["language_code"]
        project_code = self.kwargs["project_code"]
        # dir_path = self.kwargs["dir_path"]
        # for menus
        context["data"]["languages"] = (
            TPSearchContext(
                user=self.user,
                project=project_code,
                fields=["language_code"],
                flat=True).data)
        context["data"]["projects"] = OrderedDict(
            TPSearchContext(
                user=self.user,
                language=language_code,
                fields=["project_code", "project"]).data)
        return context

    def get_data(self):
        if self.kwargs.get("filename"):
            return self.store_data
        context = super(TPData, self).get_data()
        language_code = self.kwargs["language_code"]
        project_code = self.kwargs["project_code"]
        # dir_path = self.kwargs["dir_path"]
        dirs = DirectorySearch(
            user=self.user,
            project=project_code,
            language=language_code,
            fields=("text", ),
            flat=True,
            models=(Directory, ),
            path=self.path).data
        dirs = [d.rstrip('/').split('/')[-1] for d in dirs]
        directory = Directory.objects.get(xtle_path=self.path)
        stats = directory.data_tool.get_stats()["children"]
        schema = [
            "code", "dir", "critical", "total",
            "fuzzy", "translated", "suggestions",
            "last_created_unit__pk"]
        context["data"]["__schema__"].update(dict(children=schema))
        context["data"]['children'] = [
            [x.split("-")[-1]] + [x in dirs] + [y[s] for s in schema[2:]]
            for x, y in stats.items()]

        # for menus
        context["data"]["languages"] = (
            TPSearchContext(
                user=self.user,
                project=project_code,
                fields=["language_code"],
                flat=True).data)
        context["data"]["projects"] = OrderedDict(
            TPSearchContext(
                user=self.user,
                language=language_code,
                fields=["project_code", "project"]).data)

        # tp = TranslationProject.objects.get(
        #     xtle_path="/%s/%s/" % (language_code, project_code))
        # scores = self.scores(tp)
        return context

    def scores(self, score_context):
        return scores.get(
            score_context.__class__)(
                score_context)
