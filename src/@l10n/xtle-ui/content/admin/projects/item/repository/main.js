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

import {RepositoryStatusFieldset} from "./status";
import {RepositoryConfigFieldset} from "./config";
import {RepositoryFilesFieldset} from "./files";


const translation = defineMessages({
    repositoryConfig: {
        id: "admin.project.repository.config",
        defaultMessage: "Repository config"
    },
    repositoryStatus: {
        id: "admin.project.repository.status",
        defaultMessage: "Repository status"
    },
    repositoryFiles: {
        id: "admin.project.repository.files",
        defaultMessage: "Repository files"
    },
});


export class BaseProjectRepositoryAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.repositoryStatus),
             <RepositoryStatusFieldset key={0} />],
            [formatMessage(translation.repositoryConfig),
             <RepositoryConfigFieldset key={1} />],
            [formatMessage(translation.repositoryFiles),
             <RepositoryFilesFieldset key={2} />]];
    }

    render () {
        return (
            <ChannelsUI.forms.Fieldsets
              fieldsets={this.fieldsets} />
	);
    }
}


export const ProjectRepositoryAdmin = injectIntl(BaseProjectRepositoryAdmin);
