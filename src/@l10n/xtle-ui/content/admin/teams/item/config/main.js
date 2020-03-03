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

import {TeamSettingsFieldset} from "./settings";


const translation = defineMessages({
    teamSettings: {
        id: "admin.team.settings",
        defaultMessage: "Team settings"
    },
    label: {
        id: "admin.team.edit.label",
        defaultMessage: "Update team"
    },
});


export class BaseTeamConfig extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    editAPI = "xtle.admin.teams.edit";

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
        const {intl, match} = this.props;
        const {formatMessage} = intl;
        return (
            <ChannelsUI.forms.EditForm
              formData="form"
              instanceData="object"
              editAPI={this.editAPI}
              editLabel={formatMessage(translation.label)}
              fieldsetOptions={this.fieldsetOptions}
              onSuccess={this.onSuccess} />
	);
    }
}


export const TeamConfig = injectIntl(BaseTeamConfig);
