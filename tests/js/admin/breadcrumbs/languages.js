
import React from "react";

import {shallow} from "enzyme";

import {
    translation,
    LanguagesBreadcrumb,
    BaseLanguagesBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/languages";
import {AdminBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/base";


const _items = jest.fn(() => ({item1: "ITEM 1"}));


class DummyLanguagesBreadcrumb extends BaseLanguagesBreadcrumb {

    get items () {
	return _items();
    }
}


class DummyLanguagesBreadcrumb2 extends BaseLanguagesBreadcrumb {

    render () {
	return "DUMMY";
    }
}


test("LanguagesBreadcrumb render", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyLanguagesBreadcrumb
          intl={{formatMessage}} />);
    expect(breadcrumb.type()).toBe(AdminBreadcrumb);
    expect(breadcrumb.props()).toEqual(
        {"defaultMessage": "FORMATTED",
         "domain": "languages",
         "items": {"item1": "ITEM 1"}});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.languages.defaultMessage,
           "id": translation.languages.id}]]);
});


test("LanguagesBreadcrumb items", () => {
    const formatMessage = jest.fn(() => "FORMATTED");
    const breadcrumb = shallow(
        <DummyLanguagesBreadcrumb2
          intl={{formatMessage}} />);
    expect(breadcrumb.instance().items).toEqual(
        {"add": "FORMATTED",
         "manage": "FORMATTED"});
    expect(formatMessage.mock.calls).toEqual(
        [[{"defaultMessage": translation.manageLanguages.defaultMessage,
           "id": translation.manageLanguages.id}],
         [{"defaultMessage": translation.addLanguage.defaultMessage,
           "id": translation.addLanguage.id}]]);
});
