# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.conf.urls import include, url

from .views import (AdminTemplateView, PageCreateView, PageDeleteView,
                    PageUpdateView, display_page, legal_agreement,
                    preview_content)


page_patterns = [
    url(r'^legal/agreement/$',
        legal_agreement,
        name='xtle-staticpages-legal-agreement'),
    url(r'^(?P<virtual_path>.+)/$',
        display_page,
        name='xtle-staticpages-display'),
]

admin_patterns = [
    url(r'^$',
        AdminTemplateView.as_view(),
        name='xtle-staticpages'),

    url(r'^(?P<page_type>[^/]+)/add/?$',
        PageCreateView.as_view(),
        name='xtle-staticpages-create'),
    url(r'^(?P<page_type>[^/]+)/(?P<pk>\d+)/?$',
        PageUpdateView.as_view(),
        name='xtle-staticpages-edit'),
    url(r'^(?P<page_type>[^/]+)/(?P<pk>\d+)/delete/?$',
        PageDeleteView.as_view(),
        name='xtle-staticpages-delete'),
]


xhr_patterns = [
    url(r'^preview/?$',
        preview_content,
        name='xtle-xhr-preview'),
]


urlpatterns = [
    url(r'^pages/',
        include(page_patterns)),
    url(r'^xhr/',
        include(xhr_patterns)),
]
