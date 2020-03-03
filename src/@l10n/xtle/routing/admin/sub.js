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
import {Route, Switch} from "react-router-dom";


export class AdminSubRoute extends React.PureComponent {
    static propTypes = exact({
        name: PropTypes.string.isRequired,
        match: PropTypes.object.isRequired,
	ItemComponent: PropTypes.elementType.isRequired,
	AddComponent: PropTypes.elementType.isRequired,
	AdminComponent: PropTypes.elementType.isRequired,
    });

    render () {
        const {
            match, name,
            ItemComponent, AddComponent,
            AdminComponent} = this.props;
        return (
            <Switch>
              <Route
                path={match.path + "/add"}
                render={(props) => (
                    <AddComponent match={props.match} />
                )}
              />
              <Route
                path={match.path + "/:" + name}
                render={(props) => (
                    <ItemComponent match={props.match} />
                )}
              />
              <AdminComponent match={match} />
            </Switch>);
    }
}
