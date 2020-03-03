
import React from "react";

import {shallow} from "enzyme";

import {
    splitPath, updatePath} from "@l10n/xtle/utils/path";
import {
    ProjectsBreadcrumb,
    BaseProjectsBreadcrumb} from "@l10n/xtle-ui/breadcrumbs/projects";
import {BreadcrumbDropdown} from "@l10n/xtle-ui/breadcrumbs/dropdown";


const _canClear = jest.fn(() => false);
const _clearURL = jest.fn(() => "URL");
const _items = jest.fn(() => ({foo: "BAR"}));


class DummyProjectsBreadcrumb extends BaseProjectsBreadcrumb {

    get canClear () {
	return _canClear();
    }

    get clearURL () {
	return _clearURL();
    }

    get items () {
	return _items();
    }

}


class DummyProjectsBreadcrumb2 extends BaseProjectsBreadcrumb {

    render () {
	return "";
    }
}


jest.mock("@l10n/xtle/utils/path", () => {
    const updatePath = jest.fn(() => "UPDATED PATH");
    const splitPath = jest.fn(() => ({}));
    return {splitPath, updatePath};
});


test("BreadcrumbsProjectBrowse injectIntl", () => {
    expect(ProjectsBreadcrumb.displayName).toEqual(
        "injectIntl(BaseProjectsBreadcrumb)");
});


test("ProjectsBreadcrumb render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{formatMessage}} />);
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": "All projects",
           "id": "breadcrumb.projects.all"}]]);
    expect(_clearURL.mock.calls).toEqual([[]]);
    expect(_canClear.mock.calls).toEqual([[]]);
    expect(_items.mock.calls).toEqual([[]]);
    expect(breadcrumb.props()).toEqual(
        {"canClear": false,
         "clearURL": "URL",
         "defaultMessage": "FORMATTED",
         "itemURL": breadcrumb.instance().itemURL,
         "items": {foo: "BAR"},
         "selected": "SELECTED"});
    expect(breadcrumb.type()).toBe(BreadcrumbDropdown);
});


test("ProjectsBreadcrumb canClear", () => {
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{}} />);
    expect(breadcrumb.instance().canClear).toBe(true);
    expect(splitPath.mock.calls).toEqual([["PATH"]]);
    splitPath.mockClear();
    splitPath.mockImplementation(() => ({translate: true}));
    expect(breadcrumb.instance().canClear).toBe(false);
    expect(splitPath.mock.calls).toEqual([["PATH"]]);
});


test("ProjectsBreadcrumb clearURL", () => {
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{}} />);

    expect(breadcrumb.instance().clearURL).toBe("UPDATED PATH");
    expect(updatePath.mock.calls).toEqual(
        [["PATH",
          {dir: null,
           project: null,
           filename: null}]]);
    updatePath.mockClear();
});


test("ProjectsBreadcrumb itemURL", () => {
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{}} />);
    expect(breadcrumb.instance().itemURL("ITEM")).toBe("UPDATED PATH");
    expect(updatePath.mock.calls).toEqual(
        [["PATH", {project: "ITEM"}]]);
    updatePath.mockClear();
});


test("ProjectsBreadcrumb items empty", () => {
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{}} />);
    expect(breadcrumb.instance().items).toEqual({});
});


test("ProjectsBreadcrumb items", () => {
    const breadcrumb = shallow(
        <DummyProjectsBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{projects: {project1: "FOO", project2: "BAR"}}}
          intl={{}} />);
    expect(breadcrumb.instance().items).toEqual(
        {project1: "FOO", project2: "BAR"});
});
