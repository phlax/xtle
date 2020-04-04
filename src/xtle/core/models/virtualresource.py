# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.


from ..mixins import TreeItem


class VirtualResource(TreeItem):
    """An object representing a virtual resource.

    A virtual resource doesn't live in the DB and has a unique
    `xtle_path` of its own. It's a simple collection of actual
    resources.

    For instance, this can be used in projects to have cross-language
    references.

    Don't use this object as-is, rather subclass it and adapt the
    implementation details for each context.
    """

    def __init__(self, resources, xtle_path, *args, **kwargs):
        self.resources = resources  #: Collection of underlying resources
        self.xtle_path = xtle_path
        self.context = kwargs.pop("context", None)
        super(VirtualResource, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return self.xtle_path

    # # # TreeItem

    def get_children(self):
        return self.resources

    def get_cachekey(self):
        return self.xtle_path

    # # # /TreeItem
