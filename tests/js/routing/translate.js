
import React from "react";
import {Route, Switch} from "react-router-dom";

import {shallow} from "enzyme";

import {TranslateRoute} from "@l10n/xtle/routing/translate";


test("TranslateRoute render", () => {
    const routing = shallow(<TranslateRoute match={{path: "PATH"}} />);
    expect(routing.type()).toBe(Switch);

    const route = routing.childAt(0);
    expect(route.props().path).toEqual("PATH/:tp_path");

    const subroute = route.props().render({match: {path: "SUBPATH"}});
    expect(subroute.type).toBe(TranslateRoute);
    expect(subroute.props).toEqual({"match": {"path": "SUBPATH"}});

    const project = routing.childAt(1);
    expect(project.type().displayName).toEqual("injectIntl(withData(Translate))");
    expect(project.props()).toEqual({match: {path: "PATH"}});
});
