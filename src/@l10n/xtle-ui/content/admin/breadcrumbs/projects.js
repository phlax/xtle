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
    projects: {
        id: "admin.breadcrumb.projects",
        defaultMessage: "Projects"
    },
    manageProjects: {
        id: "admin.breadcrumb.manage_projects",
        defaultMessage: "Manage projects"
    },
    addProject: {
        id: "admin.breadcrumb.add_project",
        defaultMessage: "Add project"
    },
    viewProjects: {
        id: "admin.breadcrumb.view_projects",
        defaultMessage: "View projects"
    },
});


export {translation};


export class BaseProjectsBreadcrumb extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    itemURL = (item) => {
        if (item === "view") {
            return "/projects/";
        }
    };

    get items () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return {
            manage: formatMessage(translation.manageProjects),
            add: formatMessage(translation.addProject),
            view: formatMessage(translation.viewProjects)};
    }

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <AdminBreadcrumb
              itemURL={this.itemURL}
              domain="projects"
              defaultMessage={formatMessage(translation.projects)}
              items={this.items} />
        );
    }
}


export const ProjectsAdminBreadcrumb = injectIntl(BaseProjectsBreadcrumb);
