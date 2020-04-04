# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.core.exceptions import ValidationError
from django.db import models

from xtle.language.models import Language
from xtle.project.models import Project
from xtle.store.models import Store


def validate_store_fs(**kwargs):
    """When creating or saving a StoreFS, validate that it has the necessary
    information.
    """
    store = kwargs.get("store")
    project = kwargs.get("project")
    xtle_path = kwargs.get("xtle_path")
    path = kwargs.get("path")

    # We must have a xtle_path somehow
    if not (store or xtle_path):
        raise ValidationError(
            "Either store or xtle_path must be set")

    # Lets see if there is a Store matching xtle_path
    if not store:
        try:
            store = Store.objects.get(xtle_path=xtle_path)
        except Store.DoesNotExist:
            pass

    if store:
        if not project:
            project = store.translation_project.project

        if not xtle_path:
            xtle_path = store.xtle_path

        # If store is set then xtle_path should match
        if store.xtle_path != xtle_path:
            raise ValidationError(
                "Store.xtle_path must match xtle_path: %s %s"
                % (xtle_path, store.xtle_path))

    # We must be able to calculate a xtle_path and path
    if not (xtle_path and path):
        raise ValidationError(
            "StoreFS must be created with at least a xtle_path and path")

    # If project is not set then get from the xtle_path
    try:
        path_project = Project.objects.get(code=xtle_path.split("/")[2])
    except (IndexError, Project.DoesNotExist):
        raise ValidationError("Unrecognised project in path: %s" % xtle_path)

    if not project:
        project = path_project
    elif project != path_project:
        raise ValidationError(
            "Path does not match project: %s %s"
            % (project, xtle_path))

    # Ensure language exists
    if not store:
        try:
            Language.objects.get(code=xtle_path.split("/")[1])
        except (IndexError, Language.DoesNotExist):
            raise ValidationError(
                "Unrecognised language in path: %s"
                % xtle_path)

    kwargs["project"] = project
    kwargs["store"] = store
    kwargs["xtle_path"] = xtle_path
    return kwargs


class StoreFSManager(models.Manager):

    def create(self, *args, **kwargs):
        kwargs = validate_store_fs(**kwargs)
        return super(StoreFSManager, self).create(*args, **kwargs)
