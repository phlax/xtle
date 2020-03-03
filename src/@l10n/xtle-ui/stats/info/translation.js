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


export class TranslationStatistic extends React.PureComponent {
    static propTypes = exact({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
    });

    render () {
        return (
            <Row>
              <Col xs={6}>
                {this.props.name}
              </Col>
              <Col xs={4} className="text-muted">
                <FormattedNumber value={this.props.value} />
              </Col>
              <Col xs={2} className="text-muted">
                <FormattedNumber
                  value={this.props.percent / 100}
                  maximumFractionDigits={1}
                  style="percent" />
              </Col>
            </Row>);
    }
}


export class Translation extends React.PureComponent {
    static propTypes = exact({
	totals: PropTypes.object.isRequired,
    });

    get statistics () {
        const {totals} = this.props;
        const {fuzzy=0, total=0, translated=0} = totals;
        const untranslated = total - translated - fuzzy;
        return [
            {name: "total",
             value: total,
             percent: 100},
            {name: "translated",
             value: translated,
             percent: ((translated/total) * 100) || 0},
            {name: "fuzzy",
             value: fuzzy,
             percent: ((fuzzy/total) * 100 || 0)},
            {name: "untranslated",
             value: untranslated,
             percent: ((untranslated/total) * 100 || 0)}];
    }

    render () {
        return (
            <>
              <h4 className="text-black-50">
                <FormattedMessage
                  id="stats.translation.statistics"
                  defaultMessage="Translation statistics" />
              </h4>
              <Container className="mb-3 bg-light py-2">
                {this.statistics.map((value, index) => {
                    return (
                        <TranslationStatistic
                          key={index}
                          {...value} />);
                })}
              </Container>
            </>);
    }
}
