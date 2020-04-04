# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from functools import lru_cache

from django.core.management.base import BaseCommand, CommandError

from xtle.core.exceptions import MissingPluginError, NotConfiguredError
from xtle.fs.display import ResponseDisplay
from xtle.fs.exceptions import FSStateError
from xtle.fs.utils import FSPlugin
from xtle.project.models import Project

RESPONSE_COLORMAP = dict(
    xtle_added=(None, "MISSING"),
    fs_added=("MISSING", None),
    remove=("MISSING", "MISSING"))


class BaseSubCommand(BaseCommand):
    requires_system_checks = False


class ProjectSubCommand(BaseSubCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            'project',
            type=str,
            help='Xtle project')
        super(ProjectSubCommand, self).add_arguments(parser)

    @lru_cache()
    def get_fs(self, project_code):
        project = self.get_project(project_code)
        try:
            return FSPlugin(project)
        except (NotConfiguredError, MissingPluginError) as e:
            raise CommandError(e)

    @lru_cache()
    def get_project(self, project_code):
        try:
            return Project.objects.get(code=project_code)
        except Project.DoesNotExist as e:
            raise CommandError(e)


class FSAPISubCommand(ProjectSubCommand):

    def add_arguments(self, parser):
        super(FSAPISubCommand, self).add_arguments(parser)
        parser.add_argument(
            '-p', '--fs-path',
            action='store',
            dest='fs_path',
            help='Filter translations by filesystem path')
        parser.add_argument(
            '-P', '--xtle-path',
            action='store',
            dest='xtle_path',
            help='Filter translations by Xtle path')

    def handle_api_options(self, options):
        return {
            k: v
            for k, v
            in options.items()
            if k in [
                "xtle_path", "fs_path", "merge",
                "force", "xtle_wins"]}

    def handle_api(self, **options):
        api_method = getattr(
            self.get_fs(options["project"]),
            self.api_method)
        try:
            return api_method(**self.handle_api_options(options))
        except FSStateError as e:
            raise CommandError(e)

    def display(self, **options):
        return ResponseDisplay(
            self.handle_api(**options))

    @property
    def colormap(self):
        return RESPONSE_COLORMAP

    @lru_cache()
    def get_style(self, key):
        xtle_style, fs_style = self.colormap.get(key, (None, None))
        if xtle_style:
            xtle_style = getattr(self.style, "FS_%s" % xtle_style)
        if fs_style:
            fs_style = getattr(self.style, "FS_%s" % fs_style)
        return xtle_style, fs_style

    def is_empty(self, display):
        return not display.context.made_changes

    def handle(self, *args, **options):
        display = self.display(**options)
        if self.is_empty(display):
            self.stdout.write(str(display).strip())
            self.stdout.write("")
            return
        for section in display.sections:
            section = display.section(section)
            self.stdout.write(section.title, self.style.HTTP_INFO)
            self.stdout.write("-" * len(section.title), self.style.HTTP_INFO)
            if section.description:
                self.stdout.write(section.description)
            self.stdout.write("")
            for item in section.items:
                xtle_style, fs_style = self.get_style(item.section)
                self.write_line(
                    item.xtle_path,
                    item.fs_path,
                    xtle_style=xtle_style, fs_style=fs_style)
            self.stdout.write("")
        self.stdout.write("")

    def write_line(self, xtle_path, fs_path,
                   xtle_style=None, fs_style=None):
        self.stdout.write("  %s" % xtle_path, xtle_style)
        self.stdout.write("   <-->  ", ending="")
        self.stdout.write(fs_path, fs_style)