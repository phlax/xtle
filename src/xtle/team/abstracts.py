# -*- coding: utf-8 -*-
#
# Copyright (C) XTLE contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.db import models

from xtle.accounts.models import User


class AbstractTeam(models.Model):

    class Meta(object):
        abstract = True

    code = models.CharField(
        null=False,
        blank=False,
        unique=True,
        max_length=64,
        db_index=True)

    name = models.CharField(
        null=False,
        blank=False,
        max_length=64,
        db_index=True)

    all_projects = models.BooleanField(
        default=False,
        db_index=True)

    all_languages = models.BooleanField(
        default=False,
        db_index=True)

    members = models.ManyToManyField(
        User,
        related_name="team_members")
    contributors = models.ManyToManyField(
        User,
        related_name="team_contributors")
    translators = models.ManyToManyField(
        User,
        related_name="team_translators")
    reviewers = models.ManyToManyField(
        User,
        related_name="team_reviewers")
    admins = models.ManyToManyField(
        User,
        related_name="team_admins")
