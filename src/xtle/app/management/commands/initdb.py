# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
#
# This file is a part of the Pootle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import logging
import os

from translate.lang import data, factory

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.utils.translation import ugettext_noop as _
from django.core.management import call_command

from xtle.core.contextmanagers import keep_data
from xtle.core.models import Revision
from xtle.core.signals import update_revisions
from xtle.app.models import Directory
from xtle.app.models.permissions import PermissionSet, get_xtle_permission
from xtle.format.models import Format
from xtle.fs.utils import FSPlugin
from xtle.language.models import Language
from xtle.project.models import Project
from xtle.staticpages.models import StaticPage as Announcement

from django.core.management.base import BaseCommand

from . import SkipChecksMixin


logger = logging.getLogger(__name__)


class InitDB(object):

    def init_db(self, create_projects=True):
        with transaction.atomic():
            with keep_data(signals=(update_revisions, )):
                self._init_db(create_projects)

    def _init_db(self, create_projects=True):
        """Populate the database with default initial data.

        This creates the default database to get a working Xtle installation.
        """

        self.create_formats()
        self.create_revision()
        self.create_essential_users()
        self.create_root_directories()
        self.create_template_languages()
        self.create_default_languages()
        if create_projects:
            self.create_terminology_project()
        self.create_xtle_permissions()
        self.create_xtle_permission_sets()
        if create_projects:
            self.create_default_projects()

    def create_formats(self):
        from xtle.core.delegate import formats

        formats.get().initialize()

    def _create_object(self, model_klass, **criteria):
        instance, created = model_klass.objects.get_or_create(**criteria)
        if created:
            logger.debug(
                "Created %s: '%s'",
                instance.__class__.__name__, instance)
        else:
            logger.debug(
                "%s already exists - skipping: '%s'",
                instance.__class__.__name__, instance)
        return instance, created

    def _create_xtle_user(self, **criteria):
        user, created = self._create_object(get_user_model(), **criteria)
        if created:
            user.set_unusable_password()
            user.save()
        return user

    def _create_xtle_permission_set(self, permissions, **criteria):
        permission_set, created = self._create_object(PermissionSet,
                                                      **criteria)
        if created:
            permission_set.positive_permissions.set(permissions)
            permission_set.save()
        return permission_set

    def create_revision(self):
        Revision.initialize()

    def create_essential_users(self):
        """Create the 'default' and 'nobody' User instances.

        These users are required for Xtle's permission system.
        """

        criteria = {
            'username': u"system",
            'full_name': u"system user",
            'is_active': True,
        }
        self._create_xtle_user(**criteria)

        # The nobody user is used to represent an anonymous user in cases
        # where we need to associate model information with such a user. An
        # example is in the permission system: we need a way to store rights
        # for anonymous users; thus we use the nobody user.
        criteria = {
            'username': u"nobody",
            'full_name': "any anonymous user",
            'is_active': True,
        }
        self._create_xtle_user(**criteria)

        # The 'default' user represents any valid, non-anonymous user and is
        # used to associate information any such user. An example is in the
        # permission system: we need a way to store default rights for users.
        # We use the 'default' user for this.
        #
        # In a future version of Xtle we should think about using Django's
        # groups to do better permissions handling.
        criteria = {
            'username': u"default",
            'full_name': "any authenticated user",
            'is_active': True,
        }
        self._create_xtle_user(**criteria)

    def create_xtle_permissions(self):
        """Create Xtle's directory level permissions."""

        args = {
            'app_label': "xtle_app",
            'model': "directory",
        }

        xtle_content_type = self._create_object(ContentType, **args)[0]
        xtle_content_type.save()

        # Create the permissions.
        permissions = [
            {
                'name': _("Can access a project"),
                'codename': "view",
            },
            {
                'name': _("Cannot access a project"),
                'codename': "hide",
            },
            {
                'name': _("Can make a suggestion for a translation"),
                'codename': "suggest",
            },
            {
                'name': _("Can submit a translation"),
                'codename': "translate",
            },
            {
                'name': _("Can review suggestions"),
                'codename': "review",
            },
            {
                'name': _("Can perform administrative tasks"),
                'codename': "administrate",
            },
        ]

        criteria = {
            'content_type': xtle_content_type,
        }

        for permission in permissions:
            criteria.update(permission)
            self._create_object(Permission, **criteria)

    def create_xtle_permission_sets(self):
        """Create the default permission set for the 'nobody' and 'default' users.

        'nobody' is the anonymous (non-logged in) user, and 'default' is the
        logged in user.
        """
        User = get_user_model()

        nobody = User.objects.get(username='nobody')
        default = User.objects.get(username='default')

        view = get_xtle_permission('view')
        suggest = get_xtle_permission('suggest')
        translate = get_xtle_permission('translate')

        # Default permissions for tree root.
        criteria = {
            'user': nobody,
            'directory': Directory.objects.root,
        }
        self._create_xtle_permission_set([view, suggest], **criteria)

        criteria['user'] = default
        self._create_xtle_permission_set(
            [view, suggest, translate], **criteria)

        # Default permissions for templates language.
        # Override with no permissions for templates language.
        criteria = {
            'user': nobody,
            'directory': Directory.objects.get(xtle_path="/templates/"),
        }
        self._create_xtle_permission_set([], **criteria)

        criteria['user'] = default
        self._create_xtle_permission_set([], **criteria)

    def require_english(self):
        """Create the English Language item."""
        criteria = {
            'code': "en",
            'fullname': u"English",
            'nplurals': 2,
            'pluralequation': "(n != 1)",
        }
        en = self._create_object(Language, **criteria)[0]
        return en

    def create_root_directories(self):
        """Create the root Directory items."""
        root = self._create_object(Directory, **dict(name=""))[0]
        self._create_object(Directory, **dict(name="projects", parent=root))

    def create_template_languages(self):
        """Create the 'templates' and English languages.

        The 'templates' language is used to give users access to the
        untranslated template files.
        """
        self._create_object(
            Language, **dict(code="templates", fullname="Templates"))
        self.require_english()

    def create_terminology_project(self):
        """Create the terminology project.

        The terminology project is used to display terminology suggestions
        while translating.
        """
        criteria = {
            'code': "terminology",
            'fullname': "Terminology",
            'source_language': self.require_english(),
            'checkstyle': "terminology",
        }
        po = Format.objects.get(name="po")
        terminology = self._create_object(Project, **criteria)[0]
        terminology.filetypes.add(po)
        terminology.config["xtle_fs.fs_type"] = "localfs"
        terminology.config["xtle_fs.fs_url"] = (
            "{XTLE_TRANSLATION_DIRECTORY}%s"
            % terminology.code)
        terminology.config["xtle_fs.translation_mappings"] = dict(
            default="/<language_code>/<dir_path>/<filename>.<ext>")
        print("creating terminology")
        plugin = FSPlugin(terminology)
        plugin.fetch()
        plugin.add()
        plugin.sync()
        print("done")

    def create_default_projects(self):
        """Create the default projects that we host.

        You might want to add your projects here, although you can also add
        things through the web interface later.
        """
        en = self.require_english()
        po = Format.objects.get(name="po")

        criteria = {
            'code': u"tutorial",
            'source_language': en,
            'fullname': u"Tutorial",
            'checkstyle': "standard"}
        tutorial = self._create_object(Project, **criteria)[0]
        tutorial.filetypes.add(po)
        tutorial.config["xtle_fs.fs_type"] = "localfs"
        tutorial.config["xtle_fs.fs_url"] = (
            "{XTLE_TRANSLATION_DIRECTORY}%s"
            % tutorial.code)
        tutorial.config["xtle_fs.translation_mappings"] = dict(
            default="/<language_code>/<dir_path>/<filename>.<ext>")
        plugin = FSPlugin(tutorial)
        plugin.fetch()
        plugin.add()
        plugin.sync()
        criteria = {
            'active': True,
            'title': "Project instructions",
            'body': (
                'Tutorial project where users can play with Xtle and learn '
                'more about translation and localisation.\n'
                '\n'
                'For more help on localisation, visit the [localization '
                'guide](http://docs.translatehouse.org/projects/'
                'localization-guide/en/latest/guide/start.html).'),
            'virtual_path': "announcements/projects/"+tutorial.code,
        }
        self._create_object(Announcement, **criteria)

    def create_default_languages(self):
        """Create the default languages."""

        # dont hardcode paths!
        locales = (
            set(os.listdir('translations/terminology'))
            | set(os.listdir('translations/tutorial')))

        # import languages from toolkit
        for ttkcode in data.languages.keys():
            code = ttkcode.replace("_", "-").replace("@", "-")
            if code not in locales:
                continue
            ttk_lang = factory.getlanguage(ttkcode)
            criteria = {
                'code': code,
                'nplurals': ttk_lang.nplurals,
                'pluralequation': ttk_lang.pluralequation}
            if hasattr(ttk_lang, "specialchars"):
                criteria['specialchars'] = ttk_lang.specialchars
            self._create_object(Language, **criteria)


class Command(SkipChecksMixin, BaseCommand):
    help = 'Populates the database with initial values: users, projects, ...'
    skip_system_check_tags = ('data', )

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-projects',
            action='store_false',
            dest='create_projects',
            default=True,
            help="Do not create the default 'terminology' and 'tutorial' "
                 "projects.")
        parser.add_argument(
            '--migrate',
            action='store_true',
            dest='migrate',
            help="Migrate the database before initialization.")
        parser.add_argument(
            '--demo-users',
            action='store_true',
            dest='demo_users',
            help="Create demo users.")

    def handle(self, **options):
        if options["migrate"]:
            self.stdout.write('Migrating the database.')
            call_command('migrate')

        self.stdout.write('Populating the database.')
        InitDB().init_db(options["create_projects"])
        self.stdout.write('Successfully populated the database.')

        if options["demo_users"]:
            self.stdout.write('Creating demo users.')
        else:
            self.stdout.write(
                "To create an admin user, use the `pootle "
                "createsuperuser` command.")
