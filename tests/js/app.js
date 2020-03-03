
import React from "react";

import {shallow} from "enzyme";

import Channels from "@chango/core";
import ChannelsUI from "@chango/ui";

import XTLEUI from "@l10n/xtle-ui";

import {App, columns} from "@l10n/xtle";
import {dataReducer} from "@l10n/xtle/reducers";
import {LanguageRoute} from "@l10n/xtle/routing/language";
import {ProjectsRoute} from "@l10n/xtle/routing/projects";


test("App constructor", () => {
    const app = shallow(<App />);
    const provider = app.find(ChannelsUI.Provider)
    expect(provider.props()).toEqual(
	{modals: {...ChannelsUI.allModals, ...XTLEUI.allModals},
	 columns,
	 routes: app.instance().routes,
	 reducers: app.instance().reducers});

});


test("App reducers", () => {
    const app = shallow(<App />);
    expect(app.instance().reducers).toEqual(
	Channels.withReducers({data: dataReducer}));
});



test("App routes", () => {
    const app = shallow(<App />);
    const routes = app.instance().routes;

    const welcome = routes[0]
    expect(welcome[0]).toEqual("/");
    expect(welcome[1].displayName).toEqual("withData(Welcome)");
    expect(welcome[2]).toBe(true);

    const admin = routes[1]
    expect(admin[0]).toEqual("/admin");
    expect(admin[1].displayName).toEqual("DynamicImporter (AdminRoute)");
    expect(admin[2]).toBe(false);

    const user = routes[2]
    expect(user[0]).toEqual("/user");
    expect(user[1].displayName).toEqual("DynamicImporter (UserRoute)");
    expect(user[2]).toBe(false);

    expect(routes.slice(3)).toEqual(
        [["/projects", ProjectsRoute, false],
         ["/:language", LanguageRoute, false]])
});
