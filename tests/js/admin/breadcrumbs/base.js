
import React from "react";

import {shallow} from "enzyme";

import {BreadcrumbDropdown} from "@l10n/xtle-ui/breadcrumbs/dropdown";
import {AdminBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs/base";

import {joinAdminPath} from "@l10n/xtle/utils/path";


const _items = jest.fn(() => ({item1: "ITEM 1"}));


jest.mock("@l10n/xtle/utils/path", () => {
    const joinAdminPath = jest.fn(() => "ADMIN PATH");
    return {joinAdminPath};
});



test("AdminBreadcrumb render", () => {
    const items = {item1: "ITEM 1"};
    const breadcrumb = shallow(
        <AdminBreadcrumb
	  domain="DOMAIN"
          items={items}
          defaultMessage="DEFAULT MESSAGE"/>);
    expect(breadcrumb.type()).toBe(BreadcrumbDropdown);
    expect(breadcrumb.props()).toEqual(
	{"defaultMessage": "DEFAULT MESSAGE",
	 "itemURL": breadcrumb.instance().itemURL,
	 "items": {"item1": "ITEM 1"}});
});


const itemURLTests = [
    ["none", "", {}, ""],
    ["action", "ACTION", {}, "ACTION"],
    ["manage", "manage", {}, null],
    ["itemURL", "ACTION", {itemURL: jest.fn(() => undefined)}, "ACTION"],
    ["itemURL resolves", "ACTION", {itemURL: jest.fn(() => "RESOLVED")}, "ACTION"],

];


test.each(itemURLTests)(
    "AdminBreadrumb itemURL %s",
    (name, arg, props, expected) => {
        const breadcrumb = shallow(
            <AdminBreadcrumb
	      domain="DOMAIN"
              items={{}}
              defaultMessage="DEFAULT MESSAGE"
              {...props} />);
        const {itemURL} = props;
        if (itemURL) {
            const result = breadcrumb.instance().itemURL(arg);
            expect(itemURL.mock.calls).toEqual([[arg]]);
            const resolved = itemURL();
            if (resolved) {
                expect(result).toEqual(resolved);
                expect(joinAdminPath.mock.calls).toEqual([]);
            } else {
                expect(result).toEqual("ADMIN PATH");
                expect(joinAdminPath.mock.calls).toEqual(
                    [[{"action": expected, "domain": "DOMAIN"}]]);
            }
        } else {
            expect(breadcrumb.instance().itemURL(arg)).toEqual("ADMIN PATH");
            expect(joinAdminPath.mock.calls).toEqual(
                [[{"action": expected, "domain": "DOMAIN"}]]);
        }
        joinAdminPath.mockClear();
    });
