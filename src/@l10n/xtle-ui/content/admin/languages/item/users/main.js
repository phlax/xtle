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

import {LanguageUsersFieldset} from "./users";

import {ItemSubAdmin} from "../../../base/item";


const translation = defineMessages({
    users: {
        id: "admin.language.roles.users",
        defaultMessage: "Users that can view the language"
    },
    suggesters: {
        id: "admin.language.roles.suggest",
        defaultMessage: "Users that can make suggestions"
    },
    editors: {
        id: "admin.language.roles.editor",
        defaultMessage: "Users that can translate"
    },
    reviewers: {
        id: "admin.language.roles.reviewer",
        defaultMessage: "Users that can review suggestions"
    },
    admins: {
        id: "admin.language.roles.admin",
        defaultMessage: "Language admins"
    },
});


export class BaseLanguageUsersAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.users),
             <LanguageUsersFieldset key={0} />],
            [formatMessage(translation.suggesters),
             <LanguageUsersFieldset key={1} />],
            [formatMessage(translation.editors),
             <LanguageUsersFieldset key={2} />],
            [formatMessage(translation.reviewers),
             <LanguageUsersFieldset key={3} />],
            [formatMessage(translation.admins),
             <LanguageUsersFieldset key={4} />]];
    }

    render () {
        return (
            <ItemSubAdmin
              fieldsets={this.fieldsets} />
        );
    }
}


export const LanguageUsersAdmin = injectIntl(BaseLanguageUsersAdmin);
