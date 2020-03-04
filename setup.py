# -*- coding: utf-8 -*-

import os
from setuptools import setup, find_namespace_packages


REQUIREMENTS = [
    "babel",
    "chango.core@git+https://github.com/phlax/chango.core#egg=chango.core",
    ("dj.subcommand"
     "@git+https://github.com/phlax/dj.subcommand#egg=dj.subcommand"),
    ("django-haystack"
     "@git+https://github.com/phlax/django-haystack#egg=django-haystack"),
    ("django-remote-forms"
     "@git+https://github.com/phlax/django-remote-forms"
     "#egg=django-remote-forms"),
    "channels",
    "dirsync",
    "django.contrib.comments",
    "django-allauth",
    "django-bulk_update",
    "django-redis",
    "django-sortedm2m",
    "elasticsearch>=5,<6",
    "jsonfield",
    "lxml",
    "psycopg2-binary",
    "pycountry",
    ("python-bcp47-l10n"
     "@git+https://github.com/phlax/python-bcp47-l10n#egg=python-bcp47-l10n"),
    "python-levenshtein",
    "scandir",
    "termcolor",
    "translate-toolkit"]

TEST_REQUIREMENTS = [
    'flake8==2.4.1',
    'pytest',
    'pytest-cov',
    "pytest-django",
    'codecov',
    "termcolor"]

README = os.path.join(
    os.path.abspath(os.path.dirname(__file__)),
    'README.md')
with open(README, encoding='utf-8') as f:
    LONG_DESCRIPTION = f.read()


setup(
    name='xtle',
    version="0.0.1",
    license='GPL3',
    url='https://github.com/phlax/l10n.xtle',
    description=(''),
    long_description=LONG_DESCRIPTION,
    long_description_content_type='text/markdown',
    author='Ryan Northey',
    author_email='ryan@synca.io',
    project_urls={
        'Source': 'https://github.com/phlax/l10n.xtle/',
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        ('License :: OSI Approved :: '
         'GNU General Public License v3 or later (GPLv3+)'),
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
    package_dir={"": "src"},
    packages=find_namespace_packages(where="src", include=["xtle.*"]),
    include_package_data=True,
    zip_safe=False,
    install_requires=REQUIREMENTS,
    extras_require={
        "install": REQUIREMENTS,
        'test': TEST_REQUIREMENTS}
)
