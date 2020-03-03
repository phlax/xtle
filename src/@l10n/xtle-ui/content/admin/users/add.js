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

import {AdminAdd} from "../base";


const translation = defineMessages({
    title: {
        id: "xtle.user.add.title",
        defaultMessage: "Add a user"
    },
    label: {
        id: "xtle.user.add.label",
        defaultMessage: "Add user"
    },
});


export class BaseUserAdminAdd extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });
    addAPI = "xtle.admin.users.add";

    render () {
        const {intl, ...props} = this.props;
        const {formatMessage} = intl;
        return (
            <AdminAdd
              title={formatMessage(translation.title)}
              addLabel={formatMessage(translation.label)}
              addAPI={this.addAPI}
              {...props} />);
    }
}


export const UserAdminAdd = injectIntl(BaseUserAdminAdd);
