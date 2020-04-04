
from haystack import indexes

from .models import Store


class StoreIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr="xtle_path")
    language = indexes.CharField(model_attr='tp__language__fullname')
    project = indexes.CharField(model_attr='tp__project__fullname')
    level = indexes.IntegerField()
    total_words = indexes.IntegerField()
    critical = indexes.IntegerField()
    fuzzy = indexes.IntegerField()

    _stats = None
    _obj = None

    def _get_stats(self, obj):
        if self._obj == obj and self._stats is not None:
            return self._stats
        self._obj = obj
        if not obj.units.count():
            self._stats = {}
            return self._stats
        self._stats = obj.data_tool.get_stats()
        return self._stats

    def prepare_total_words(self, obj):
        if obj.tp:
            return self._get_stats(obj).get("total")

    def prepare_critical(self, obj):
        if obj.tp:
            return self._get_stats(obj).get("critical")

    def prepare_fuzzy(self, obj):
        if obj.tp:
            return self._get_stats(obj).get("fuzzy")

    class Meta(object):
        model = Store

    def prepare_level(self, obj):
        return obj.xtle_path.count('/')

    def get_model(self):
        return Store

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
