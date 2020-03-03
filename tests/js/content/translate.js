

import React from "react";

import {shallow} from "enzyme";

import {Col, Row} from "reactstrap";

import Scroller from  "@phlax/react-scroller";

import {
    Translate, TranslateControls,
    UnitRow, UnitEditRow} from "@l10n/xtle-ui/content/translate";
import XTLEUI from "@l10n/xtle-ui";


test("Translate constructor", () => {
    const data = {
        end: "END",
        start: "START",
        total: "TOTAL",
        units: "UNITS"};
    const translate = shallow(
        <Translate
          match={{}}
          intl={{}}
          data={data}/>);
    expect(translate.text()).toBe("<Body />");
    const body = translate.find(XTLEUI.Body);
    let {children, ...props} = body.props();
    expect(props).toEqual({});
    const scrollerProvider = body.find(Scroller.Provider);
    expect(scrollerProvider.props().formatter).toBe(translate.instance().text);
    expect(scrollerProvider.props().fetch).toBe(translate.instance().fetch);
    const controls = scrollerProvider.find(TranslateControls);
    expect(controls.props()).toEqual({data, "match": {}});
    const row = scrollerProvider.find(Row);
    const content = row.find(Scroller.Content);
    expect(content.props()).toEqual(
        {"Container": Col,
         "FocusRow": UnitEditRow,
         "Row": UnitRow,
         "className": "py-3",
         "end": "END",
         "start": "START",
         "total": "TOTAL",
         "units": "UNITS"});
});
