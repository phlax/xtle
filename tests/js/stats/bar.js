
import React from "react";

import {shallow} from "enzyme";

import {Col, Collapse, Row} from "reactstrap";

import {StatsToggle} from "@l10n/xtle-ui/stats/toggle";
import {ContributorsSummary} from "@l10n/xtle-ui/stats/contributors";
import {StatisticsPanel} from "@l10n/xtle-ui/stats/info";
import {
    StatisticsPanel as StatisticsPanelImport} from "@l10n/xtle-ui/stats/bar";
import {ProgressBar} from "@l10n/xtle-ui/stats/progress";
import {Stats} from "@l10n/xtle-ui/stats";


class DummyStats extends Stats {

    get progress () {
	return [["success", 3], ["warning", 23]];
    }
}


const progressTests = [
    ["none",
     {total: 0, fuzzy: 0, translated: 0},
     [["success", 0], ["warning", 0]]],
    ["simple",
     {total: 100, fuzzy: 23, translated: 17},
     [["success", 17], ["warning", 23]]],
    ["complex",
     {total: 213, fuzzy: 23, translated: 17},
     [["success", 8], ["warning", 10.8]]]];


test("Stats render", () => {
    const contributors = {slice: jest.fn(() => ["SLICED"])};
    const stats = shallow(
        <DummyStats
	  match={{url: "URL"}}
          data={{contributors}} />);
    expect(stats.props().children.length).toEqual(3);
    const row1 = stats.childAt(0);
    expect(row1.type()).toEqual(Row);
    expect(row1.props().className).toEqual("bg-light");
    const row1col1 = row1.childAt(0);
    expect(row1col1.type()).toBe(Col);
    const progress = row1col1.childAt(0);
    expect(progress.type()).toBe(ProgressBar);
    expect(progress.props()).toEqual(
        {"items": [["success", 3], ["warning", 23]]});

    const row2 = stats.childAt(1);
    expect(row2.type()).toEqual(Row);
    expect(row2.props().className).toEqual("bg-light pl-3 pr-3");
    expect(row2.props().children.length).toEqual(2);
    const row2col1 = row2.childAt(0);
    expect(row2col1.type()).toEqual(Col);
    expect(row2col1.props().xs).toEqual(10);
    expect(row2col1.props().className).toEqual("pr-0 pt-1 bg-white");

    const contribs = row2col1.childAt(0);
    expect(contribs.type()).toEqual(ContributorsSummary);
    expect(contributors.slice.mock.calls).toEqual([[0, 3]]);
    expect(contribs.props()).toEqual({"contributors": ["SLICED"]});

    const row2col2 = row2.childAt(1);
    expect(row2col2.type()).toEqual(Col);
    expect(row2col2.props().xs).toEqual(2);
    expect(row2col2.props().className).toEqual("pl-0 pr-0 bg-white text-right");
    const toggle = row2col2.childAt(0);
    expect(toggle.type()).toEqual(StatsToggle);
    expect(toggle.props()).toEqual(
        {"isOpen": false,
         "path": "URL",
         "toggle": stats.instance().toggle});

    const row3 = stats.childAt(2);
    expect(row3.type()).toBe(Collapse);
    expect(row3.props().isOpen).toBe(false);
    expect(row3.props().className).toEqual(
        "row pl-3 pr-3 pb-3 bg-light text-dark small");
    expect(row3.props().children).toBe(false);
});


test("Stats render isOpen", () => {
    const slice = jest.fn(() => ["SLICED"]);
    const contributors = {slice};
    const stats = shallow(
        <DummyStats
	  match={{url: "URL"}}
          data={{contributors}} />);
    contributors.slice.mockClear();
    stats.setState({isOpen: true});
    stats.update();

    expect(stats.props().children.length).toEqual(3);
    const row1 = stats.childAt(0);
    expect(row1.type()).toEqual(Row);
    expect(row1.props().className).toEqual("bg-light");
    const row1col1 = row1.childAt(0);
    expect(row1col1.type()).toBe(Col);
    const progress = row1col1.childAt(0);
    expect(progress.type()).toBe(ProgressBar);
    expect(progress.props()).toEqual(
        {"items": [["success", 3], ["warning", 23]]});

    const row2 = stats.childAt(1);
    expect(row2.type()).toEqual(Row);
    expect(row2.props().className).toEqual("bg-light pl-3 pr-3");
    expect(row2.props().children.length).toEqual(2);
    const row2col1 = row2.childAt(0);
    expect(row2col1.type()).toEqual(Col);
    expect(row2col1.props().xs).toEqual(10);
    expect(row2col1.props().className).toEqual("pr-0 pt-1 bg-white");

    expect(row2col1.props().children).toBe(false);
    expect(contributors.slice.mock.calls).toEqual([]);

    const row2col2 = row2.childAt(1);
    expect(row2col2.type()).toEqual(Col);
    expect(row2col2.props().xs).toEqual(2);
    expect(row2col2.props().className).toEqual("pl-0 pr-0 bg-white text-right");
    const toggle = row2col2.childAt(0);
    expect(toggle.type()).toEqual(StatsToggle);
    expect(toggle.props()).toEqual(
        {"isOpen": true,
         "path": "URL",
         "toggle": stats.instance().toggle});

    const row3 = stats.childAt(2);
    expect(row3.type()).toBe(Collapse);
    expect(row3.props().isOpen).toBe(true);
    expect(row3.props().className).toEqual(
        "row pl-3 pr-3 pb-3 bg-light text-dark small");
    const panel = row3.childAt(0);
    expect(panel.type().displayName).toEqual(
        "DynamicImporter (StatisticsPanel)");
    expect(panel.props()).toEqual(
        {"data": {contributors}});
});


test("Stats toggle", () => {
    const stats = shallow(
        <DummyStats
	  match={{url: "URL"}}
          data={{contributors: []}} />);
    stats.instance().setState = jest.fn();
    stats.instance().state.isOpen = true;
    stats.instance().toggle();
    expect(stats.instance().setState.mock.calls).toEqual(
        [[{isOpen: false}]]);
    stats.instance().setState.mockClear();
        stats.instance().state.isOpen = false;
    stats.instance().toggle();
    expect(stats.instance().setState.mock.calls).toEqual(
        [[{isOpen: true}]]);
});


test.each(progressTests)(
    "Stats.progress %s",
    (name, totals, expected) => {
        const stats = shallow(
            <Stats
	      match={{url: "URL"}}
              data={{contributors: [], totals}} />);
        expect(stats.instance().progress).toEqual(expected);
    });


test("StatisticsPanel import", async () => {
    const importer = shallow(<StatisticsPanelImport />);
    expect(await importer.props().load()).toEqual({StatisticsPanel});
});
