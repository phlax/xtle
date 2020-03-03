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
import {
    defineMessages, injectIntl} from "react-intl";

import {
    DropdownToggle,
    DropdownMenu,
    NavLink,
    UncontrolledDropdown} from "reactstrap";

import {
    splitPath, getTranslateURL,
    getBrowseURL} from "@l10n/xtle/utils/path";

import {BreadcrumbDropdownItem} from "./dropdown-item";


const translation = defineMessages({
    browse: {
        id: "breadcrumb.navigation.browse",
        defaultMessage: "Browse"
    },
    translate: {
        id: "breadcrumb.navigation.translate",
        defaultMessage: "Translate"
    },
});


export class BaseBreadcrumbsBrowse extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    });

    get canTranslate () {
        const {path} = this.props;
        const parts = splitPath(path);
        return (
            (parts.language && parts.project)
                ? true
                : false);
    }

    get isTranslateURL () {
	const {path} = this.props;
        return splitPath(path).translate ? true : false;
    }

    renderSelected = () => {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return (
            this.isTranslateURL
                ? formatMessage(translation.translate)
                : formatMessage(translation.browse));
    };

    render () {
        const {intl, path} = this.props;
        const {formatMessage} = intl;

        if (!this.canTranslate) {
            return (
                <UncontrolledDropdown nav inNavbar>
                  <NavLink className="text-black-50">
                    {formatMessage(translation.browse)}
                  </NavLink>
                </UncontrolledDropdown>
            );
        }
        const {isTranslateURL} = this;
        return (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle
                caret nav
                tag="span"
                className="btn text-primary">
                {this.renderSelected()}
              </DropdownToggle>
              <DropdownMenu
                className="px-0 py-2 mt-0 border-top-0 rounded-0 bg-white">
                <BreadcrumbDropdownItem
                  title={formatMessage(translation.browse)}
                  url={isTranslateURL ? getBrowseURL(path) : ""} />
                <BreadcrumbDropdownItem
                  url={!isTranslateURL ? getTranslateURL(path) : ""}
                  title={formatMessage(translation.translate)} />
              </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

export const BreadcrumbsBrowse = injectIntl(BaseBreadcrumbsBrowse);
