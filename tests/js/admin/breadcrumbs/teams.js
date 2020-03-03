
import React from "react";

import {shallow} from "enzyme";

import {
    translation,
    TeamsBreadcrumb,
    BaseTeamsBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/teams";
import {AdminBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/base";


const _items = jest.fn(() => ({item1: "ITEM 1"}));


class DummyTeamsBreadcrumb extends BaseTeamsBreadcrumb {

    get items () {
	return _items();
    }
}


class DummyTeamsBreadcrumb2 extends BaseTeamsBreadcrumb {

    render () {
	return "DUMMY";
    }
}


test("TeamsBreadcrumb render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyTeamsBreadcrumb
          intl={{formatMessage}} />);
    expect(breadcrumb.type()).toBe(AdminBreadcrumb);
    expect(breadcrumb.props()).toEqual(
        {"defaultMessage": "FORMATTED",
         "domain": "teams",
         "items": {"item1": "ITEM 1"}});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.teams.defaultMessage,
           "id": translation.teams.id}]]);
});


test("TeamsBreadcrumb items", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyTeamsBreadcrumb2
          intl={{formatMessage}} />);
    expect(breadcrumb.instance().items).toEqual(
        {"add": "FORMATTED",
         "manage": "FORMATTED"});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.manageTeams.defaultMessage,
           "id": translation.manageTeams.id}],
         [{"defaultMessage": translation.addTeam.defaultMessage,
           "id": translation.addTeam.id}]]);
});
