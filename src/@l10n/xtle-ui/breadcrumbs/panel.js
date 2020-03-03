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

import {BreadcrumbsBrowse} from "./browse";
import {LanguagesBreadcrumb} from "./languages";
import {ProjectsBreadcrumb} from "./projects";
import {PathsBreadcrumb} from "./paths";


export class Breadcrumbs extends React.Component {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired,
    });

    state = {isOpen: false};

    toggle = () => {
	const {isOpen} = this.state;
        this.setState({isOpen: !isOpen});
    };

    render () {
        const {isOpen} = this.state;
        const {data, match} = this.props;
        const {params, url} = match;
        const {project, language} = params;
        return (
            <Row className="bg-light">
              <Navbar expand="md" className="py-0">
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={isOpen} navbar>
                  <Nav className="mr-auto" navbar>
                    <BreadcrumbsBrowse path={url} />
                    <LanguagesBreadcrumb
                      path={url}
                      data={data}
                      selected={language} />
                    <ProjectsBreadcrumb
                      path={url}
                      data={data}
                      selected={project} />
                    {(project && language) &&
                     <PathsBreadcrumb
                       path={url} />
                    }
                  </Nav>
                </Collapse>
              </Navbar>
            </Row>
        );
    }
}
