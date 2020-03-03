
import React from "react";
import {Route, Switch} from "react-router-dom";

import {shallow} from "enzyme";

import {ProjectsRoute} from "@l10n/xtle/routing";


test("ProjectRoute render", () => {
    const routing = shallow(<ProjectsRoute match={{path: "PATH"}} />);
    expect(routing.type()).toBe(Switch);

    const route = routing.childAt(0);
    expect(route.props().path).toEqual("PATH/:project");

    const subroute = route.props().render({match: {path: "SUBPATH"}});
    expect(subroute.type.displayName).toEqual("withData(Project)");
    expect(subroute.props).toEqual({"match": {"path": "SUBPATH"}});

    const project = routing.childAt(1);
    expect(project.type().displayName).toEqual("withData(Projects)");
    expect(project.props()).toEqual({match: {path: "PATH"}});
});
