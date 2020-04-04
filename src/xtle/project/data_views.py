
from collections import OrderedDict

from xtle.app.views import BrowseData
from xtle.core.delegate import data_tool
from xtle.language.search import LanguageSearch
from xtle.project.models import ProjectSet
from xtle.project.search import ProjectSearch
from xtle.tp.search import TPSearchContext

from .models import Project


class ProjectData(BrowseData):

    def get_data(self):
        context = super(ProjectData, self).get_data()
        project_code = self.kwargs["project_code"]
        project = Project.objects.get(code=project_code)
        stats = project.data_tool.get_stats()["children"]
        schema = [
            "code", "critical", "total",
            "fuzzy", "translated", "suggestions",
            "last_created_unit"]
        context["data"]["__schema__"].update(dict(children=schema))
        context["data"]['children'] = [
            ["-".join(x.split("-")[:-1])] + [y[s] for s in schema[1:]]
            for x, y in stats.items()]
        context["data"]["languages"] = (
            TPSearchContext(
                user=self.user,
                project=project_code,
                fields=["language_code"],
                flat=True).data)
        context["data"]["projects"] = OrderedDict(
            ProjectSearch(
                user=self.user,
                fields=["code", "text"]).data)
        if self.page:
            context["site_languages"] = self.site_languages
        return context


class ProjectsData(BrowseData):

    def get_data(self):
        context = super(ProjectsData, self).get_data()
        context["data"]["languages"] = LanguageSearch(
            user=self.user,
            fields=["code"],
            flat=True).data
        context["data"]["projects"] = OrderedDict(
            ProjectSearch(
                user=self.user,
                fields=["code", "text"]).data)

        schema = [
            "code", "name", "disabled", "critical", "total",
            "fuzzy", "translated", "suggestions"]

        context["data"]["__schema__"].update(dict(children=schema))
        user_projects = (
            Project.objects.for_user(self.user)
                           .select_related("directory"))
        project_set = ProjectSet(user_projects)
        stats = data_tool.get(ProjectSet)(project_set).get_stats()["children"]
        items = []
        for item in context["data"]["projects"].items():
            item = item + (False, )
            if item[0] in stats:
                for k in schema[3:]:
                    item += (stats[item[0]][k], )
            items.append(item)
        context["data"]["children"] = items

        if self.page:
            context["site_languages"] = self.site_languages
        return context
