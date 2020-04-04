
from django.urls import path
from django.conf.urls import url

from xtle.project.data_views import ProjectsData, ProjectData
from xtle.language.data_views import LanguageData
from xtle.tp.data_views import TPData, TPTranslateData
from .data_views import (
    AdminData, LanguageAdminAddData, LanguageAdminData, LanguagesAdminData,
    ProjectAdminAddData, ProjectAdminData, ProjectsAdminData, WelcomeData,
    UserAdminAddData, UserAdminData, UsersAdminData)
from xtle.team.data_views import (
    TeamAdminAddData, TeamAdminData, TeamsAdminData)

from .views import XTLEChannelView


urlpatterns = [

    path('', XTLEChannelView.as_view(data=WelcomeData), name='index'),

    url(r'^admin/$',
        XTLEChannelView.as_view(data=AdminData),
        name='xtle-admin'),

    # ADMIN: Languages
    url(r'^admin/languages/$',
        XTLEChannelView.as_view(data=LanguagesAdminData),
        name='xtle-admin-languages'),
    url(r'^admin/languages/add/$',
        XTLEChannelView.as_view(data=LanguageAdminAddData),
        name='xtle-admin-language-add'),
    url(r'^admin/languages/(?P<language_code>[^/]*)/$',
        XTLEChannelView.as_view(data=LanguageAdminData),
        name='xtle-admin-language'),

    # ADMIN: Projects
    url(r'^admin/projects/add/$',
        XTLEChannelView.as_view(data=ProjectAdminAddData),
        name='xtle-admin-project-add'),
    url(r'^admin/projects/$',
        XTLEChannelView.as_view(data=ProjectsAdminData),
        name='xtle-admin-projects'),
    url(r'^admin/projects/(?P<project_code>[^/]*)/$',
        XTLEChannelView.as_view(data=ProjectAdminData),
        name='xtle-admin-project'),

    # ADMIN: Users
    url(r'^admin/users/$',
        XTLEChannelView.as_view(data=UsersAdminData),
        name='xtle-admin-users'),
    url(r'^admin/users/add/$',
        XTLEChannelView.as_view(data=UserAdminAddData),
        name='xtle-admin-user-add'),
    url(r'^admin/users/(?P<user>[^/]*)/$',
        XTLEChannelView.as_view(data=UserAdminData),
        name='xtle-admin-user'),

    # ADMIN: Teams
    url(r'^admin/teams/$',
        XTLEChannelView.as_view(data=TeamsAdminData),
        name='xtle-admin-teams'),
    url(r'^admin/teams/add/$',
        XTLEChannelView.as_view(data=TeamAdminAddData),
        name='xtle-admin-team-add'),
    url(r'^admin/teams/(?P<team>[^/]*)/$',
        XTLEChannelView.as_view(data=TeamAdminData),
        name='xtle-admin-team'),

    url(r'^user/(?P<username>[^/]+)/$',
        XTLEChannelView.as_view(data=UserAdminData),
        name='xtle-user-profile'),

    # Project
    url(r'^projects/$',
        XTLEChannelView.as_view(data=ProjectsData),
        name='xtle-projects-browse'),
    url(r'^projects/(?P<project_code>[^/]*)/$',
        XTLEChannelView.as_view(data=ProjectData),
        name='xtle-project-browse'),
    url(r'^projects/(?P<project_code>[^/]*)/$',
        XTLEChannelView.as_view(data=ProjectData),
        name='xtle-project-browse'),

    # Lang
    url(r'^(?P<language_code>[^/]*)/$',
        XTLEChannelView.as_view(data=LanguageData),
        name='xtle-language-browse'),
    url(r'^(?P<language_code>[^/]*)/$',
        XTLEChannelView.as_view(data=LanguageData),
        name='xtle-language-browse'),

    # TP
    url(r'^(?P<language_code>[^/]*)/(?P<project_code>[^/]*)/'
        r'translate/(?P<dir_path>(.*/)*)?$',
        XTLEChannelView.as_view(data=TPTranslateData),
        name='xtle-tp-translate'),
    url(r'^(?P<language_code>[^/]*)/(?P<project_code>[^/]*)/'
        r'translate/(?P<dir_path>(.*/)*)(?P<filename>.*\.*)$',
        XTLEChannelView.as_view(data=TPTranslateData),
        name='xtle-tp-store-translate'),
    url(r'^(?P<language_code>[^/]*)/(?P<project_code>[^/]*)/'
        r'(?P<dir_path>(.*/)*)?$',
        XTLEChannelView.as_view(data=TPData),
        name='xtle-tp-browse'),
    url(r'^(?P<language_code>[^/]*)/(?P<project_code>[^/]*)/'
        r'(?P<dir_path>(.*/)*)(?P<filename>.*\.*)?$',
        XTLEChannelView.as_view(data=TPData),
        name='xtle-tp-store-browse')
]
