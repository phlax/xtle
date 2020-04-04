
from xtle.tp.search import TPSearchContext

from .models import Project


class ProjectSearch(TPSearchContext):

    def __init__(self, user, language=None, fields=None,
                 models=None, flat=False):
        self.user = user
        self.language = language
        self.flat = flat
        if models:
            self._models = models
        elif not language:
            self._models = (Project, )
            self._fields = ["code", "text", "total_words"]
        if fields:
            self._fields = fields
        elif not self._fields:
            self._fields = [
                "project", "project_code",
                "total_words", "fuzzy", "critical"]

    @property
    def filters(self):
        if self.language:
            return dict(language_code=self.language)
        return {}
