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

import {ProjectSyncFieldset} from "./sync";


const translation = defineMessages({
    sync: {
        id: "admin.project.sync.form",
        defaultMessage: "Repository synchronization policy"
    },
});


export class BaseProjectSyncAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.sync),
             <ProjectSyncFieldset key={0} />,
             {className: "bg-light p-2",
              legend: {
                  className: "col-form-label px-3 bg-white"}}]];
    }

    render () {
        return (
            <div className="p-2">
              <ChannelsUI.forms.Fieldsets
                fieldsets={this.fieldsets} />
            </div>
	);
    }
}


export const ProjectSyncAdmin = injectIntl(BaseProjectSyncAdmin);
