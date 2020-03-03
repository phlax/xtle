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

import {Col, Row} from "reactstrap";

import ChannelsUI from "@chango/ui";

import {AdminPage} from "./page";


export class AdminAdd extends React.PureComponent {
    static contextType = ChannelsUI.Context;

    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        addLabel: PropTypes.string.isRequired,
        addAPI: PropTypes.string.isRequired,
    });

    get fieldsetOptions () {
        return {
            className: "bg-light p-2",
            legend: {
                className: "col-form-label px-3 bg-white"}};
    }

    onSuccess = (code) => {
        this.context.send({route: "/admin/teams/" + code + "/"});
    };

    render () {
        const {data, match, title, ...props} = this.props;
        return (
            <AdminPage
              data={data}
              match={match}>
              <h3>{title}</h3>
              <Row>
                <Col className="p-3">
                  <ChannelsUI.forms.AddForm
                    formData="form"
                    fieldsetOptions={this.fieldsetOptions}
                    onSuccess={this.onSuccess}
                    {...props} />
                </Col>
              </Row>
            </AdminPage>);
    }
}
