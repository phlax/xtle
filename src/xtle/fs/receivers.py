# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.dispatch import receiver

from xtle.core.exceptions import NotConfiguredError
from xtle.core.signals import filetypes_changed
from xtle.project.models import Project

from .utils import FSPlugin


@receiver(filetypes_changed, sender=Project)
def handle_project_filetypes_changed(**kwargs):
    project = kwargs["instance"]
    try:
        FSPlugin(project).expire_sync_cache()
    except NotConfiguredError:
        pass
