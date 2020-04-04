
from xtle.core.delegate import data_api
from xtle.core.plugin import provider

from .data_api import (
    BreadcrumbPathsAPI, LanguageAdminAPI,
    ProjectAdminAPI, UserAdminAPI, TeamAdminAPI,
    StatsAPI)


@provider(data_api)
def gather_data_api(**kwargs_):
    return {
        "xtle.stats": StatsAPI,
        "xtle.admin.languages": LanguageAdminAPI,
        "xtle.admin.projects": ProjectAdminAPI,
        "xtle.admin.user.search": UserAdminAPI,
        "xtle.admin.teams": TeamAdminAPI,
        "xtle.breadcrumb.paths": BreadcrumbPathsAPI}
