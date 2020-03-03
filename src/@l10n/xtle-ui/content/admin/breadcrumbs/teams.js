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
import {injectIntl, defineMessages} from "react-intl";

import {AdminBreadcrumb} from "./base";


const translation = defineMessages({
    teams: {
        id: "admin.breadcrumb.teams",
        defaultMessage: "Teams"
    },
    manageTeams: {
        id: "admin.breadcrumb.manage_teams",
        defaultMessage: "Manage teams"
    },
    addTeam: {
        id: "admin.breadcrumb.add_team",
        defaultMessage: "Add team"
    },
});


export {translation};


export class BaseTeamsBreadcrumb extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get items () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            manage: formatMessage(translation.manageTeams),
            add: formatMessage(translation.addTeam)};
    }

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <AdminBreadcrumb
              domain="teams"
              defaultMessage={formatMessage(translation.teams)}
              items={this.items} />
        );
    }
}


export const TeamsAdminBreadcrumb = injectIntl(BaseTeamsBreadcrumb);
