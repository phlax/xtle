
from django import forms

from .models import Project


class ProjectAddForm(forms.ModelForm):

    class Meta(object):
        model = Project
        fields = ["fullname"]
        fieldsets = (
            ("main",
             {"fields": ["fullname"],
              "label": "Project configuration"}), )
