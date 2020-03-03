
import React from "react";

import {shallow} from "enzyme";

import {DropdownItem} from "reactstrap";

import {Link} from "@chango/ui";

import {
    BreadcrumbDropdownItem} from "@l10n/xtle-ui/breadcrumbs/dropdown-item";


const dropdownItemTests = [
    ["no url",
     "",
     {itemType: DropdownItem,
      className: "d-block text-black-50",
      childType: "span"}],
    ["url",
     "URL",
     {itemType: DropdownItem,
      className: "d-block",
      childType: Link}],
];


test.each(dropdownItemTests)(
    "BreadrumbDropdownItem %s",
    (name, url, expected) => {
        const {className, itemType, childType} = expected;
        const item = shallow(
            <BreadcrumbDropdownItem
              url={url}
	      title="TITLE" />);
        expect(item.type()).toBe(itemType);
        expect(item.props().active).toBe(!url);
        expect(item.props().disabled).toBe(!url);

        const child = item.childAt(0);
        expect(child.type()).toEqual(childType);
        expect(child.props().className).toEqual(className);
        expect(child.props().children).toEqual("TITLE");
});
