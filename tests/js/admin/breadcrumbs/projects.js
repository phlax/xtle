
import React from "react";

import {shallow} from "enzyme";

import {
    translation,
    ProjectsBreadcrumb,
    BaseProjectsBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/projects";
import {AdminBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/base";


const _items = jest.fn(() => ({item1: "ITEM 1"}));


class DummyProjectsBreadcrumb extends BaseProjectsBreadcrumb {

    get items () {
	return _items();
    }
}


class DummyProjectsBreadcrumb2 extends BaseProjectsBreadcrumb {

    render () {
	return "DUMMY";
    }
}


test("ProjectsBreadcrumb render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb
          intl={{formatMessage}} />);
    expect(breadcrumb.type()).toBe(AdminBreadcrumb);
    expect(breadcrumb.props()).toEqual(
        {"defaultMessage": "FORMATTED",
         "domain": "projects",
	 "itemURL": breadcrumb.instance().itemURL,
         "items": {"item1": "ITEM 1"}});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.projects.defaultMessage,
           "id": translation.projects.id}]]);
});


test("ProjectsBreadcrumb items", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb2
          intl={{formatMessage}} />);
    expect(breadcrumb.instance().items).toEqual(
        {"add": "FORMATTED",
         "manage": "FORMATTED",
	 "view": "FORMATTED"});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.manageProjects.defaultMessage,
           "id": translation.manageProjects.id}],
         [{"defaultMessage": translation.addProject.defaultMessage,
           "id": translation.addProject.id}],
         [{"defaultMessage": translation.viewProjects.defaultMessage,
           "id": translation.viewProjects.id}]]);
});


const itemURLTests = [
    ["view", "view", "/projects/"],
    ["not view", "not view", undefined],
];


test.each(itemURLTests)(
    "ProjectsBreadrumb render %s",
    (name, item, expected) => {
        const formatMessage = jest.fn(() => "FORMATTED");
	const breadcrumb = shallow(
	    <DummyProjectsBreadcrumb2
              intl={{formatMessage}} />);
        expect(breadcrumb.instance().itemURL(item)).toEqual(expected);
    });
