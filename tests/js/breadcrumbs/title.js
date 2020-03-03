
import React from "react";

import {shallow} from "enzyme";

import {DropdownToggle} from "reactstrap";

import {BreadcrumbTitle} from "@l10n/xtle-ui/breadcrumbs/title";

import {Link} from "@chango/ui";


const titleTests = [
    ["defaults",
     {},
     {caret: undefined,
      text: "DEFAULT",
      link: 0,
      className: "btn text-black-50"}],
    ["showDropdown",
     {showDropdown: true},
     {caret: true,
      text: "DEFAULT",
      link: 0,
      className: "btn text-black-50"}],
    ["canClear",
     {canClear: true, clearURL: "URL"},
     {caret: undefined,
      text: "DEFAULT",
      link: 0,
      className: "btn text-black-50"}],
    ["selected",
     {selected: "SELECTED"},
     {caret: undefined,
      text: "SELECTED",
      link: 0,
      className: ""}],
    ["selected and canClear",
     {selected: "SELECTED", canClear: true, clearURL: "URL"},
     {caret: undefined,
      text: "SELECTED",
      link: 1,
      className: ""}],
    ["selected, canClear and showDropdown",
     {selected: "SELECTED",
      showDropdown: true,
      canClear: true, clearURL: "URL"},
     {caret: true,
      text: "SELECTED",
      link: 1,
      className: ""}]];


test.each(titleTests)(
    "BreadrumbTitle render %s",
    (name, props, expected) => {
        const {caret, className, link, text} = expected;
        const title = shallow(
            <BreadcrumbTitle
              {...props}
              defaultMessage="DEFAULT" />);
        expect(title.type()).toBe(DropdownToggle);
        expect(title.props().tag).toEqual("span");
        expect(title.props().className).toEqual(className);
        expect(title.props().caret).toBe(caret);
        expect(title.childAt(0).text()).toEqual(text);
        const clearLink = title.find(Link);
        expect(clearLink.length).toEqual(link);
        if (clearLink.length > 0) {
            expect(clearLink.props()).toEqual(
                {"children": "×",
                 "onClick": title.instance().onClick,
                 "to": "URL"});
        }
    });


test("BreadcrumbTitle onClick", () => {
    const title = shallow(
        <BreadcrumbTitle
          defaultMessage="DEFAULT" />);
    const e = {stopPropagation: jest.fn()};
    title.instance().onClick(e);
    expect(e.stopPropagation.mock.calls).toEqual([[]]);
});
