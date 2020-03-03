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

import {ProjectUsersFieldset} from "./users";

import {ItemSubAdmin} from "../../../base/item";


const translation = defineMessages({
    users: {
        id: "admin.project.roles.users",
        defaultMessage: "Users that can view the project"
    },
    suggesters: {
        id: "admin.project.roles.suggest",
        defaultMessage: "Users that can make suggestions"
    },
    editors: {
        id: "admin.project.roles.editor",
        defaultMessage: "Users that can translate"
    },
    reviewers: {
        id: "admin.project.roles.reviewer",
        defaultMessage: "Users that can review suggestions"
    },
    admins: {
        id: "admin.project.roles.admin",
        defaultMessage: "Project admins"
    },
});


export class BaseProjectUsersAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.users),
             <ProjectUsersFieldset key={0} />],
            [formatMessage(translation.suggesters),
             <ProjectUsersFieldset key={1} />],
            [formatMessage(translation.editors),
             <ProjectUsersFieldset key={2} />],
            [formatMessage(translation.reviewers),
             <ProjectUsersFieldset key={3} />],
            [formatMessage(translation.admins),
             <ProjectUsersFieldset key={4} />]];
    }

    render () {
        return (
            <ItemSubAdmin
              fieldsets={this.fieldsets} />
        );
    }
}


export const ProjectUsersAdmin = injectIntl(BaseProjectUsersAdmin);
