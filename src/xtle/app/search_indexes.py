
from haystack import indexes

from .models import Directory


class DirectoryIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr="xtle_path")
    language = indexes.CharField(model_attr='tp__language__fullname')
    project = indexes.CharField(model_attr='tp__project__fullname')
    level = indexes.IntegerField()
    total_words = indexes.IntegerField()
    critical = indexes.IntegerField()
    fuzzy = indexes.IntegerField()

    class Meta(object):
        model = Directory

    _stats = None
    _obj = None

    def _get_stats(self, obj):
        if self._obj == obj and self._stats:
            return self._stats
        self._obj = obj
        self._stats = obj.data_tool.get_stats()
        return self._stats

    def prepare_total_words(self, obj):
        if obj.tp:
            return self._get_stats(obj)["total"]

    def prepare_critical(self, obj):
        if obj.tp:
            return self._get_stats(obj)["critical"]

    def prepare_fuzzy(self, obj):
        if obj.tp:
            return self._get_stats(obj)["fuzzy"]

    def prepare_level(self, obj):
        return obj.xtle_path.count('/') - 1

    def get_model(self):
        return Directory

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
