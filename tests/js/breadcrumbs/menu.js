
import React from "react";

import {shallow} from "enzyme";

import {
    Input,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

import {
    splitPath, updatePath} from "@l10n/xtle/utils/path";
import {
    translation,
    BreadcrumbDropdownMenu,
    BaseBreadcrumbDropdownMenu} from "@l10n/xtle-ui/breadcrumbs/menu";


const _hasSearch = jest.fn(() => false);


class DummyBreadcrumbDropdownMenu extends BaseBreadcrumbDropdownMenu {

    get hasSearch () {
	return _hasSearch();
    }
}


class DummyBreadcrumbDropdownMenu2 extends BaseBreadcrumbDropdownMenu {

    render () {
	return "";
    }
}


test("BreadcrumbDropdownMenu injectIntl", () => {
    expect(BreadcrumbDropdownMenu.displayName).toEqual(
        "injectIntl(BaseBreadcrumbDropdownMenu)");
});


const dropdownMenuTests = [
    ["defaults", {}, {}],
    ["items",
     {items: {
         item1: "ITEM 1",
         item2: "ITEM 2"}}],
    ["items selected",
     {items: {
         item1: "ITEM 1",
         item2: "ITEM 2"},
      selected: "item1"}],
    ["hasSearch",
     {hasSearch: true}],
    ["hasSearch items",
     {hasSearch: true,
      items: {
          item1: "ITEM 1",
          item2: "ITEM 2"}}],
    ["hasSearch items selected",
     {hasSearch: true,
      selected: "item1",
      items: {
          item1: "ITEM 1",
          item2: "ITEM 2"}}],
];


test.each(dropdownMenuTests)(
    "BreadrumbDropdownMenu render %s",
    (name, props) => {
        const {hasSearch=false, ...rest} = props;
        _hasSearch.mockImplementation(jest.fn(() => hasSearch));
        const formatMessage = jest.fn(() => "FORMATTED");
        const itemURL = jest.fn(() => "URL");
        const onSearch = jest.fn();
        const menu = shallow(
            <DummyBreadcrumbDropdownMenu
	      remote={false}
	      selected="SELECTED"
              onSearch={onSearch}
              count={23}
              items={{}}
              itemURL={itemURL}
              intl={{formatMessage}}
              {...rest} />);
        expect(menu.type()).toBe(DropdownMenu);
        expect(menu.props().className).toEqual(
            "px-0 py-2 mt-0 border-top-0 rounded-0 bg-white");
        let i = 0;
        if (hasSearch) {
            const search = menu.childAt(0);
            expect(search.type()).toBe(DropdownItem);
            expect(search.props().className).toEqual("p-1 small");
            const input = search.childAt(0);
            expect(input.type()).toBe(Input);
            expect(input.props().placeholder).toEqual("FORMATTED");
            expect(input.props().onClick).toBe(menu.instance().stopPropagation);
            expect(input.props().onChange).toBe(onSearch);
            expect(formatMessage.mock.calls).toEqual([[translation.search]]);
            i++;
        } else {
            expect(formatMessage.mock.calls).toEqual([]);
        }
        const result = menu.childAt(i);
        expect(result.props().className).toEqual("xtle-dropdown-menu-results");
        const {items={}, selected} = props;
        const urlCalls = [];
        Object.keys(items).forEach((item, index) => {
            const dditem = result.childAt(index);
            expect(dditem.props().className).toEqual("px-3 py-1");
            expect(dditem.props().title).toEqual(items[item]);
            if (item === selected) {
                expect(dditem.props().url).toBe(null);
            } else {
                expect(dditem.props().url).toEqual("URL");
                urlCalls.push([item]);
            }
        });
        expect(itemURL.mock.calls).toEqual(urlCalls);
    });


test("BreadcrumbDropdownMenu onClick", () => {
    const menu = shallow(
        <DummyBreadcrumbDropdownMenu2
	  remote={false}
	  selected="SELECTED"
          onSearch={jest.fn()}
          count={23}
          items={{}}
          itemURL={jest.fn()}
          intl={{formatMessage: jest.fn()}} />);
    const e = {stopPropagation: jest.fn()};
    menu.instance().stopPropagation(e);
    expect(e.stopPropagation.mock.calls).toEqual([[]]);
});


const hasSearchTests = [
    ["no items", {}, false],
    ["7 items", {count: 7}, false],
    ["10 items", {count: 10}, false],
    ["11 items", {count: 11}, true],
    ["remote", {remote: true}, true],
    ["remote and items", {remote: true, count: 123}, true],
];


test.each(hasSearchTests)(
    "BreadrumbDropdownMenu hasSearch %s",
    (name, props, expected) => {
        const menu = shallow(
            <DummyBreadcrumbDropdownMenu2
	      remote={false}
	      selected="SELECTED"
              onSearch={jest.fn()}
              count={0}
              items={{}}
              itemURL={jest.fn()}
              intl={{formatMessage: jest.fn()}}
              {...props} />);
        expect(menu.instance().hasSearch).toBe(expected);
    });
