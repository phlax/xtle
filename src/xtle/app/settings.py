"""
Django settings for XTLE project.
"""

# import json
import os
# from base64 import b64decode


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.getcwd()
# os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'u7%ve8&gk34enftjn@2w#2mvoyi!@0vfu*#5k6dp8#rvg7d-gt'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'xtle.app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ["./templates"],
        'OPTIONS': {
            "loaders": ["chango.core.templates.ChannelsTemplateLoader"],
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'xtle.app.wsgi.application'
ASGI_APPLICATION = 'chango.core.asgi.application'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": "postgres",
        "NAME": "xtledb",
        "USER": "xtle",
        "PASSWORD": "PASSWORD"
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': (
        'django.contrib.auth.password_validation'
        '.UserAttributeSimilarityValidator')},
    {'NAME': (
        'django.contrib.auth.password_validation'
        '.MinimumLengthValidator')},
    {'NAME': (
        'django.contrib.auth.password_validation'
        '.CommonPasswordValidator')},
    {'NAME': (
        'django.contrib.auth.password_validation'
        '.NumericPasswordValidator')},
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = "static"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "assets/static"),
]


# Cache Backend settings
#
# By default we use Redis as our main cache backend as we potentially rely on
# features specific to Redis.  Other backends will likely not work.
#
# For more information, check
# https://docs.djangoproject.com/en/1.10/topics/cache/#setting-up-the-cache
# and http://niwibe.github.io/django-redis/
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
        'TIMEOUT': 60,
    },
    'redis': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/2',
        'TIMEOUT': None,
    },
    'lru': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/3',
        'TIMEOUT': 604800,  # 1 week
    },
    'exports': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': './exports/',
        'TIMEOUT': 259200,  # 3 days.
    },
}


XTLE_TRANSLATION_DIRECTORY = 'translations'
XTLE_FS_WORKING_PATH = os.path.abspath(os.path.join('.xtle_fs', 'tmp'))

#
# Scoring
#

XTLE_SCORES = {
    'suggestion_add': 0,
    'suggestion_accept': .1,
    'suggestion_reject': .1,
    'comment_updated': .1,
    'target_updated': .3,
    'state_translated': .6,
    'state_fuzzy': .1,
    'state_unfuzzy': .1,
}


AUTH_USER_MODEL = 'xtle_accounts.User'

XTLE_WORDCOUNT_FUNC = 'translate.storage.statsdb.wordcount'

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': (
            'haystack.backends.elasticsearch5_backend'
            '.Elasticsearch5SearchEngine'),
        'URL': 'http://elasticsearch:9200/',
        'INDEX_NAME': 'xtle',
    },
}

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'
HAYSTACK_LIMIT_TO_REGISTERED_MODELS = True

XTLE_CACHE_TIMEOUT = 604800


DJ_CHANNELS_SITE_TITLE = "XTLE translation and localisation environment"
DJ_CHANNELS_API = 'xtle.app.channels.XTLEAPI'
# DJ_CHANNELS_SOCKET = "ws://localhost:8000/ws"
DJ_CHANNELS_ASSETS = "assets"
DJ_CHANNELS_LOCALE_DIRS = ["locale"]
DJ_CHANNELS_LOCALE_APPS = ["dj.channels.ui"]
DJ_CHANNELS_RECONNECTS = [
    [12, 10],
    [20, 60],
    ["*", 300]]

DJ_CHANNELS_AVATAR_CACHE = dict(
    ttl="7  * 24 * 3600 * 1000",
    size=100)


AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
]


AUTH_USER_MODEL = 'xtle_accounts.User'

# APP_CONFIG = json.loads(b64decode(os.environ["APP_CONFIG"]))
# INSTALLED_APPS=APP_CONFIG["INSTALLED_APPS"] + APP_CONFIG["NOT_INSTALLED_APPS"]

INSTALLED_APPS = [
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "haystack",
    "xtle",
    "xtle.accounts",
    "xtle.app",
    "xtle.core",
    "xtle.tp",
    "xtle.language",
    "xtle.project",
    "xtle.format",
    "xtle.store",
    "xtle.statistics",
    "xtle.config",
    "xtle.fs",
    "xtle.revision",
    "xtle.data",
    "xtle.score",
    "xtle.staticpages",
    "xtle.log",
    "xtle.team",
    "chango.core"
]
