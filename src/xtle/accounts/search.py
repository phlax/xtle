
from xtle.core.search import SearchContext

from .models import User


class UserSearch(SearchContext):

    def __init__(self, fields=None, models=None, flat=False):
        self.flat = flat
        if models:
            self._models = models
        if fields:
            self._fields = fields

    @property
    def models(self):
        return self._models or (User, )

    @property
    def fields(self):
        return (
            self._fields
            or ["text"])
