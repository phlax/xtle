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
    users: {
        id: "admin.breadcrumb.users",
        defaultMessage: "Users"
    },
    manageUsers: {
        id: "admin.breadcrumb.manage_users",
        defaultMessage: "Manage users"
    },
    addUser: {
        id: "admin.breadcrumb.add_user",
        defaultMessage: "Add user"
    },
});


export {translation};


export class BaseUsersBreadcrumb extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get items () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            manage: formatMessage(translation.manageUsers),
            add: formatMessage(translation.addUser)};
    }

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <AdminBreadcrumb
              domain="users"
              defaultMessage={formatMessage(translation.users)}
              items={this.items} />
        );
    }
}


export const UsersAdminBreadcrumb = injectIntl(BaseUsersBreadcrumb);
