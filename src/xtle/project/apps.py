
import importlib

from django.apps import AppConfig


class XTLEProjectConfig(AppConfig):
    name = 'xtle.project'
    label = 'xtle_project'
    verbose_name = "XTLE Project"
    version = "0.1.6"

    def ready(self):
        importlib.import_module("xtle.project.getters")
        importlib.import_module("xtle.project.receivers")
        importlib.import_module("xtle.project.providers")
