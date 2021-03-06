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

import {LanguageProjectsFieldset} from "./projects";

import {ItemSubAdmin} from "../../../base/item";


const translation = defineMessages({
    languages: {
        id: "admin.project.languages",
        defaultMessage: "Project languages"
    },
});


export class BaseLanguageProjectsAdmin extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    get fieldsets () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            [formatMessage(translation.languages),
             <LanguageProjectsFieldset key={2} />]];
    }

    render () {
        return (
            <ItemSubAdmin
              fieldsets={this.fieldsets} />
        );
    }
}


export const LanguageProjectsAdmin = injectIntl(BaseLanguageProjectsAdmin);
