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

import {splitPath, updatePath} from "@l10n/xtle/utils/path";
import {BreadcrumbDropdown} from "./dropdown";


const translation = defineMessages({
    allProjects: {
        id: "breadcrumb.projects.all",
        defaultMessage: "All projects"
    },
});


export {translation};


export class BaseProjectsBreadcrumb extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
    });

    get canClear () {
        const {path} = this.props;
        return splitPath(path).translate ? false : true;
    }

    get clearURL () {
        const {path} = this.props;
        return updatePath(
            path,
            {project: null,
             dir: null,
             filename: null});
    }

    itemURL = (item) => {
        const {path} = this.props;
        return updatePath(path, {project: item});
    };

    get items () {
        const {data} = this.props;
        return data.projects || {};
    }

    render () {
        const {intl, selected} = this.props;
        const {formatMessage} = intl;
        return (
            <BreadcrumbDropdown
              selected={selected}
              clearURL={this.clearURL}
              canClear={this.canClear}
              defaultMessage={formatMessage(translation.allProjects)}
              itemURL={this.itemURL}
              items={this.items} />
        );
    }
}


export const ProjectsBreadcrumb = injectIntl(BaseProjectsBreadcrumb);
