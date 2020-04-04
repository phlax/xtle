# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.contrib.auth import get_user_model
from django.dispatch import receiver

from xtle.core.delegate import crud
from xtle.core.signals import update


User = get_user_model()


@receiver(update, sender=User)
def handle_account_user_update(**kwargs):
    crud.get(User).update(**kwargs)
