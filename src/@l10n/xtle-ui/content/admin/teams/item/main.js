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

import ChannelsUI from "@chango/ui";

import {ItemAdmin} from "../../base";
import {TeamConfig} from "./config";
import {TeamProjectsAdmin} from "./projects";
import {TeamLanguagesAdmin} from "./languages";
import {TeamUsersAdmin} from "./users";


const translation = defineMessages({
    title: {
        id: "admin.team.title",
        defaultMessage: "Team admin"
    },
    team: {
        id: "admin.team.team",
        defaultMessage: "Team"
    },
    projects: {
        id: "admin.team.projects",
        defaultMessage: "Projects"
    },
    users: {
        id: "admin.team.users",
        defaultMessage: "Users"
    },
    languages: {
        id: "admin.language.languages",
        defaultMessage: "Languages"
    },
});


export class BaseTeamAdmin extends React.Component {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        match: PropTypes.object.isRewquired,
        intl: PropTypes.object.isRequired,
    });

    get tabs () {
        const object = this.context.getData("object") || {};
        const {intl, match} = this.props;
        const {formatMessage} = intl;
        const tabs = {
            team: {
                title: formatMessage(translation.team),
                component: <TeamConfig match={match} />},
            projects: {
                title: formatMessage(translation.projects),
                component: <TeamProjectsAdmin />},
            languages: {
                title: formatMessage(translation.languages),
                component: <TeamLanguagesAdmin />},
            users: {
                title: formatMessage(translation.users),
                component: <TeamUsersAdmin />}};
        if (object["all_projects"]) {
            delete tabs.projects;
        }
        if (object["all_languages"]) {
            delete tabs.languages;
        }
        return tabs;
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


export const TeamAdmin = injectIntl(BaseTeamAdmin);
