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

import {
    Input,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

import {BreadcrumbDropdownItem} from "./dropdown-item";


export const translation = defineMessages({
    search: {
        id: "breadcrumb.search.placeholder",
        defaultMessage: "Search"
    }
});


export class BaseBreadcrumbDropdownMenu extends React.PureComponent {
    static propTypes = exact({
        selected: PropTypes.string,
        remote: PropTypes.bool,
        onSearch: PropTypes.func,
        count: PropTypes.number.isRequired,
        intl: PropTypes.object.isRequired,
        items: PropTypes.object.isRequired,
        itemURL: PropTypes.func.isRequired,
    });

    stopPropagation = (e) => {
        e.stopPropagation();
    };

    get hasSearch () {
        const {count, remote} = this.props;
        return (
            remote || count > 10
                ? true
                : false);
    }

    render () {
        const {
            intl, items, itemURL,
            onSearch, selected} = this.props;
        const {formatMessage} = intl;
        return (
            <DropdownMenu
              className="px-0 py-2 mt-0 border-top-0 rounded-0 bg-white">
              {this.hasSearch &&
               <DropdownItem className="p-1 small">
                 <Input
                   placeholder={formatMessage(translation.search)}
                   onChange={onSearch}
                   onClick={this.stopPropagation} />
               </DropdownItem>
              }
              <div className="xtle-dropdown-menu-results">
                {Object.keys(items).map((item, index) => {
                    return (
                        <BreadcrumbDropdownItem
                          key={index}
                          className="px-3 py-1"
                          url={(item !== selected) ? itemURL(item) : null}
                          title={items[item]} />);
                })}
              </div>
            </DropdownMenu>);
    }
}


export const BreadcrumbDropdownMenu = injectIntl(BaseBreadcrumbDropdownMenu);
