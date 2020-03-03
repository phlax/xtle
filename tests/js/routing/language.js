
import React from "react";
import {Route, Switch} from "react-router-dom";

import {shallow} from "enzyme";

import {
    LanguageRoute, LanguageTPRoute,
    TPRoute} from "@l10n/xtle/routing";


test("LanguageRoute render", () => {
    const routing = shallow(<LanguageRoute match={{path: "PATH"}} />);
    expect(routing.type()).toBe(Switch);

    const route = routing.childAt(0);
    expect(route.props().path).toEqual("PATH/:project");

    const subroute = route.props().render({match: {path: "SUBPATH"}});
    expect(subroute.type).toBe(LanguageTPRoute);
    expect(subroute.props).toEqual({"match": {"path": "SUBPATH"}});

    const language = routing.childAt(1);
    expect(language.type().displayName).toEqual("withData(Language)");
    expect(language.props()).toEqual({match: {path: "PATH"}});
});


test("LanguageTPRoute render", () => {
    const routing = shallow(<LanguageTPRoute match={{path: "PATH"}} />);
    expect(routing.type()).toBe(Switch);

    const route = routing.childAt(0);
    expect(route.props().path).toEqual("PATH/translate");

    const subroute = route.props().render({match: {path: "SUBPATH"}});
    expect(subroute.type.displayName).toEqual("DynamicImporter (TranslateRoute)");
    expect(subroute.props).toEqual({"match": {"path": "SUBPATH"}});

    const tp = routing.childAt(1);
    expect(tp.type()).toBe(Route);
    expect(tp.props().path).toEqual("PATH/");
    const tpsubroute = tp.props().render({match: {path: "TPSUBPATH"}});
    expect(tpsubroute.type).toBe(TPRoute);
    expect(tpsubroute.props).toEqual({"match": {"path": "TPSUBPATH"}});

});
