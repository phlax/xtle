
from collections import OrderedDict

from django.shortcuts import get_object_or_404

from xtle.app.views import BrowseData
from xtle.tp.search import TPSearchContext

from .models import Language
from .search import LanguageSearch


class LanguageData(BrowseData):

    def get_data(self):
        context = super(LanguageData, self).get_data()
        language = get_object_or_404(
            Language,
            code=self.kwargs["language_code"])
        stats = language.data_tool.get_stats()["children"]
        context["data"]["projects"] = OrderedDict(
            TPSearchContext(
                user=self.user,
                language=language.code,
                fields=["project_code", "project"]).data)
        schema = [
            "code", "name", "critical", "total",
            "fuzzy", "translated", "suggestions",
            "last_created_unit"]
        context["data"]["__schema__"].update(dict(children=schema))
        context["data"]['children'] = [
            [x.split("-")[-1]]
            + [context['data']['projects'][x.split("-")[-1]]]
            + [y[s] for s in schema[2:]]
            for x, y in stats.items()]
        context["data"]["languages"] = LanguageSearch(
            user=self.user,
            fields=["code"],
            flat=True).data
        return context
