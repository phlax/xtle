
import React from "react";

import {shallow} from "enzyme";

import {Col} from "reactstrap";

import {StatisticsPanel} from "@l10n/xtle-ui/stats/info";
import {Contributors} from "@l10n/xtle-ui/stats/info/contributors";
import {LatestTranslation} from "@l10n/xtle-ui/stats/info/latest";
import {Checks} from "@l10n/xtle-ui/stats/info/checks";
import {Translation} from "@l10n/xtle-ui/stats/info/translation";


test("StatisticsPanel render", () => {
    const data = {
        checks: ["CHECKS"],
        contributors: ["CONTRIBUTORS"],
        totals: {data: "TOTALS"}};
    const stats = shallow(
        <StatisticsPanel
          data={data}/>);
    const col1 = stats.childAt(0);
    expect(col1.type()).toBe(Col);
    expect(col1.props().xs).toEqual(6);
    expect(col1.props().className).toEqual("bg-white pb-3");
    const translation = col1.childAt(0);
    expect(translation.type()).toBe(Translation);
    expect(translation.props()).toEqual(
	{"totals": {data: "TOTALS"}});
    const checks = col1.childAt(1);
    expect(checks.type()).toBe(Checks);
    expect(checks.props()).toEqual({"checks": ["CHECKS"]});
    const latest = col1.childAt(2);
    expect(latest.type()).toBe(LatestTranslation);
    expect(latest.props()).toEqual({});
    const col2 = stats.childAt(1);
    expect(col2.type()).toBe(Col);
    expect(col2.props().xs).toEqual(6);
    expect(col2.props().className).toEqual("bg-white pb-3");
    const contributors = col2.childAt(0);
    expect(contributors.type()).toBe(Contributors);
    expect(contributors.props()).toEqual(
	{"contributors": ["CONTRIBUTORS"]});
});
