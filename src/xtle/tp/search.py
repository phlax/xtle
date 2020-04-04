
from xtle.core.search import SearchContext

from .models import TranslationProject


class TPSearchContext(SearchContext):

    def __init__(self, user, project=None, language=None,
                 path="", fields=None, models=None, flat=False):
        self.user = user
        self.project = project
        self.language = language
        self.path = path
        self.flat = flat
        if models:
            self._models = models
        if fields:
            self._fields = fields

    @property
    def models(self):
        return self._models or (TranslationProject, )

    @property
    def fields(self):
        return (
            self._fields
            or ["language_code",
                "total_words",
                "fuzzy",
                "critical"])

    @property
    def filters(self):
        filters = {}
        if getattr(self, "project", None):
            filters["project_code"] = self.project
        if getattr(self, "language", None):
            filters["language_code"] = self.language
        return filters
