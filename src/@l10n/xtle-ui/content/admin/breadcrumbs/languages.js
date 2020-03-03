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

import {AdminBreadcrumb} from "./base";


const translation = defineMessages({
    languages: {
        id: "admin.breadcrumb.languages",
        defaultMessage: "Languages"
    },
    manageLanguages: {
        id: "admin.breadcrumb.manage_languages",
        defaultMessage: "Manage languages"
    },
    addLanguage: {
        id: "admin.breadcrumb.add_language",
        defaultMessage: "Add language"
    },
});


export {translation};


export class BaseLanguagesBreadcrumb extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get items () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            manage: formatMessage(translation.manageLanguages),
            add: formatMessage(translation.addLanguage)};
    }

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <AdminBreadcrumb
              domain="languages"
              defaultMessage={formatMessage(translation.languages)}
              items={this.items} />
        );
    }
}


export const LanguagesAdminBreadcrumb = injectIntl(BaseLanguagesBreadcrumb);
