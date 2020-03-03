
import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import {injectIntl, defineMessages} from "react-intl";

import CheckboxTable from "@phlax/react-checkbox-table";

import ChannelsUI from "@chango/ui";


const translation = defineMessages({
    addLanguages: {
        id: "xtle.language.add.teams",
        defaultMessage: "Add teams to the language"
    },
});


export {translation};


export class BaseTeamLanguagesFieldset extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    searchAPI = "xtle.admin.team.search";

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


export const TeamLanguagesFieldset = injectIntl(BaseTeamLanguagesFieldset);
