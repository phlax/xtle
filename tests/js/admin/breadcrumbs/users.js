
import React from "react";

import {shallow} from "enzyme";

import {
    translation,
    UsersBreadcrumb,
    BaseUsersBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/users";
import {AdminBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/base";


const _items = jest.fn(() => ({item1: "ITEM 1"}));


class DummyUsersBreadcrumb extends BaseUsersBreadcrumb {

    get items () {
	return _items();
    }
}


class DummyUsersBreadcrumb2 extends BaseUsersBreadcrumb {

    render () {
	return "DUMMY";
    }
}


test("UsersBreadcrumb render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyUsersBreadcrumb
          intl={{formatMessage}} />);
    expect(breadcrumb.type()).toBe(AdminBreadcrumb);
    expect(breadcrumb.props()).toEqual(
        {"defaultMessage": "FORMATTED",
         "domain": "users",
         "items": {"item1": "ITEM 1"}});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.users.defaultMessage,
           "id": translation.users.id}]]);
});


test("UsersBreadcrumb items", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyUsersBreadcrumb2
          intl={{formatMessage}} />);
    expect(breadcrumb.instance().items).toEqual(
        {"add": "FORMATTED",
         "manage": "FORMATTED"});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.manageUsers.defaultMessage,
           "id": translation.manageUsers.id}],
         [{"defaultMessage": translation.addUser.defaultMessage,
           "id": translation.addUser.id}]]);
});
