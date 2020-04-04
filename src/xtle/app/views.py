
import hashlib
from collections import OrderedDict
from functools import lru_cache

import pycountry

import bcp47l10n

from translate.storage.factory import getclass

from chango.core.views import ChannelView
from chango.core.data import Data

from xtle.language.search import LanguageSearch


@lru_cache()
def get_translations(language_code):
    return parse_locale_po(language_code)


def parse_iso_po(lang, site_langs):
    unitdict = OrderedDict()
    with open('xtle/src/@xtle/l10n/iso_639-3/%s.po' % lang, 'rb') as f:
        # content = f.read()
        pofile = getclass(f)(f)

        for unit in pofile.units[1:]:
            lang_code = unit.getnotes().split(" ")[-1]
            if lang_code == "cnr":
                a2 = "me"
            else:
                code = pycountry.languages.lookup(lang_code)
                a2 = getattr(code, "alpha_2", None)
                a3 = code.alpha_3
            if a2 in site_langs:
                unitdict[a2] = unit.target
            elif a3 in site_langs:
                unitdict[a3] = unit.target
    return unitdict


def parse_locale_po(lang):
    unitdict = OrderedDict()
    with open('locale/%s/xtle.po' % lang, 'rb') as f:
        # content = f.read()
        pofile = getclass(f)(f)

        for unit in pofile.units[1:]:
            unitdict[unit.getnotes().split("]")[0][1:]] = unit.target
    return unitdict


class XTLEChannelView(ChannelView):

    def parse_languages(self, locale):
        site_langs = LanguageSearch(fields=["code"], flat=True).data
        langs = dict()

        for lang_code in site_langs:
            langs[lang_code] = bcp47l10n.gettext(lang_code, locale)
        return langs

    def get_settings(self):
        settings = super(XTLEChannelView, self).get_settings()
        settings["xtle.languages.site"] = (
            self.parse_languages(
                self.accept_lang))
        return settings


class BrowseData(Data):

    def get_data(self):
        context = super(BrowseData, self).get_data()
        # context["data"]["scores"] = self.scores(tp).top_scorers
        context["data"]["__schema__"]["contributors"] = (
            "username", "md5", "score")
        context["data"]["contributors"] = (
            ("foo",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(),
             7),
            ("bar",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(),
             23),
            ("baz",
             hashlib.md5("ryan@3ca.org.uk".encode('utf-8')).hexdigest(),
             73))
        return context
