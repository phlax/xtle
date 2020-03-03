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

import {joinAdminPath} from "@l10n/xtle/utils";
import {BreadcrumbDropdown} from "@l10n/xtle-ui/breadcrumbs/dropdown";


export class AdminBreadcrumb extends React.PureComponent {
    static propTypes = exact({
        itemURL: PropTypes.func,
        domain: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired,
        items: PropTypes.object.isRequired,
    });

    itemURL = (item) => {
        const {domain, itemURL} = this.props;
        if (itemURL) {
            const resolved = itemURL(item);
            if (resolved) {
                return resolved;
            }
        }
        return joinAdminPath(
            {domain: domain,
             action: item !== "manage" ? item : null});
    };

    render () {
        const {defaultMessage, items} = this.props;
        return (
            <BreadcrumbDropdown
              defaultMessage={defaultMessage}
              itemURL={this.itemURL}
              items={items} />
        );
    }
}
