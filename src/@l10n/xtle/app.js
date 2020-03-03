/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import exact from "prop-types-exact";

import Channels from "@chango/core";
import ChannelsUI from "@chango/ui";

import XTLEUI from "@l10n/xtle-ui";
import {dataReducer} from "./reducers";
import {LanguageRoute} from "./routing/language";
import {ProjectsRoute} from "./routing/projects";
import {dynamic} from "@l10n/xtle/utils/dynamic";

import {columns} from "./columns";

import "./xtle.css";


const AdminRoute = dynamic(() => import("./routing/admin"), "AdminRoute");
const UserRoute = dynamic(() => import("./routing/user"), "UserRoute");
const Welcome = ChannelsUI.withData(XTLEUI.Welcome);


export class App extends React.PureComponent {
    static propTypes = exact({});

    get reducers () {
        return Channels.withReducers({data: dataReducer});
    }

    get routes () {
        return [
            ["/", Welcome, true],
            ["/admin", AdminRoute, false],
            ["/user", UserRoute, false],
            ["/projects", ProjectsRoute, false],
            ["/:language", LanguageRoute, false]];
    }

    render () {
        return (
            <ChannelsUI.Provider
              modals={{...ChannelsUI.allModals, ...XTLEUI.allModals}}
              routes={this.routes}
              columns={columns}
              reducers={this.reducers} />
        );
    }
}
