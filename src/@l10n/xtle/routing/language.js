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
import {TPRoute} from "./tp";
import {dynamic} from "@l10n/xtle/utils/dynamic";


const Language = ChannelsUI.withData(XTLEUI.Language);
const TranslateRoute = dynamic(() => import("./translate"), "TranslateRoute");


export class LanguageTPRoute extends React.PureComponent {
    static propTypes = exact({
        match: PropTypes.object.isRequired,
    });

    render () {
        const {match} = this.props;
        return (
            <Switch>
              <Route
                path={match.path + "/translate"}
                render={(props) => <TranslateRoute match={props.match} />}
              />
              <Route
                path={match.path + "/"}
                render={(props) => <TPRoute match={props.match} />}
              />
            </Switch>);
    }
}


export class LanguageRoute extends React.PureComponent {
    static propTypes = exact({
        match: PropTypes.object.isRequired,
    });

    render () {
        const {match} = this.props;
        return (
            <Switch>
              <Route
                path={match.path + "/:project"}
                render={(props) => <LanguageTPRoute match={props.match} />} />
              <Language match={match} />
            </Switch>);
    }
}
