
from xtle.tp.search import TPSearchContext

from .models import Language


class LanguageSearch(TPSearchContext):

    def __init__(self, user=None, project=None, fields=None,
                 models=None, flat=False):
        self.user = user
        self.project = project
        self.flat = flat
        if models:
            self._models = models
        elif not project:
            self._models = (Language, )
            self._fields = ["code", "total_words"]
        if fields:
            self._fields = fields
