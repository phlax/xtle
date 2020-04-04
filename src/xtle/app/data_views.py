
from collections import OrderedDict

from django_remote_forms.forms import RemoteForm

from xtle.core.views import Data
from xtle.language.search import LanguageSearch
from xtle.project.search import ProjectSearch
from xtle.accounts.search import UserSearch

from xtle.accounts.forms import UserAddForm
from xtle.project.forms import ProjectAddForm


class WelcomeData(Data):

    def get_data(self):
        context = super(WelcomeData, self).get_data()
        language_data = LanguageSearch(self.user).data
        context["data"].update(
            dict(
                language_activity=language_data,
                project_activity=ProjectSearch(self.user).data))
        return context


class AdminData(Data):

    def get_data(self):
        context = super(AdminData, self).get_data()
        return context


class LanguageAdminData(Data):

    def get_data(self):
        context = super(LanguageAdminData, self).get_data()
        return context


class LanguagesAdminData(Data):

    def get_data(self):
        context = super(LanguagesAdminData, self).get_data()
        context["data"]["__schema__"]["xtle.admin.languages"] = ["code"]
        context["data"]["xtle.admin.languages"] = (
            LanguageSearch(user=self.user).data)
        return context


class LanguageAdminAddData(Data):

    def get_data(self):
        context = super(LanguageAdminAddData, self).get_data()
        form = ProjectAddForm()
        context["data"]["form"] = RemoteForm(form).as_dict()
        context["data"]["form"]["fieldsets"] = OrderedDict(form.Meta.fieldsets)
        return context


class ProjectAdminData(Data):

    def get_data(self):
        context = super(ProjectAdminData, self).get_data()
        return context


class ProjectAdminAddData(Data):

    def get_data(self):
        context = super(ProjectAdminAddData, self).get_data()
        form = ProjectAddForm()
        context["data"]["form"] = RemoteForm(form).as_dict()
        context["data"]["form"]["fieldsets"] = OrderedDict(form.Meta.fieldsets)
        return context


class ProjectsAdminData(Data):

    def get_data(self):
        context = super(ProjectsAdminData, self).get_data()
        context["data"]["__schema__"]["xtle.admin.projects"] = ["code", "name"]
        context["data"]["xtle.admin.projects"] = (
            ProjectSearch(user=self.user).data)
        return context


class UserAdminData(Data):

    def get_data(self):
        context = super(UserAdminData, self).get_data()
        return context


class UserAdminAddData(Data):

    def get_data(self):
        context = super(UserAdminAddData, self).get_data()
        form = UserAddForm()
        context["data"]["form"] = RemoteForm(form).as_dict()
        context["data"]["form"]["fieldsets"] = OrderedDict(form.Meta.fieldsets)
        return context


class UsersAdminData(Data):

    def get_data(self):
        context = super(UsersAdminData, self).get_data()
        context["data"]["users"] = UserSearch(fields=["text", "md5"]).data
        return context
