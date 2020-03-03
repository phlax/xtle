
import React from "react";
import {Route, Switch} from "react-router-dom";

import {shallow} from "enzyme";

import {UserRoute} from "@l10n/xtle/routing/user";


test("UserRoute render", () => {
    const route = shallow(<UserRoute match={{path: "PATH"}} />);
    expect(route.type()).toBe(Route);
    expect(route.props().path).toEqual("PATH/:username");

    const subroute = route.props().render({match: {path: "SUBPATH"}});
    expect(subroute.type.displayName).toEqual("withData(User)");
    expect(subroute.props).toEqual({"match": {"path": "SUBPATH"}});
});
