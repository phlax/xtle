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
import {Route} from "react-router-dom";

import ChannelsUI from "@chango/ui";

import {User as BaseUser} from "@l10n/xtle-ui/content/user";


const User = ChannelsUI.withData(BaseUser);


export class UserRoute extends React.PureComponent {
    static propTypes = exact({
        match: PropTypes.object.isRequired,
    });

    render () {
	const {match} = this.props;
        return (
            <Route
              path={match.path + "/:username"}
              render={(props) => <User match={props.match} />}
            />);
    }
}
