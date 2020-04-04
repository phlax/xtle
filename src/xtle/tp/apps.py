
import importlib

from django.apps import AppConfig


class XTLETPConfig(AppConfig):
    name = 'xtle.tp'
    label = 'xtle_tp'
    verbose_name = "XTLE TP"

    def ready(self):
        importlib.import_module("xtle.tp.providers")
