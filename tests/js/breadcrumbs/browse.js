
import React from "react";

import {shallow} from "enzyme";

import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavLink,
    UncontrolledDropdown} from "reactstrap";

import {
    splitPath, getTranslateURL,
    getBrowseURL} from "@l10n/xtle/utils/path";
import {
    BaseBreadcrumbsBrowse,
    BreadcrumbsBrowse} from "@l10n/xtle-ui/breadcrumbs/browse";
import {
    BreadcrumbDropdownItem} from "@l10n/xtle-ui/breadcrumbs/dropdown-item";


test("BreadcrumbsBrowse injectIntl", () => {
    expect(BreadcrumbsBrowse.displayName).toEqual(
        "injectIntl(BaseBreadcrumbsBrowse)");
});


jest.mock("@l10n/xtle/utils/path", () => {
    const getBrowseURL = jest.fn(() => "BROWSE URL");
    const getTranslateURL = jest.fn(() => "TRANSLATE URL");
    const splitPath = jest.fn(() => ({}));
    return {getBrowseURL, getTranslateURL, splitPath};
});

const _isTranslate = jest.fn(() => false);
const _canTranslate = jest.fn(() => false);
const _renderSelected = jest.fn(() => "SELECTED");


class DummyBreadcrumbsBrowse extends BaseBreadcrumbsBrowse {

    get isTranslateURL () {
        return _isTranslate();
    }

    get canTranslate () {
        return _canTranslate();
    }

    renderSelected = () => {
        return _renderSelected();
    }
}


class DummyBreadcrumbsBrowse2 extends BaseBreadcrumbsBrowse {

    render () {
    }
}


test("BreadcrumbsBrowse render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const browse = shallow(
        <DummyBreadcrumbsBrowse
          path="PATH"
          intl={{formatMessage}} />);
    expect(browse.props().nav).toBe(true);
    expect(browse.props().inNavbar).toBe(true);
    expect(_renderSelected.mock.calls).toEqual([]);
    expect(_canTranslate.mock.calls).toEqual([[]]);
    expect(_isTranslate.mock.calls).toEqual([]);
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": "Browse",
           "id": "breadcrumb.navigation.browse"}]]);
    expect(getBrowseURL.mock.calls).toEqual([]);
    expect(getTranslateURL.mock.calls).toEqual([]);
    expect(browse.type()).toBe(UncontrolledDropdown);
    const title = browse.childAt(0);
    expect(title.type()).toBe(NavLink);
    expect(title.props()).toEqual(
        {"children": "FORMATTED",
         "className": "text-black-50",
         "tag": "a"});
    _canTranslate.mockClear();
    formatMessage.mockClear();
});


test("BreadcrumbsBrowse render canTranslate", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    _canTranslate.mockImplementation(() => true);
    const browse = shallow(
        <DummyBreadcrumbsBrowse
          path="PATH"
          intl={{formatMessage}} />);
    expect(browse.props().nav).toBe(true);
    expect(browse.props().inNavbar).toBe(true);
    expect(_renderSelected.mock.calls).toEqual([[]]);
    expect(_canTranslate.mock.calls).toEqual([[]]);
    expect(_isTranslate.mock.calls).toEqual([[]]);
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": "Browse",
           "id": "breadcrumb.navigation.browse"}],
         [{"defaultMessage": "Translate",
           "id": "breadcrumb.navigation.translate"}]]);
    expect(getBrowseURL.mock.calls).toEqual([]);
    expect(getTranslateURL.mock.calls).toEqual([["PATH"]]);
    expect(browse.type()).toBe(UncontrolledDropdown);

    const title = browse.childAt(0);
    expect(title.type()).toBe(DropdownToggle);
    expect(title.props().caret).toBe(true);
    expect(title.props().nav).toBe(true);
    expect(title.props().tag).toEqual("span");
    expect(title.props().className).toEqual("btn text-primary");
    expect(title.props().children).toEqual("SELECTED");

    const menu = browse.childAt(1);
    expect(menu.type()).toBe(DropdownMenu);
    expect(menu.props().className).toEqual(
        "px-0 py-2 mt-0 border-top-0 rounded-0 bg-white");

    const item1 = menu.childAt(0);
    expect(item1.type()).toBe(BreadcrumbDropdownItem);
    expect(item1.props()).toEqual(
        {"title": "FORMATTED", "url": ""});

    const item2 = menu.childAt(1);
    expect(item2.type()).toBe(BreadcrumbDropdownItem);
    expect(item2.props()).toEqual(
        {"title": "FORMATTED", "url": "TRANSLATE URL"});

    getTranslateURL.mockClear();
    _renderSelected.mockClear();
    _canTranslate.mockClear();
    _isTranslate.mockClear();
    formatMessage.mockClear();
});


test("BreadcrumbsBrowse render canTranslate.translate", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    _canTranslate.mockImplementation(() => true);
    _isTranslate.mockImplementation(() => true);
    const browse = shallow(
        <DummyBreadcrumbsBrowse
          path="PATH"
          intl={{formatMessage}} />);
    expect(browse.props().nav).toBe(true);
    expect(browse.props().inNavbar).toBe(true);
    expect(_renderSelected.mock.calls).toEqual([[]]);
    expect(_canTranslate.mock.calls).toEqual([[]]);
    expect(_isTranslate.mock.calls).toEqual([[]]);
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": "Browse",
           "id": "breadcrumb.navigation.browse"}],
         [{"defaultMessage": "Translate",
           "id": "breadcrumb.navigation.translate"}]]);
    expect(getBrowseURL.mock.calls).toEqual([["PATH"]]);
    expect(getTranslateURL.mock.calls).toEqual([]);
    expect(browse.type()).toBe(UncontrolledDropdown);

    const title = browse.childAt(0);
    expect(title.type()).toBe(DropdownToggle);
    expect(title.props().caret).toBe(true);
    expect(title.props().nav).toBe(true);
    expect(title.props().tag).toEqual("span");
    expect(title.props().className).toEqual("btn text-primary");
    expect(title.props().children).toEqual("SELECTED");

    const menu = browse.childAt(1);
    expect(menu.type()).toBe(DropdownMenu);
    expect(menu.props().className).toEqual(
        "px-0 py-2 mt-0 border-top-0 rounded-0 bg-white");

    const item1 = menu.childAt(0);
    expect(item1.type()).toBe(BreadcrumbDropdownItem);
    expect(item1.props()).toEqual(
        {"title": "FORMATTED", "url": "BROWSE URL"});

    const item2 = menu.childAt(1);
    expect(item2.type()).toBe(BreadcrumbDropdownItem);
    expect(item2.props()).toEqual(
        {"title": "FORMATTED", "url": ""});

    getBrowseURL.mockClear();
    _renderSelected.mockClear();
    _canTranslate.mockClear();
    _isTranslate.mockClear();
    formatMessage.mockClear();
});


const canTranslateTests = [
    ["none", {}, false],
    ["language", {language: "LANGUAGE"}, false],
    ["project", {project: "PROJECT"}, false],
    ["both", {project: "PROJECT", language: "LANGUAGE"}, true]];


test.each(canTranslateTests)(
    "Breadrumbs.canTranslate %s",
    (name, split, expected) => {
        const formatMessage = jest.fn(() => "FORMATTED");
        splitPath.mockImplementation(() => split);
        const browse = shallow(
            <DummyBreadcrumbsBrowse2
              path="PATH"
              intl={{formatMessage}} />);
        expect(browse.instance().canTranslate).toBe(expected);
        expect(splitPath.mock.calls).toEqual([["PATH"]]);
        splitPath.mockClear();
});


const isTranslateTests = [
    ["none", {}, false],
    ["other", {language: "LANGUAGE"}, false],
    ["translate", {translate: true}, true]];


test.each(isTranslateTests)(
    "Breadrumbs.isTranslateURL %s",
    (name, split, expected) => {
        const formatMessage = jest.fn(() => "FORMATTED");
        splitPath.mockImplementation(() => split);
        const browse = shallow(
            <DummyBreadcrumbsBrowse2
              path="PATH"
              intl={{formatMessage}} />);
        expect(browse.instance().isTranslateURL).toBe(expected);
        expect(splitPath.mock.calls).toEqual([["PATH"]]);
        splitPath.mockClear();
});


const renderSelectedTests = [
    ["none",
     {},
     {"defaultMessage": "Browse",
      "id": "breadcrumb.navigation.browse"}],
    ["translate",
     {translate: true},
     {"defaultMessage": "Translate",
      "id": "breadcrumb.navigation.translate"}]];


test.each(renderSelectedTests)(
    "Breadrumbs.renderSelectedURL %s",
    (name, split, expected) => {
        const formatMessage = jest.fn(() => "FORMATTED");
        splitPath.mockImplementation(() => split);
        const browse = shallow(
            <DummyBreadcrumbsBrowse2
              path="PATH"
              intl={{formatMessage}} />);
        expect(browse.instance().renderSelected()).toBe("FORMATTED");
        expect(formatMessage.mock.calls).toEqual([[expected]]);
        splitPath.mockClear();
        formatMessage.mockClear();
});
