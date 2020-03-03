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
        id: "xtle.project.add.title",
        defaultMessage: "Add a project"
    },
    label: {
        id: "xtle.project.add.label",
        defaultMessage: "Add project"
    },
});


export class BaseProjectAdminAdd extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });
    addAPI = "xtle.admin.projects.add";

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


export const ProjectAdminAdd = injectIntl(BaseProjectAdminAdd);
