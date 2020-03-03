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
import {LanguageConfig} from "./config";
import {LanguageTeamsAdmin} from "./teams";
import {LanguageProjectsAdmin} from "./projects";
import {LanguageUsersAdmin} from "./users";


const translation = defineMessages({
    title: {
        id: "admin.language.title",
        defaultMessage: "Language admin"
    },
    language: {
        id: "admin.language.language",
        defaultMessage: "Language"
    },
    projects: {
        id: "admin.language.projects",
        defaultMessage: "Projects"
    },
    users: {
        id: "admin.language.users",
        defaultMessage: "Users"
    },
    teams: {
        id: "admin.language.teams",
        defaultMessage: "Teams"
    },
});


export class BaseLanguageAdmin extends React.Component {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get tabs () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            config: {
                title: formatMessage(translation.language),
                component: <LanguageConfig />},
            projects: {
                title: formatMessage(translation.projects),
                component: <LanguageProjectsAdmin />},
            users: {
                title: formatMessage(translation.users),
                component: <LanguageUsersAdmin />},
            teams: {
                title: formatMessage(translation.teams),
                component: <LanguageTeamsAdmin />}};
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


export const LanguageAdmin = injectIntl(BaseLanguageAdmin);
