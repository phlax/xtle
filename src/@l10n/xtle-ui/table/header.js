/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import PropTypes from "prop-types";
import {injectIntl, defineMessages} from "react-intl";


const translation = defineMessages({
    name: {
        id: "xtle.column.header.name",
        defaultMessage: "Name"
    },
    username: {
        id: "xtle.column.header.username",
        defaultMessage: "Username"
    },
});


export {translation};


export class BaseHeader extends React.PureComponent {
    static propTypes = {
        intl: PropTypes.object.isRequired,
        column: PropTypes.object.isRequired,
    };

    render () {
        const {column, intl} = this.props;
        const {formatMessage} = intl;
        return formatMessage(translation[column.id]);
    }
}


export const Header = injectIntl(BaseHeader);
