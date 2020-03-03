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

import XTLEUI from "@l10n/xtle-ui";


const Project = ChannelsUI.withData(XTLEUI.Project);
const Projects = ChannelsUI.withData(XTLEUI.Projects);


export class ProjectsRoute extends React.PureComponent {
    static propTypes = exact({
        match: PropTypes.object.isRequired,
    });

    render () {
        const {match} = this.props;
        return (
            <Switch>
              <Route
                path={match.path + "/:project"}
                render={(props) => <Project match={props.match} />}
              />
              <Projects match={match} />
            </Switch>);
    }
}
