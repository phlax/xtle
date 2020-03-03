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

import ChannelsUI from "@chango/ui";

import Navbar from "./navbar";

import "bootstrap/dist/css/bootstrap.min.css";

import "./resources/app.css";
import "./resources/rtl.css";
import "./resources/icons.css";
import "./resources/colors.css";


export class Body extends React.PureComponent {
    static propTypes = exact({
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
            PropTypes.string
        ]).isRequired,
    });

    render () {
        const {children} = this.props;
        return (
            <>
              <Navbar />
              {children}
              <ChannelsUI.Modal />
            </>);
    }
}
