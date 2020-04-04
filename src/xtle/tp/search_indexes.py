
from haystack import indexes

from .models import TranslationProject


class TranslationProjectIndex(indexes.ModelSearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr="code")
    language_code = indexes.CharField(model_attr='language__code')
    project_code = indexes.CharField(model_attr='project__code')
    language = indexes.CharField(model_attr='language__fullname')
    project = indexes.CharField(model_attr='project__fullname')
    total_words = indexes.IntegerField()
    critical = indexes.IntegerField()
    fuzzy = indexes.IntegerField()

    class Meta(object):
        model = TranslationProject

    _stats = None
    _obj = None

    def _get_stats(self, obj):
        if self._obj == obj and self._stats:
            return self._stats
        self._obj = obj
        self._stats = obj.data_tool.get_stats()
        return self._stats

    def prepare_total_words(self, obj):
        return self._get_stats(obj)["total"]

    def prepare_critical(self, obj):
        return self._get_stats(obj)["critical"]

    def prepare_fuzzy(self, obj):
        return self._get_stats(obj)["fuzzy"]

    def get_model(self):
        return TranslationProject

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
