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
import {defineMessages, injectIntl} from "react-intl";

import {BaseAdmin} from "../base";


const translation = defineMessages({
    title: {
        id: "admin.language.title",
        defaultMessage: "Language admin"
    },
    add: {
        id: "admin.language.add",
        defaultMessage: "Add a new language"
    },
    delete: {
        id: "admin.language.delete",
        defaultMessage: "Delete selected languages"
    },
});


export {translation};


export class BaseLanguagesAdmin extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });
    searchAPI = "xtle.admin.languages";
    deleteAPI = "xtle.admin.languages.delete";
    store = "xtle.admin.languages";

    render () {
        const {intl, ...props} = this.props;
        const {formatMessage} = intl;
        return (
            <BaseAdmin
              store={this.store}
              searchAPI={this.searchAPI}
              deleteAPI={this.deleteAPI}
              title={formatMessage(translation.title)}
              addMessage={formatMessage(translation.add)}
              deleteLabel={formatMessage(translation.delete)}
              {...props} />);
    }
}


export const LanguagesAdmin = injectIntl(BaseLanguagesAdmin);
