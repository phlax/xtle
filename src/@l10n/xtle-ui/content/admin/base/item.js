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

import {Col, Form, Nav, NavItem, NavLink, Row} from "reactstrap";

import ChannelsUI from "@chango/ui";

import {AdminPage} from "./page";


export class ItemAdmin extends React.Component {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        title: PropTypes.string.isRequired,
        tabs: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
            PropTypes.string
        ]),
    });
    state = {content: "CONTENT"};

    onClick = (e) => {
        this.setState({content: e.target.name});
    };

    render () {
        const {getData} = this.context;
        const {title, tabs={}} = this.props;
        let {content} = this.state;
        const object = getData("object") || {};
        content = (tabs[content] || {}).component || Object.values(tabs)[0].component;
        return (
            <AdminPage {...this.props}>
              <h4>{title}: {object.name}</h4>
              <Row>
                <Col>
                  <Nav tabs>
                    {Object.entries(tabs).map(([name, tab], index) => {
                        return (
                            <NavItem
                              key={index}
                              className="mr-2">
                              <NavLink
                                onClick={this.onClick}
                                name={name}
                                href="#" active>
                                {tab.title}
                              </NavLink>
                            </NavItem>);
                  })}
                  </Nav>
                  <div>{content}</div>
                </Col>

              </Row>
            </AdminPage>);
    }
}


export class ItemSubAdmin extends React.PureComponent {
    static propTypes = exact({
        fieldsets: PropTypes.object.isRequired,
    });

    get fieldsetOptions () {
        return {
            className: "bg-light p-2",
            legend: {
                className: "col-form-label px-3 bg-white"}};
    }

    render () {
        const {fieldsets} = this.props;
        return (
            <Form>
              <ChannelsUI.forms.Fieldsets
                fieldsetOptions={this.fieldsetOptions}
                fieldsets={fieldsets} />
            </Form>
        );
    }
}
