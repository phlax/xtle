
import hashlib

from haystack import indexes

from .models import User


class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr="username")
    name = indexes.CharField(model_attr="full_name")
    md5 = indexes.CharField()

    class Meta(object):
        model = User

    def get_model(self):
        return User

    def prepare_md5(self, user):
        if user.email:
            return hashlib.md5(user.email.encode("utf8")).hexdigest()

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.exclude(
            username__in=("system", "default", "nobody"))
