
from xtle.core.data_api import DataAPI
from xtle.core.delegate import search_backend
from xtle.store.forms import UnitSearchForm
from xtle.store.models import Unit
from xtle.store.unit.results import GroupedResults


class StoreUnitsAPI(DataAPI):

    @property
    def data(self):
        context = {}
        search_form = UnitSearchForm(self.kwargs, user=self.user)
        if not search_form.is_valid():
            # fix this validation
            errors = search_form.errors.as_data()
            if "path" in errors:
                for error in errors["path"]:
                    if error.code == "max_length":
                        return dict(errors=['Path too long.'])
                    elif error.code == "required":
                        return dict(errors=['Arguments missing.'])
                return dict(errors=["form invalid"])

        backend = search_backend.get(Unit)
        total, start, end, units_qs = backend(
            self.user, **search_form.cleaned_data).search()
        context = {
            'api': {'xtle.store.units': {
                'start': start,
                'end': end,
                'total': total,
                'units': GroupedResults(units_qs).data}}}
        return context


class StoreUnitAPI(DataAPI):

    @property
    def data(self):
        return {
            'api': {'xtle.store.unit': {
                "unit": dict(id=self.kwargs["id"])}}}
