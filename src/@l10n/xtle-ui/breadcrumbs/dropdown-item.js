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

import {DropdownItem} from "reactstrap";

import {Link} from "@chango/ui";


export class BreadcrumbDropdownItem extends React.PureComponent {
    static propTypes = exact({
        className: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string.isRequired
    });

    render () {
        const {className, title, url} = this.props;
        return (
            <DropdownItem
              className={className}
              active={!url}
              disabled={!url}>
              {url &&
               <Link
                 to={url}
                 className="d-block">
                 {title}
               </Link>
              }
              {!url &&
               <span
                 className="d-block text-black-50">
                 {title}
               </span>
              }
            </DropdownItem>);
    }
}
