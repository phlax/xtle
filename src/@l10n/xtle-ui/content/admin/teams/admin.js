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
import {defineMessages, injectIntl} from "react-intl";

import {BaseAdmin} from "../base";


const translation = defineMessages({
    title: {
        id: "admin.team.title",
        defaultMessage: "Team admin"
    },
    add: {
        id: "admin.team.add",
        defaultMessage: "Add a new team"
    },
    delete: {
        id: "admin.team.delete",
        defaultMessage: "Delete selected teams"
    },
});


export {translation};


export class BaseTeamsAdmin extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    searchAPI = "xtle.admin.teams";
    deleteAPI = "xtle.admin.teams.delete";
    store = "xtle.admin.teams";

    render () {
        const {intl, ...props} = this.props;
        const {formatMessage} = intl;
        return (
            <BaseAdmin
              store={this.store}
              searchAPI={this.searchAPI}
              deleteAPI={this.deleteAPI}
              title={formatMessage(translation.title)}
              addMessage={formatMessage(translation.add)}
              deleteLabel={formatMessage(translation.delete)}
              {...props} />);
    }
}


export const TeamsAdmin = injectIntl(BaseTeamsAdmin);
