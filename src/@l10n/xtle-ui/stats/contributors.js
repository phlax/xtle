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

import {UserAvatar} from "@chango/ui";

import {getUserURL} from "@l10n/xtle/utils/path";


export class ContributorSummary extends React.PureComponent {
    static propTypes = exact({
        rank: PropTypes.number.isRequired,
        md5: PropTypes.string.isRequired,
        username:  PropTypes.string.isRequired,
        score:  PropTypes.number.isRequired,
    });

    render () {
        const {rank, md5, score, username} = this.props;
        const style = "ordinal";
        return (
            <span className="pl-4 d-inline-block">
              <small>
                <FormattedNumber
                  value={rank}
                  style={style} />
              </small>{" "}
              <UserAvatar
                url={getUserURL(username)}
                username={username}
                md5={md5} />{" "}
              <small className="text-black-50">
                <FormattedNumber
                  value={score} />
              </small>
            </span>
        );
    }
}


export class ContributorsSummary extends React.PureComponent {
    static propTypes = exact({
        contributors: PropTypes.array.isRequired,
    });

    render () {
        const {contributors} = this.props;
        return (
            <>
              <span className="text-black-50">
                <FormattedMessage
                  id="control.stats.contributors.top"
                  defaultMessage="Top contributors:" />
              </span>
              {contributors.map((contributor, key) => {
                  const {md5, score, username} = contributor;
                  return (
                      <ContributorSummary
                        key={key}
                        rank={key}
                        md5={md5}
                        username={username}
                        score={score} /> );
              })}
            </>);
    }
}
