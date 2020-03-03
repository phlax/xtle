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

import {UserAvatar} from "@chango/ui";

import {getUserURL} from "@l10n/xtle/utils/path";


export class ContributorStatistics extends React.PureComponent {
    static propTypes = exact({
        username: PropTypes.string.isRequired,
        md5: PropTypes.string.isRequired,
        rank: PropTypes.number.isRequired,
        score: PropTypes.number.isRequired,
    });

    render () {
        const {md5, rank, score, username} = this.props;
        return (
            <Row>
              <Col xs={1}>
                <FormattedNumber
                  value={rank}
                  style="ordinal" />
              </Col>
              <Col xs={9}>
                <UserAvatar
                  url={getUserURL(username)}
                  md5={md5}
                  username={username} />
              </Col>
              <Col xs={2} className="text-muted">
                <FormattedNumber
                  value={score} />
              </Col>
            </Row>);
    }
}


export class Contributors extends React.PureComponent {
    static propTypes = exact({
        contributors: PropTypes.array.isRequired,
    });

    render () {
        const {contributors} = this.props;
        console.log(contributors);
        return (
            <>
              <h4 className="text-black-50">
                <FormattedMessage
                  id="stats.contributors.recent"
                  defaultMessage="Contributors, 30 days" />
              </h4>
              <Container className="mb-3 bg-light py-2">
                {contributors.map((value, index) => {
                    return (
                        <ContributorStatistics
                          key={index}
                          rank={index + 1}
                          {...value} />);
                })}
              </Container>
            </>);
    }
}
