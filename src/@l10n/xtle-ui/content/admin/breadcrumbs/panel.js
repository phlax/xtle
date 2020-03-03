/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";

import {
    Collapse,
    Row,
    Navbar,
    NavbarToggler,
    Nav} from "reactstrap";

import {LanguagesAdminBreadcrumb} from "./languages";
import {ProjectsAdminBreadcrumb} from "./projects";
import {UsersAdminBreadcrumb} from "./users";
import {TeamsAdminBreadcrumb} from "./teams";


export class AdminBreadcrumbs extends React.Component {
    static propTypes = exact({
	match: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired
    });

    state = {isOpen: false};

    toggle = () => {
        const {isOpen} = this.state;
        this.setState({isOpen: !isOpen});
    };

    get breadcrumbs () {
        return [
            ProjectsAdminBreadcrumb,
            LanguagesAdminBreadcrumb,
            UsersAdminBreadcrumb,
            TeamsAdminBreadcrumb];
    }

    render () {
        const {isOpen} = this.state;
        return (
            <Row className="bg-light">
              <Navbar expand="md" className="py-0">
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={isOpen} navbar>
                  <Nav className="mr-auto" navbar>
                    {this.breadcrumbs.map((Component, index) => {
                        return (
                            <Component
                              key={index} />);
                    })}
                  </Nav>
                </Collapse>
              </Navbar>
            </Row>
        );
    }
}
