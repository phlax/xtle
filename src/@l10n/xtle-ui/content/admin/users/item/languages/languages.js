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

import CheckboxTable from "@phlax/react-checkbox-table";

import ChannelsUI from "@chango/ui";


const translation = defineMessages({
    addLanguages: {
        id: "xtle.language.add.users",
        defaultMessage: "Add users to the language"
    },
});


export {translation};


export class BaseUserLanguagesFieldset extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    searchAPI = "xtle.admin.user.search";

    render () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            <ChannelsUI.tables.SearchAndAddTable
              TableComponent={CheckboxTable}
              columns={["username"]}
              api={this.searchAPI}
              title={formatMessage(translation.addLanguages)}
              label={formatMessage(translation.addLanguages)} />);
    }
}


export const UserLanguagesFieldset = injectIntl(BaseUserLanguagesFieldset);
