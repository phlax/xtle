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
import {FormattedMessage, FormattedNumber} from "react-intl";

import {
    Container,
    Row,
    Col,
} from "reactstrap";


export class CheckStatistic extends React.PureComponent {
    static propTypes = exact({
        name: PropTypes.string.isRequired,
	critical: PropTypes.bool.isRequired,
        count: PropTypes.number.isRequired,
    });

    render () {
        const {name, critical, count} = this.props;
        const className = critical ? "text-danger" : "text-muted";
        return (
            <Row className={className}>
              <Col xs={6}>
                {name}
              </Col>
              <Col xs={4} className="text-muted">
                <FormattedNumber
                  value={count} />
              </Col>
            </Row>);
    }
}


export class Checks extends React.PureComponent {
    static propTypes = exact({
        checks: PropTypes.array.isRequired,
    });

    render () {
        const {checks} = this.props;
        return (
            <>
              <h4 className="text-black-50">
                <FormattedMessage
                  id="stats.checks.failing"
                  defaultMessage="Failing checks" />
              </h4>
              <Container className="mb-3 bg-light py-2">
                {checks.map((value, index) => {
                    return (
                        <CheckStatistic
                          key={index}
                          {...value} />);
                })}
              </Container>
            </>);
    }
}
