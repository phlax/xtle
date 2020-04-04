# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from .abstracts import AbstractRevision


class Revision(AbstractRevision):

    class Meta(AbstractRevision.Meta):
        db_table = "xtle_revision"
