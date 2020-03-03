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
import {UserConfig} from "./config";
import {UserProjectsAdmin} from "./projects";
import {UserTeamsAdmin} from "./teams";
import {UserLanguagesAdmin} from "./languages";


const translation = defineMessages({
    title: {
        id: "admin.user.title",
        defaultMessage: "User admin"
    },
    user: {
        id: "admin.user.user",
        defaultMessage: "User"
    },
    projects: {
        id: "admin.user.projects",
        defaultMessage: "Projects"
    },
    languages: {
        id: "admin.language.languages",
        defaultMessage: "Languages"
    },
    teams: {
        id: "admin.user.teams",
        defaultMessage: "Teams"
    },
});


export class BaseUserAdmin extends React.Component {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get tabs () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            user: {
                title: formatMessage(translation.user),
                component: <UserConfig />},
            projects: {
                title: formatMessage(translation.projects),
                component: <UserProjectsAdmin />},
            languages: {
                title: formatMessage(translation.languages),
                component: <UserLanguagesAdmin />},
            teams: {
                title: formatMessage(translation.teams),
                component: <UserTeamsAdmin />}};
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


export const UserAdmin = injectIntl(BaseUserAdmin);
