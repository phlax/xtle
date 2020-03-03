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

import ChannelsUI from "@chango/ui";

import XTLEAdminUI from "@l10n/xtle-ui/content/admin";
import {AdminSubRoute} from "./sub";


export class AdminRoute extends React.PureComponent {
    static propTypes = exact({
        match: PropTypes.object.isRequired,
    });

    constructor (props) {
        super(props);
        this.Admin = ChannelsUI.withData(XTLEAdminUI.Admin);
    }

    get routes () {
        return ["Language", "Project", "User", "Team"];
    }

    render () {
        const {Admin} = this;
        const {match} = this.props;
        return (
            <Switch>
              {this.routes.map((path, index) => {
                  const AdminComponent = ChannelsUI.withData(XTLEAdminUI[path + "sAdmin"]);
                  const ItemComponent = ChannelsUI.withData(XTLEAdminUI[path + "Admin"]);
                  const AddComponent = ChannelsUI.withData(XTLEAdminUI[path + "AdminAdd"]);
                  return (
                      <Route
                        key={index}
                        path={match.path + "/" + path.toLowerCase() + "s"}
                        render={(props) => (
                            <AdminSubRoute
                              match={props.match}
                              name={path.toLowerCase()}
                              ItemComponent={ItemComponent}
                              AddComponent={AddComponent}
                              AdminComponent={AdminComponent} />)} />);
              })}
              <Admin match={match} />
            </Switch>);
    }
}
