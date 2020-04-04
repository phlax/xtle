
from chango.core.api import ChannelsAPI
from chango.core.exceptions import APIException

from xtle.core.delegate import data_api


class XTLEAPI(ChannelsAPI):

    def __call__(self, *args, **kwargs):
        try:
            return super(XTLEAPI, self).__call__(*args, **kwargs)
        except APIException:
            return data_api.gather()[kwargs["api"]](
                self.consumer, *args, **kwargs).data
