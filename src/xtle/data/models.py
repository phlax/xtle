# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.db import models

from .abstracts import AbstractXtleChecksData, AbstractXtleData


class StoreData(AbstractXtleData):

    class Meta(object):
        db_table = "xtle_store_data"

    store = models.OneToOneField(
        "xtle_store.Store",
        on_delete=models.CASCADE,
        db_index=True,
        related_name="data")

    def __unicode__(self):
        return self.store.xtle_path


class StoreChecksData(AbstractXtleChecksData):

    class Meta(AbstractXtleChecksData.Meta):
        db_table = "xtle_store_check_data"
        unique_together = ["store", "category", "name"]
        index_together = [AbstractXtleChecksData.Meta.index_together]

    store = models.ForeignKey(
        "xtle_store.Store",
        on_delete=models.CASCADE,
        db_index=False,
        related_name="check_data")

    def __unicode__(self):
        return self.store.xtle_path


class TPData(AbstractXtleData):

    class Meta(object):
        db_table = "xtle_tp_data"

    tp = models.OneToOneField(
        "xtle_tp.TranslationProject",
        on_delete=models.CASCADE,
        db_index=True,
        related_name="data")

    def __unicode__(self):
        return self.tp.xtle_path


class TPChecksData(AbstractXtleChecksData):

    class Meta(AbstractXtleChecksData.Meta):
        db_table = "xtle_tp_check_data"
        unique_together = ["tp", "category", "name"]
        index_together = [AbstractXtleChecksData.Meta.index_together]

    tp = models.ForeignKey(
        "xtle_tp.TranslationProject",
        on_delete=models.CASCADE,
        db_index=False,
        related_name="check_data")

    def __unicode__(self):
        return self.tp.xtle_path
