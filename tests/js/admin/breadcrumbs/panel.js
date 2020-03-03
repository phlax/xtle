
import React from "react";

import {shallow} from "enzyme";

import {
    Collapse,
    Row,
    Navbar,
    NavbarToggler,
    Nav} from "reactstrap";

import {
    LanguagesAdminBreadcrumb,
    ProjectsAdminBreadcrumb,
    UsersAdminBreadcrumb,
    TeamsAdminBreadcrumb} from "@l10n/xtle-ui/content/admin/breadcrumbs";
import {AdminBreadcrumbs} from "@l10n/xtle-ui/content/admin/breadcrumbs/panel";


class DummyComponent extends React.PureComponent {

    render () {
        return "DUMMY";
    }
}


const _breadcrumbs = jest.fn(() => [DummyComponent, DummyComponent]);


class DummyAdminBreadcrumbs extends AdminBreadcrumbs {

    get breadcrumbs () {
        return _breadcrumbs();
    }
}


class DummyAdminBreadcrumbs2 extends AdminBreadcrumbs {

    render () {
        return "DUMMY";
    }
}


test("AdminBreadcrumbs render", () => {
    const breadcrumb = shallow(
        <DummyAdminBreadcrumbs data={{}} match={{}} />);
    expect(breadcrumb.type()).toBe(Row);
    expect(breadcrumb.props().className).toEqual("bg-light");
    const navbar = breadcrumb.childAt(0);
    expect(navbar.type()).toBe(Navbar);
    expect(navbar.props().expand).toEqual("md");
    expect(navbar.props().className).toEqual("py-0");
    const toggler = navbar.childAt(0);
    expect(toggler.type()).toBe(NavbarToggler);
    expect(toggler.props().onClick).toBe(breadcrumb.instance().toggle);
    const collapse = navbar.childAt(1);
    expect(collapse.type()).toBe(Collapse);
    expect(collapse.props().navbar).toBe(true);
    expect(collapse.props().isOpen).toBe(false);
    const nav = collapse.childAt(0);
    expect(nav.type()).toBe(Nav);
    expect(nav.props().navbar).toBe(true);
    expect(nav.props().className).toEqual("mr-auto");
    expect(nav.props().children.length).toEqual(2);
    const item1 = nav.childAt(0);
    expect(item1.type()).toBe(DummyComponent);
    expect(item1.props()).toEqual({});
    const item2 = nav.childAt(1);
    expect(item2.type()).toBe(DummyComponent);
    expect(item2.props()).toEqual({});

    breadcrumb.setState({isOpen: true});
    breadcrumb.update();
    const recollapse = breadcrumb.find(Collapse);
    expect(recollapse.props().isOpen).toBe(true);

});


test("AdminBreadcrumbs breadcrumbs", () => {
    const breadcrumb = shallow(
        <DummyAdminBreadcrumbs2 data={{}} match={{}} />);
    expect(breadcrumb.instance().breadcrumbs).toEqual(
        [ProjectsAdminBreadcrumb,
         LanguagesAdminBreadcrumb,
         UsersAdminBreadcrumb,
         TeamsAdminBreadcrumb]);
});


test("AdminBreadcrumbs toggle", () => {
    const breadcrumbs = shallow(
        <DummyAdminBreadcrumbs2 data={{}} match={{}} />);
    breadcrumbs.instance().setState = jest.fn();
    breadcrumbs.instance().state = {isOpen: false};
    breadcrumbs.instance().toggle();
    expect(breadcrumbs.instance().setState.mock.calls).toEqual(
        [[{"isOpen": true}]]);
    breadcrumbs.instance().setState = jest.fn();
    breadcrumbs.instance().state = {isOpen: true};
    breadcrumbs.instance().toggle();
    expect(breadcrumbs.instance().setState.mock.calls).toEqual(
        [[{"isOpen": false}]]);
});
