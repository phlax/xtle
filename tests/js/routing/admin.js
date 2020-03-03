
import React from "react";
import {Route, Switch} from "react-router-dom";

import {shallow} from "enzyme";

import {AdminRoute, AdminSubRoute} from "@l10n/xtle/routing/admin";

import ChannelsUI from "@chango/ui";

import XTLEAdminUI from "@l10n/xtle-ui/content/admin";


class DummyAdmin extends React.PureComponent {

    render () {
	return "DUMMY ADMIN";
    }
}


class DummyItem extends React.PureComponent {

    render () {
	return "DUMMY ITEM";
    }
}


class DummyAdd extends React.PureComponent {

    render () {
	return "DUMMY ADD";
    }
}

jest.mock("@chango/ui", () => {
    return {withData: jest.fn()};
});


jest.mock("@l10n/xtle-ui/content/admin", () => {

    return {
        Admin: "ADMIN",
        FoosAdmin: "DummyFooAdmin",
        FooAdmin: "DummyFooItem",
        FooAdminAdd: "DummyFooAdd",
        BarsAdmin: "DummyBarAdmin",
        BarAdmin: "DummyBarItem",
        BarAdminAdd: "DummyBarAdd"};
});

ChannelsUI.withData.mockImplementation(() => DummyAdmin);


const _routes = jest.fn(() => ["Foo", "Bar"]);


class DummyAdminRoute extends AdminRoute {

    get routes () {
        return _routes();
    }
}


class DummyAdminRoute2 extends AdminRoute {

    render () {
        return "DUMMY ADMIN ROUTE";
    }
}


test("AdminRoute render", () => {
    const routing = shallow(
        <DummyAdminRoute
          match={{path: "PATH"}} />);
    expect(routing.type()).toBe(Switch);
    expect(ChannelsUI.withData.mock.calls).toEqual(
        [["ADMIN"],
         ["DummyFooAdmin"], ["DummyFooItem"], ["DummyFooAdd"],
         ["DummyBarAdmin"], ["DummyBarItem"], ["DummyBarAdd"]]);
    const route1 = routing.childAt(0);
    expect(route1.type()).toBe(Route);
    expect(route1.props().path).toEqual("PATH/foos");
    const subroute1 = route1.props().render({match: {data: "SUB MATCH"}});
    expect(subroute1.type).toBe(AdminSubRoute);
    expect(subroute1.props).toEqual(
        {"AddComponent": DummyAdmin,
         "AdminComponent": DummyAdmin,
         "ItemComponent": DummyAdmin,
         "match": {"data": "SUB MATCH"},
         "name": "foo"});
    const route2 = routing.childAt(1);
    expect(route2.type()).toBe(Route);
    expect(route2.props().path).toEqual("PATH/bars");
    const subroute2 = route2.props().render({match: {data: "SUB MATCH"}});
    expect(subroute2.type).toBe(AdminSubRoute);
    expect(subroute2.props).toEqual(
        {"AddComponent": DummyAdmin,
         "AdminComponent": DummyAdmin,
         "ItemComponent": DummyAdmin,
         "match": {"data": "SUB MATCH"},
         "name": "bar"});
    const admin = routing.childAt(2);
    expect(admin.type()).toBe(DummyAdmin);
    expect(admin.props()).toEqual({"match": {"path": "PATH"}});
});


test("AdminRoute routes", () => {
    const routing = shallow(
        <DummyAdminRoute2
        match={{path: "PATH"}} />);
    expect(routing.instance().routes).toEqual(
        ["Language", "Project", "User", "Team"]);
});


test("AdminSubRoute render", () => {
    const routing = shallow(
        <AdminSubRoute
          name="SUB ROUTE"
          AdminComponent={DummyAdmin}
          AddComponent={DummyAdd}
          ItemComponent={DummyItem}
          match={{path: "PATH"}} />);
    expect(routing.type()).toBe(Switch);

    const route = routing.childAt(0);
    expect(route.props().path).toEqual("PATH/add");
    const addroute = route.props().render({match: {path: "SUBPATH"}});
    expect(addroute.type).toBe(DummyAdd);
    expect(addroute.props).toEqual({"match": {"path": "SUBPATH"}});

    const route2 = routing.childAt(1);
    expect(route2.props().path).toEqual("PATH/:" + "SUB ROUTE");
    const itemroute = route2.props().render({match: {path: "SUBPATH"}});
    expect(itemroute.type).toBe(DummyItem);
    expect(itemroute.props).toEqual({"match": {"path": "SUBPATH"}});

    const admin = routing.childAt(2);
    expect(admin.type()).toEqual(DummyAdmin);
    expect(admin.props()).toEqual({match: {path: "PATH"}});
});
