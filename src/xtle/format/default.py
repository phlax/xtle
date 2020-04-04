# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.


XTLE_FORMATS = [
    ("po",
     dict(title='Gettext PO',
          extension="po",
          template_extension="pot")),
    ("xliff",
     dict(title='XLIFF',
          extension="xliff",
          template_extension="xliff")),
    ("xlf",
     dict(title='XLIFF',
          extension="xlf",
          template_extension="xlf")),
    ("ts",
     dict(title='TS',
          extension="ts",
          template_extension="ts")),
    ("lang",
     dict(title='Mozilla Lang',
          extension="lang",
          template_extension="lang"))]