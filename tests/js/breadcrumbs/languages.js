
import React from "react";

import {shallow} from "enzyme";

import {
    splitPath, updatePath} from "@l10n/xtle/utils/path";
import {
    LanguagesBreadcrumb,
    BaseLanguagesBreadcrumb} from "@l10n/xtle-ui/breadcrumbs/languages";
import {BreadcrumbDropdown} from "@l10n/xtle-ui/breadcrumbs/dropdown";


const _canClear = jest.fn(() => false);
const _clearURL = jest.fn(() => "URL");
const _setting = jest.fn(() => ({}));


class DummyLanguagesBreadcrumb extends BaseLanguagesBreadcrumb {

    get context () {
	return {setting: _setting};
    }

    set context (c) {
    }

    get canClear () {
	return _canClear();
    }

    get clearURL () {
	return _clearURL();
    }
}


class DummyLanguagesBreadcrumb2 extends BaseLanguagesBreadcrumb {

    get context () {
	return {setting: _setting};
    }

    set context (c) {
    }

    render () {
	return "";
    }
}


jest.mock("@l10n/xtle/utils/path", () => {
    const updatePath = jest.fn(() => "UPDATED PATH");
    const splitPath = jest.fn(() => ({}));
    return {splitPath, updatePath};
});


test("BreadcrumbsLanguageBrowse injectIntl", () => {
    expect(LanguagesBreadcrumb.displayName).toEqual(
        "injectIntl(BaseLanguagesBreadcrumb)");
});


test("LanguagesBreadcrumb render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const _languages = {
        selected: "SELECTED",
        other: "OTHER"};
    _setting.mockImplementation(() => _languages);
    const breadcrumb = shallow(
        <DummyLanguagesBreadcrumb
          path="PATH"
	  selected="selected"
          data={{languages: ["selected", "other"]}}
          intl={{formatMessage}} />);
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": "All languages",
           "id": "breadcrumb.languages.all"}]]);
    expect(_clearURL.mock.calls).toEqual([[]]);
    expect(_canClear.mock.calls).toEqual([[]]);
    expect(breadcrumb.props()).toEqual(
        {"canClear": false,
         "clearURL": "URL",
         "defaultMessage": "FORMATTED",
         "itemURL": breadcrumb.instance().itemURL,
         "items": _languages,
         "selected": "SELECTED"});
    expect(breadcrumb.type()).toBe(BreadcrumbDropdown);
});


test("LanguagesBreadcrumb canClear", () => {
    const breadcrumb = shallow(
        <DummyLanguagesBreadcrumb2
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


test("LanguagesBreadcrumb clearURL", () => {
    const breadcrumb = shallow(
        <DummyLanguagesBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{}} />);

    expect(breadcrumb.instance().clearURL).toBe("UPDATED PATH");
    expect(updatePath.mock.calls).toEqual(
        [["PATH",
          {dir: null,
           language: null,
           filename: null}]]);
    updatePath.mockClear();
});


test("LanguagesBreadcrumb itemURL", () => {
    const breadcrumb = shallow(
        <DummyLanguagesBreadcrumb2
          path="PATH"
	  selected="SELECTED"
          data={{}}
          intl={{}} />);
    expect(breadcrumb.instance().itemURL("ITEM")).toBe("UPDATED PATH");
    expect(updatePath.mock.calls).toEqual(
        [["PATH", {language: "ITEM"}]]);
    updatePath.mockClear();
});
