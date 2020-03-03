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

import {Breadcrumbs} from "@l10n/xtle-ui/breadcrumbs";
import {Stats} from "@l10n/xtle-ui/stats";
import {Toolbar} from "@l10n/xtle-ui/toolbar";


export class Controls extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired,
    });

    render () {
        return (
            <>
              <Breadcrumbs {...this.props} />
              <Stats {...this.props} />
              <Toolbar {...this.props} />
            </>);
    }
}
