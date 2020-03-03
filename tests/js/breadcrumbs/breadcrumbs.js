
import React from "react";

import {shallow} from "enzyme";

import {
    Collapse,
    Row,
    Navbar,
    NavbarToggler,
    Nav} from "reactstrap";

import {Breadcrumbs} from "@l10n/xtle-ui/breadcrumbs";
import {BreadcrumbsBrowse} from "@l10n/xtle-ui/breadcrumbs/browse";
import {LanguagesBreadcrumb} from "@l10n/xtle-ui/breadcrumbs/languages";
import {ProjectsBreadcrumb} from "@l10n/xtle-ui/breadcrumbs/projects";
import {PathsBreadcrumb} from "@l10n/xtle-ui/breadcrumbs/paths";


const breadcrumbTests = [
    ["no project or language",
     {}],
    ["project",
     {project: "PROJECT"}],
    ["language",
     {language: "LANGUAGE"}],
    ["project and language",
     {project: "PROJECT", language: "LANGUAGE"}],
];

test.each(breadcrumbTests)(
    "Breadrumbs.render %s",
    (name, params) => {
        const breadcrumbs = shallow(
            <Breadcrumbs
              data={{}}
              match={{params, url: "URL"}} />);
        expect(breadcrumbs.type()).toBe(Row);
        expect(breadcrumbs.props().className).toEqual("bg-light");
        const navbar = breadcrumbs.childAt(0);
        expect(navbar.type()).toBe(Navbar);
        expect(navbar.props().expand).toEqual("md");
        expect(navbar.props().className).toEqual("py-0");

        const navtoggle = navbar.childAt(0);
        expect(navtoggle.type()).toBe(NavbarToggler);
        expect(navtoggle.props().onClick).toBe(breadcrumbs.instance().toggle);

        const collapse = navbar.childAt(1);
        expect(collapse.props().navbar).toBe(true);
        expect(collapse.props().isOpen).toEqual(false);

        const nav = collapse.childAt(0);
        expect(nav.type()).toBe(Nav);
        expect(nav.props().navbar).toBe(true);
        expect(nav.props().className).toEqual("mr-auto");

        const browse = nav.childAt(0);
        expect(browse.type()).toEqual(BreadcrumbsBrowse);
        expect(browse.props().path).toEqual("URL");

        const languages = nav.childAt(1);
        expect(languages.type()).toEqual(LanguagesBreadcrumb);
        expect(languages.props()).toEqual(
            {"data": {},
             "path": "URL",
             "selected": params.language});

        const projects = nav.childAt(2);
        expect(projects.type()).toEqual(ProjectsBreadcrumb);
        expect(projects.props()).toEqual(
            {"data": {},
             "path": "URL",
             "selected": params.project});

        const paths = nav.childAt(3);
        if (params.project && params.language) {
            expect(paths.type()).toEqual(PathsBreadcrumb);
            expect(paths.props().path).toEqual("URL");
        } else {
            expect(paths.length).toEqual(0);
        }
});


test("Breadcrumbs toggle", () => {
    const params = {};
    const breadcrumbs = shallow(
        <Breadcrumbs
          data={{}}
          match={{params, url: "URL"}} />);
    breadcrumbs.instance().state = {isOpen: false};
    breadcrumbs.instance().setState = jest.fn();
    breadcrumbs.instance().toggle();
    expect(breadcrumbs.instance().setState.mock.calls).toEqual(
        [[{"isOpen": true}]]);

    breadcrumbs.instance().state = {isOpen: true};
    breadcrumbs.instance().setState = jest.fn();
    breadcrumbs.instance().toggle();
    expect(breadcrumbs.instance().setState.mock.calls).toEqual(
        [[{"isOpen": false}]]);
});
