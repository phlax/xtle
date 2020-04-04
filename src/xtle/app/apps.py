
import importlib

from django.apps import AppConfig


class XTLEAppConfig(AppConfig):
    name = 'xtle.app'
    label = 'xtle_app'
    verbose_name = "XTLE App"

    def ready(self):
        importlib.import_module("xtle.app.providers")
