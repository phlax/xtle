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

import {LanguageTeamsFieldset} from "./teams";

import {ItemSubAdmin} from "../../../base/item";


const translation = defineMessages({
    teams: {
        id: "admin.project.roles.teams",
        defaultMessage: "Teams that can translate and manage this project"
    },
});


export class BaseLanguageTeamsAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.teams),
             <LanguageTeamsFieldset key={0} />]];
    }

    render () {
        return (
            <ItemSubAdmin
              fieldsets={this.fieldsets} />
        );
    }
}


export const LanguageTeamsAdmin = injectIntl(BaseLanguageTeamsAdmin);
