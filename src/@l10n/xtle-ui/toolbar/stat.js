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
import {FormattedNumber} from "react-intl";

import {
    Badge,
    NavItem,
    NavLink} from "reactstrap";

import {Link} from "@chango/ui";

import {getTranslateURL} from "@l10n/xtle/utils/path";


export class ToolbarStat extends React.PureComponent {
    static propTypes = exact({
        children: PropTypes.object,
        color: PropTypes.string,
        url: PropTypes.string.isRequired,
        value: PropTypes.number,
    });

    render () {
        const {color, url, value} = this.props;
        return (
            <NavItem className="mx-auto">
              <NavLink tag="span">
                <Link to={getTranslateURL(url)}>
                  {this.props.children}{" "}
                   <Badge color={color} pill>
                     <FormattedNumber
                       value={value} />
                   </Badge>
                </Link>
              </NavLink>
            </NavItem>);
    }
}
