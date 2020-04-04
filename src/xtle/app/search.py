
from xtle.core.search import SearchContext
from xtle.store.models import Store

from .models import Directory


class DirectorySearch(SearchContext):

    def __init__(self, user, project=None, language=None, path="",
                 fields=None, models=None, flat=False):
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
        return self._models or (Directory, Store)

    @property
    def fields(self):
        return self._fields or ["text", "total_words", "critical", "fuzzy"]

    @property
    def filters(self):
        return dict(
            level=self.path.count('/'),
            text__startswith="/%s/%s/" % (self.language, self.project))
