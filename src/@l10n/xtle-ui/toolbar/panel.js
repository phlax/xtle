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
import {FormattedMessage} from "react-intl";

import {
    Nav,
    Row,
    Col
} from "reactstrap";

import {ToolbarStat} from "./stat";
import {ToolbarSearch} from "./search";


export class Toolbar extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired,
    });

    get items () {
        const {data} = this.props;
        const items = [];
        const {totals={}} = data || {};
        const {critical, total, suggestions, incomplete} = totals;
        if (critical > 0) {
            items.push({
                value: critical,
                color: "danger",
                message: (
                    <FormattedMessage
                      id="control.totals.critical"
                      defaultMessage="Critical errors" />)});
        }
        if (suggestions > 0) {
            items.push({
                value: suggestions,
                color: "secondary",
                message: (
                    <FormattedMessage
                      id="control.totals.suggestions"
                      defaultMessage="Review suggestions" />)});
        }
        if (incomplete > 0) {
            items.push({
                value: incomplete,
                color: "primary",
                message: (
                    <FormattedMessage
                      id="control.totals.incomplete"
                      defaultMessage="Continue translation" />)});
        }
        items.push({
            value: total,
            color: "success",
            message: (
                <FormattedMessage
                  id="control.totals.all"
                  defaultMessage="View all" />)});
        return items;
    }

    render () {
        const {items, props} = this;
        const {url} = props.match;
        return (
            <Row className="bg-light pt-2">
              <Col xs={3}>
                <ToolbarSearch />
              </Col>
              <Nav className="col-9 text-center">
                {items.map((item, key) => {
                    return (
                        <ToolbarStat
                          key={key}
                          color={item.color}
                          url={url}
                          value={item.value}>
                          {item.message}
                        </ToolbarStat>
                    );
                })}
              </Nav>
            </Row>
        );
    }
}
