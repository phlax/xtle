
import React from "react";
import {FormattedMessage, FormattedNumber} from "react-intl";

import {shallow} from "enzyme";

import {Col, Row} from "reactstrap";

import{
    Translation,
    TranslationStatistic} from "@l10n/xtle-ui/stats/info/translation";


const stats = {map: jest.fn()};


class DummyTranslation extends Translation {

    get statistics () {
	return stats;
    }
}


const statsTests = [
    ["no values",
     {fuzzy: 0, total: 0, translated: 0},
     [{"name": "total", "percent": 100, "value": 0},
      {"name": "translated", "percent": 0, "value": 0},
      {"name": "fuzzy", "percent": 0, "value": 0},
      {"name": "untranslated", "percent": 0, "value": 0}]],
    ["values",
     {fuzzy: 17, total: 213, translated: 23},
     [{"name": "total", "percent": 100, "value": 213},
      {"name": "translated", "percent": 10.7981220657277, "value": 23},
      {"name": "fuzzy", "percent": 7.981220657276995, "value": 17},
      {"name": "untranslated", "percent": 81.2206572769953, "value": 173}]],
];


test("stats.Translation render", () => {
    const translations = shallow(
        <DummyTranslation totals={{}} />);
    expect(stats.map.mock.calls.length).toEqual(1);
    const mapper = stats.map.mock.calls[0][0];
    const stat = mapper({name: "NAME", value: 13, percent: 23}, "INDEX");
    expect(stat.props).toEqual({"name": "NAME", "percent": 23, "value": 13});
    expect(stat.key).toEqual("INDEX");
    expect(translations.props().children.length).toEqual(2);
    const header = translations.childAt(0);
    expect(header.type()).toEqual("h4");
    expect(header.props().className).toEqual("text-black-50");
    const message = header.childAt(0);
    expect(message.type()).toEqual(FormattedMessage);
    expect(message.props()).toEqual(
        {"defaultMessage": "Translation statistics",
         "id": "stats.translation.statistics",
         "values": {}});
});


test.each(statsTests)(
    "stats.Translation statistics %s",
    (name, props, expected) => {
        const translations = shallow(
            <Translation totals={{}} />);
        translations.setProps({totals: props});
        const stats = translations.instance().statistics;
        expect(stats).toEqual(expected);
    });


test("stats.TranslationStatistic render", () => {
    const stat = shallow(
        <TranslationStatistic
          name="NAME"
          value={23}
          percent={73} />);
    expect(stat.type()).toBe(Row);
    expect(stat.props().children.length).toEqual(3);
    const col1 = stat.childAt(0);
    expect(col1.type()).toBe(Col);
    expect(col1.props().xs).toEqual(6);
    expect(col1.props().children).toEqual("NAME");

    const col2 = stat.childAt(1);
    expect(col2.type()).toBe(Col);
    expect(col2.props().xs).toEqual(4);
    expect(col2.props().className).toEqual("text-muted");
    const value = col2.childAt(0);
    expect(value.props()).toEqual({"value": 23});
    expect(value.type()).toEqual(FormattedNumber);

    const col3 = stat.childAt(2);
    expect(col3.type()).toBe(Col);
    expect(col3.props().xs).toEqual(2);
    expect(col3.props().className).toEqual("text-muted");
    const percent = col3.childAt(0);
    expect(percent.props()).toEqual(
        {"maximumFractionDigits": 1,
         "style": "percent",
         "value": 0.73});
    expect(percent.type()).toEqual(FormattedNumber);

});
