
from haystack import indexes

from .models import Project


class ProjectIndex(indexes.ModelSearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr="fullname")
    code = indexes.CharField(model_attr='code')

    class Meta(object):
        model = Project

    def get_model(self):
        return Project

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
