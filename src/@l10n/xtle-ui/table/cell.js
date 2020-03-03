/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import PropTypes from "prop-types";

import {Link} from "@chango/ui";


export class Cell extends React.PureComponent {
    static propTypes = {
        cell: PropTypes.object.isRequired,
        row: PropTypes.object.isRequired,
    };

    render () {
        const {cell, row} = this.props;
        return (
            <Link to={row.original.code + "/"}>
              {cell.value}
            </Link>);
    }
}
