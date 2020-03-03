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

import {DropdownToggle} from "reactstrap";

import {Link} from "@chango/ui";


export class BreadcrumbTitle extends React.PureComponent {
    static propTypes = exact({
        selected: PropTypes.string,
        clearURL: PropTypes.string,
        canClear: PropTypes.bool,
        showDropdown: PropTypes.bool,
        defaultMessage: PropTypes.string.isRequired,
    });

    onClick = (e) => {
        e.stopPropagation();
    };

    render () {
        const {
            canClear, clearURL,
            defaultMessage, showDropdown,
            selected} = this.props;
        let className = selected ? "" : "btn text-black-50";
        let message = selected ? selected : defaultMessage;
        return (
            <DropdownToggle
              nav
              caret={showDropdown}
              tag="span"
              className={className}>
              {message}{" "}
              {(selected && canClear) &&
               <Link
                 onClick={this.onClick}
                 to={clearURL}>×</Link>
              }
            </DropdownToggle>);
    }

}
