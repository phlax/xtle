
from django.urls import resolve


class DataAPI(object):

    def __init__(self, consumer, **kwargs):
        self.consumer = consumer
        self.kwargs = kwargs

    @property
    def path(self):
        return self.kwargs['path']

    @property
    def resolved(self):
        return resolve(self.path)

    @property
    def user(self):
        return self.consumer.scope["user"]
