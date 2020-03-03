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

import {TeamUsersFieldset} from "./users";


const translation = defineMessages({
    users: {
        id: "admin.team.roles.users",
        defaultMessage: "Users that can view the team translation projects"
    },
    suggesters: {
        id: "admin.team.roles.suggest",
        defaultMessage: "Users that can make suggestions"
    },
    editors: {
        id: "admin.team.roles.editor",
        defaultMessage: "Users that can translate"
    },
    reviewers: {
        id: "admin.team.roles.reviewer",
        defaultMessage: "Users that can review suggestions"
    },
    admins: {
        id: "admin.team.roles.admin",
        defaultMessage: "Team admins"
    },
    label: {
        id: "admin.team.roles.label",
        defaultMessage: "Update members"
    },
});


export class BaseTeamUsersAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.users),
             <TeamUsersFieldset key={0} />],
            [formatMessage(translation.suggesters),
             <TeamUsersFieldset key={1} />],
            [formatMessage(translation.editors),
             <TeamUsersFieldset key={2} />],
            [formatMessage(translation.reviewers),
             <TeamUsersFieldset key={3} />],
            [formatMessage(translation.admins),
             <TeamUsersFieldset key={4} />]];
    }

    editAPI = "xtle.admin.teams.edit";
    searchAPI = "xtle.admin.teams.search";

    get fieldsetOptions () {
        return {
            className: "bg-light p-2",
            legend: {
                className: "col-form-label px-3 bg-white"}};
    }

    onSuccess = (response) => {
        console.log("GOT RESPONSE", response);
    };

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <ChannelsUI.forms.EditForm
              formData="members_form"
              instanceData="object"
              editAPI={this.editAPI}
              searchAPI={this.searchAPI}
              editLabel={formatMessage(translation.label)}
              fieldsetOptions={this.fieldsetOptions}
              onSuccess={this.onSuccess} />
        );
    }
}


export const TeamUsersAdmin = injectIntl(BaseTeamUsersAdmin);
