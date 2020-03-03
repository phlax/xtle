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

import {ItemAdmin} from "../../base";
import {ProjectRepositoryAdmin} from "./repository";
import {ProjectSyncAdmin} from "./sync";
import {ProjectLanguagesAdmin} from "./languages";
import {ProjectUsersAdmin} from "./users";
import {ProjectTeamsAdmin} from "./teams";
import {ProjectConfigAdmin} from "./config";


const translation = defineMessages({
    title: {
        id: "admin.project.title",
        defaultMessage: "Project admin"
    },
    project: {
        id: "admin.project.project",
        defaultMessage: "Project"
    },
    repository: {
        id: "admin.project.repository",
        defaultMessage: "Repository"
    },
    sync: {
        id: "admin.project.sync",
        defaultMessage: "Sync policy"
    },
    languages: {
        id: "admin.project.languages",
        defaultMessage: "Languages"
    },
    users: {
        id: "admin.project.users",
        defaultMessage: "Users"
    },
    teams: {
        id: "admin.project.teams",
        defaultMessage: "Teams"
    },
});


export class BaseProjectAdmin extends React.Component {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get tabs () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            project: {
                title: formatMessage(translation.project),
                component: <ProjectConfigAdmin />},
            repo: {
                title: formatMessage(translation.repository),
                component: <ProjectRepositoryAdmin />},
            sync: {
                title: formatMessage(translation.sync),
                component: <ProjectSyncAdmin />},
            languages: {
                title: formatMessage(translation.languages),
                component: <ProjectLanguagesAdmin />},
            users: {
                title: formatMessage(translation.users),
                component: <ProjectUsersAdmin />},
            teams: {
                title: formatMessage(translation.teams),
                component: <ProjectTeamsAdmin />}};
    }

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <ItemAdmin
              title={formatMessage(translation.title)}
              tabs={this.tabs}
              {...this.props}>
            </ItemAdmin>);
    }
}


export const ProjectAdmin = injectIntl(BaseProjectAdmin);
