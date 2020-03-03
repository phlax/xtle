
import React from "react";

import {shallow} from "enzyme";

import {Button} from "reactstrap";

import {StatsToggle} from "@l10n/xtle-ui/stats/toggle";
import ChannelsUI, {Icon} from "@chango/ui";


test("StatsToggle render", () => {
    const toggleFun = jest.fn();
    const toggle = shallow(
        <StatsToggle
          path="PATH"
          toggle={toggleFun}
          isOpen={false} />);
    expect(toggle.instance().api).toEqual("xtle.stats");
    expect(toggle.type()).toBe(ChannelsUI.APILink);
    expect(toggle.props().params).toEqual({path: "PATH"});
    expect(toggle.props().api).toEqual(toggle.instance().api);
    expect(toggle.props().onResponse).toEqual(toggleFun);

    const button = toggle.childAt(0);
    expect(button.type()).toBe(Button);
    expect(button.props().className).toEqual("btn-sm btn-link");
    expect(button.props().color).toEqual("white");
    expect(button.props().tag).toEqual("span");

    const icon = button.childAt(0);
    expect(icon.type()).toBe(Icon);
    expect(icon.props()).toEqual({"name": "expand-stats"});
});


test("StatsToggle render isOpen", () => {
    const toggleFun = jest.fn();
    const toggle = shallow(
        <StatsToggle
          path="PATH"
          toggle={toggleFun}
          isOpen={true} />);
    expect(toggle.instance().api).toEqual("xtle.stats");
    expect(toggle.type()).toBe(Button);
    expect(toggle.props().className).toEqual("btn-sm btn-link");
    expect(toggle.props().color).toEqual("white");
    expect(toggle.props().tag).toEqual("span");
    expect(toggle.props().onClick).toBe(toggleFun);

    const icon = toggle.childAt(0);
    expect(icon.type()).toBe(Icon);
    expect(icon.props()).toEqual({"name": "collapse-stats"});
});
