# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from fnmatch import translate

from django.utils.functional import cached_property

from xtle.core.exceptions import MissingPluginError, NotConfiguredError

from .delegate import fs_plugins


class PathFilter(object):

    def path_regex(self, path):
        return translate(path).replace(r"\Z(?ms)", "$")


class StorePathFilter(PathFilter):
    """Filters Stores (only xtle_path)
    xtle_path should be file a glob
    the glob is converted to a regex and used to filter a qs
    """

    def __init__(self, xtle_path=None):
        self.xtle_path = xtle_path

    @cached_property
    def xtle_regex(self):
        if not self.xtle_path:
            return
        return self.path_regex(self.xtle_path)

    def filtered(self, qs):
        if not self.xtle_regex:
            return qs
        return qs.filter(xtle_path__regex=self.xtle_regex)


class StoreFSPathFilter(StorePathFilter):
    """Filters StoreFS
    xtle_path and fs_path should be file globs
    these are converted to regexes and used to filter a qs
    """

    def __init__(self, xtle_path=None, fs_path=None):
        super(StoreFSPathFilter, self).__init__(xtle_path=xtle_path)
        self.fs_path = fs_path

    @cached_property
    def fs_regex(self):
        if not self.fs_path:
            return
        return self.path_regex(self.fs_path)

    def filtered(self, qs):
        qs = super(StoreFSPathFilter, self).filtered(qs)
        if not self.fs_regex:
            return qs
        return qs.filter(path__regex=self.fs_regex)


class FSPlugin(object):
    """Wraps a Project to access the configured FS plugin"""

    def __init__(self, project):
        self.project = project
        plugins = fs_plugins.gather(self.project.__class__)
        fs_type = project.config.get("xtle_fs.fs_type")
        fs_url = project.config.get("xtle_fs.fs_url")
        if not fs_type or not fs_url:
            missing_key = "xtle_fs.fs_url" if fs_type else "xtle_fs.fs_type"
            raise NotConfiguredError('Missing "%s" in project configuration.' %
                                     missing_key)
        try:
            self.plugin = plugins[fs_type](self.project)
        except KeyError:
            raise MissingPluginError(
                "No such plugin: %s" % fs_type)

    @property
    def __class__(self):
        return self.plugin.__class__

    def __getattr__(self, k):
        return getattr(self.plugin, k)

    def __eq__(self, other):
        return self.plugin.__eq__(other)

    def __str__(self):
        return str(self.plugin)


def parse_fs_url(fs_url):
    fs_type = 'localfs'
    chunks = fs_url.split('+', 1)
    if len(chunks) > 1:
        if chunks[0] in fs_plugins.gather().keys():
            fs_type = chunks[0]
            fs_url = chunks[1]
    return fs_type, fs_url
