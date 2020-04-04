
from django import forms

from .models import Language


class LanguageAddForm(forms.ModelForm):

    class Meta(object):
        model = Language
        fields = ["fullname"]
        fieldsets = (
            ("main",
             {"fields": ["fullname"],
              "label": "Language configuration"}), )
