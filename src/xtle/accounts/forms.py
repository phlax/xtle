
from django import forms

from .models import User


class UserAddForm(forms.ModelForm):

    class Meta(object):
        model = User
        fields = ["username"]
        fieldsets = (
            ("main",
             {"fields": ["username"],
              "label": "User configuration"}), )
