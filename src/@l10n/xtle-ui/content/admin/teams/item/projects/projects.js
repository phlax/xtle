
import React from "react";

import CheckboxTable from "@phlax/react-checkbox-table";

import ChannelsUI from "@chango/ui";


export class TeamProjectsFieldset extends React.PureComponent {
    static contextType = ChannelsUI.Context;

    render () {
        const items = [["item1"]];
        return (
            <CheckboxTable
              data={(items || [])}
              columns={this.context.getColumns(["name"])} />);

    }
}
