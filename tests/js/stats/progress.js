
import React from "react";

import {shallow} from "enzyme";

import {Progress} from "reactstrap";

import {Icon} from "@l10n/xtle-ui";
import {ProgressBar} from "@l10n/xtle-ui/stats/progress";
import ChannelsUI from "@chango/ui";


test("ProgressBar render", () => {
    const items = [
        ["red", 73],
        ["blue", 23]];
    const progress = shallow(
        <ProgressBar items={items} />);
    expect(progress.type()).toBe(Progress);
    expect(progress.props().multi).toBe(true);
    expect(progress.props().className).toEqual("xtle-progress");
    expect(progress.props().children.length).toEqual(2);

    const prog1 = progress.childAt(0);
    expect(prog1.type()).toBe(Progress);
    expect(prog1.props().bar).toBe(true);
    expect(prog1.props().color).toEqual("red");
    expect(prog1.props().value).toEqual(73);

    const prog2 = progress.childAt(1);
    expect(prog2.type()).toBe(Progress);
    expect(prog2.props().bar).toBe(true);
    expect(prog2.props().color).toEqual("blue");
    expect(prog2.props().value).toEqual(23);

});
