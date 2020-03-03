/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";

import CheckboxTable from "@phlax/react-checkbox-table";

import ChannelsUI from "@chango/ui";


export class AddModalContent extends React.PureComponent {
    static propTypes = ChannelsUI.modalPropTypes;

    render () {
        const Content = ChannelsUI.modals.AddModal.content;
	return (
            <Content
              TableComponent={CheckboxTable}
              {...this.props} />);
    }
}


export const allModals = {
    "channels.ui.add" : {
	title: ChannelsUI.modals.AddModal.title,
	content: AddModalContent,
    },
};
