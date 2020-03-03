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

import {Dropdown} from "reactstrap";

import {BreadcrumbTitle} from "./title";
import {BreadcrumbDropdownMenu} from "./menu";


export class BreadcrumbDropdown extends React.Component {
    static propTypes = exact({
        count: PropTypes.number,
        onSearch: PropTypes.func,
        selected: PropTypes.string,
        remote: PropTypes.bool,
        clearURL: PropTypes.string,
        canClear: PropTypes.bool,
        defaultMessage: PropTypes.string.isRequired,
        items: PropTypes.object.isRequired,
        itemURL: PropTypes.func.isRequired,
    });

    state = {isOpen: false, search: null};

    onSearch = (e) => {
        this.setState({search: e.target.value});
    };

    toggle = () => {
        const {isOpen} = this.state;
        this.setState({isOpen: !isOpen});
    };

    get items () {
        const {items} = this.props;
        const {search} = this.state;
        if (!search) {
            return items;
        }
        return Object.fromEntries(
            Object.entries(items).filter(([key, value]) => {
                return (
                    key.indexOf(search) !== -1
                        || value.indexOf(search) !== -1);
            }));
    }

    get count () {
        const {count, items} = this.props;
        if (count) {
            return count;
        }
        return Object.keys(items).length;
    }

    get showDropdown () {
        const {remote, selected} = this.props;
        return (
            remote || (this.count > (selected ? 1 : 0))
                ? true
                : false);
    }

    render () {
        const {isOpen} = this.state;
        const {
            canClear, clearURL, defaultMessage,
            items, selected, ...props} = this.props;
        return (
            <Dropdown
              nav
              isOpen={isOpen}
              toggle={this.toggle}>
              <BreadcrumbTitle
                canClear={canClear}
                clearURL={clearURL}
                showDropdown={this.showDropdown}
                defaultMessage={defaultMessage}
                selected={selected} />
              {(isOpen && this.showDropdown) &&
               <BreadcrumbDropdownMenu
                 items={this.items}
                 selected={selected}
                 count={this.count}
                 onSearch={this.onSearch}
                 {...props} />
              }
            </Dropdown>);
    }
}
