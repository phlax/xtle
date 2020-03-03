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

import ChannelsUI from "@chango/ui";
import {splitPath, updatePath} from "@l10n/xtle/utils/path";

import {BreadcrumbDropdown} from "./dropdown";


const translation = defineMessages({
    allLanguages: {
        id: "breadcrumb.languages.all",
        defaultMessage: "All languages"
    },
});


export class BaseLanguagesBreadcrumb extends React.PureComponent {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
    });

    state = {search: null};

    itemURL = (item) => {
        const {path} = this.props;
        return updatePath(path, {language: item});
    };

    get canClear () {
        const {path} = this.props;
        return splitPath(path).translate ? false : true;
    }

    get clearURL () {
        const {path} = this.props;
        return updatePath(
            path,
            {language: null,
             dir: null,
             filename: null});
    }

    get languages () {
        const {data} = this.props;
        return Object.fromEntries(
            (data.languages || []).map(k => [k, this.siteLanguages[k]]));
    }

    constructor (props, context) {
        super(props, context);
        const {setting} = this.context;
        this.siteLanguages = setting("xtle.languages.site");
    }

    render () {
        const {intl, selected} = this.props;
        const {formatMessage} = intl;
        const languages = this.languages;
        return (
            <BreadcrumbDropdown
              selected={selected ? languages[selected] : selected}
              clearURL={this.clearURL}
              canClear={this.canClear}
              defaultMessage={formatMessage(translation.allLanguages)}
              itemURL={this.itemURL}
              items={languages} />
        );
    }
}

export const LanguagesBreadcrumb = injectIntl(BaseLanguagesBreadcrumb);
