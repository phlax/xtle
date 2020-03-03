
import React from "react";

import {shallow} from "enzyme";

import {Dropdown} from "reactstrap";

import {Link} from "@chango/ui";

import {BreadcrumbDropdown} from "@l10n/xtle-ui/breadcrumbs/dropdown";
import {BreadcrumbDropdownMenu} from "@l10n/xtle-ui/breadcrumbs/menu";

const _items = jest.fn(() => ({foo: "BAR"}));
const _count = jest.fn(() => 23);
const showDropdown = jest.fn();


class DummyBreadcrumbDropdown extends BreadcrumbDropdown {

    get count () {
	return _count();
    }

    get items () {
	return _items();
    }

    get showDropdown () {
	return showDropdown();
    }
}


class DummyBreadcrumbDropdown2 extends BreadcrumbDropdown {

    render () {
	return "";
    }
}


const props = {
    defaultMessage: "MESSAGE",
    canClear: false,
    clearURL: "URL",
    selected: "SELECTED",
    items: {item1: "i1", item2: "i2"}};
const extraProps = {
    itemURL: () => "URL"};

const dropdownTests = [
    ["not showDropdown", false],
    ["showDropdown", true],
];

test.each(dropdownTests)(
    "BreadrumbDropdown.render %s",
    (name, show) => {
        showDropdown.mockImplementation(() => show);
        const dropdown = shallow(
	    <DummyBreadcrumbDropdown
              {...props}
              {...extraProps} />);
        expect(dropdown.type()).toBe(Dropdown);
        expect(dropdown.props().nav).toBe(true);
        expect(dropdown.props().toggle).toBe(dropdown.instance().toggle);
        let title = dropdown.childAt(0);
	const {items, ...titleProps} = props;
        expect(title.props()).toEqual({
            showDropdown: show,
            ...titleProps,
	    selected: "SELECTED"});
        let menu = dropdown.childAt(1);
        expect(menu.length).toEqual(0);
	expect(_items.mock.calls).toEqual([]);
	expect(_count.mock.calls).toEqual([]);
        expect(showDropdown.mock.calls).toEqual([[]]);
        showDropdown.mockClear();

        dropdown.instance().setState({isOpen: true});
        dropdown.update();
        expect(showDropdown.mock.calls).toEqual([[], []]);
        title = dropdown.childAt(0);
        expect(title.props()).toEqual({
	    showDropdown: dropdown.instance().showDropdown,
	    ...titleProps,
	    selected: "SELECTED"});
        menu = dropdown.childAt(1);
        if (!show) {
            expect(menu.length).toEqual(0);
        } else {
            expect(menu.length).toEqual(1);
            expect(menu.type()).toBe(BreadcrumbDropdownMenu);
            expect(menu.props()).toEqual({
                count: 23,
                onSearch: dropdown.instance().onSearch,
                selected: props.selected,
                items: {foo: "BAR"},
                ...extraProps});
	    expect(_items.mock.calls).toEqual([[]]);
	    expect(_count.mock.calls).toEqual([[]]);
        }
        _items.mockClear();
        _count.mockClear();
        showDropdown.mockClear();
});


test("BreadcrumbDropdown toggle", () => {
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps} />);
    dropdown.instance().setState = jest.fn();
    dropdown.instance().state = {isOpen: false};
    dropdown.instance().toggle();
    expect(dropdown.instance().setState.mock.calls).toEqual(
        [[{"isOpen": true}]]);
    dropdown.instance().setState = jest.fn();
    dropdown.instance().state = {isOpen: true};
    dropdown.instance().toggle();
    expect(dropdown.instance().setState.mock.calls).toEqual(
        [[{"isOpen": false}]]);
});


const showDropdownTests = [
    ["none", {items: {}, remote: false, selected: null}, false],
    ["count 1", {items: {foo: "BAR"}, remote: false, selected: null}, true],
    ["count 1, selected", {items: {foo: "BAR"}, remote: false, selected: "SELECTED"}, false],
    ["count 2, selected", {items: {foo: "BAR", baz: "OTHER"}, remote: false, selected: "SELECTED"}, true],
    ["remote", {items: {}, remote: true, selected: null}, true],
    ["remote, selected", {items: {}, remote: true, selected: "SELECTED"}, true],
];


test.each(showDropdownTests)(
    "BreadrumbDropdown.showDropdown %s",
    (name, testProps, expected) => {
        const dropdown = shallow(
	    <DummyBreadcrumbDropdown2
              {...props}
              {...extraProps}
              {...testProps}
            />);
        expect(dropdown.instance().showDropdown).toBe(expected);
    });


test("BreadcrumbDropdown onSearch", () => {
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps}
        />);
    dropdown.instance().setState = jest.fn();
    const e = {target: {value: "SEARCH"}};
    dropdown.instance().onSearch(e);
    expect(dropdown.instance().setState.mock.calls).toEqual(
	[[{"search": "SEARCH"}]]);
});


test("BreadcrumbDropdown count none", () => {
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps}
          items={{}}
        />);
    expect(dropdown.instance().count).toEqual(0);
});


test("BreadcrumbDropdown count", () => {
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps}
          items={{item1: "i1", item2: "i2", item3: "i3"}}
        />);
    expect(dropdown.instance().count).toEqual(3);
});



test("BreadcrumbDropdown items empty", () => {
    global.Object.fromEntries = jest.fn(() => "RESULTS");
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps}
          items={{}}
        />);
    expect(global.Object.fromEntries.mock.calls).toEqual([]);
    expect(dropdown.instance().items).toEqual({});
});


test("BreadcrumbDropdown items all", () => {
    global.Object.fromEntries = jest.fn(() => "RESULTS");
    const items = {item1: "i1", item2: "i2", item3: "i3"};
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps}
          items={items}
        />);
    expect(global.Object.fromEntries.mock.calls).toEqual([]);
    expect(dropdown.instance().items).toEqual(items);
});



test("BreadcrumbDropdown items search", () => {
    global.Object.fromEntries = jest.fn(() => "SEARCH RESULTS");
    const item1 = "i1";
    const item2 = "i2";
    const items = {item1, item2, item3: "i3"};
    const dropdown = shallow(
        <DummyBreadcrumbDropdown2
          {...props}
          {...extraProps}
          items={items}
        />);
    dropdown.instance().state.search = "em1";
    expect(dropdown.instance().items).toEqual("SEARCH RESULTS");

    expect(global.Object.fromEntries.mock.calls).toEqual(
        [[[["item1", "i1"]]]]);
    global.Object.fromEntries.mockClear();

    dropdown.instance().state.search = "i2";
    expect(dropdown.instance().items).toEqual("SEARCH RESULTS");
    expect(global.Object.fromEntries.mock.calls).toEqual(
        [[[["item2", "i2"]]]]);
    global.Object.fromEntries.mockClear();

    dropdown.instance().state.search = "NO MATCH";
    expect(dropdown.instance().items).toEqual("SEARCH RESULTS");
    expect(global.Object.fromEntries.mock.calls).toEqual(
        [[[]]]);
    global.Object.fromEntries.mockClear();
});
