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

import {joinPath, splitPath} from "@l10n/xtle/utils/path";
import {BreadcrumbDropdown} from "./dropdown";


const translation = defineMessages({
    allPaths: {
        id: "breadcrumb.paths.all",
        defaultMessage: "Entire project"
    },
});


export {translation};


export class BasePathsBreadcrumb extends React.Component {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
    });

    state = {search: null, items: {}};

    get clearURL () {
        const {path} = this.props;
        const parts = splitPath(path);
        delete parts.dir;
        delete parts.filename;
        return joinPath(parts);
    }

    componentDidMount () {
        this.unsubscribe = this.context.subscribe(this.subscribe);
    }

    componentWillUnmount () {
        this.unsubscribe();
    }

    subscribe = () => {
        const api = this.context.useSelector(s => s.api);
        if (!api) {
            return;
        }
        const items = api["xtle.breadcrumb.paths"];
        if (items && items !== this.state.items) {
            this.setState({items});
        }
    };

    onSearch = (e) => {
        const {path} = this.props;
        const search = e.target.value;
        if (search.length < 3) {
            if (this.state.items) {
                this.setState({items: {}});
            }
        } else {
            this.context.send(
                {api: "xtle.breadcrumb.paths",
                 params: {path, search}});
        }
    };

    render () {
        const {items} = this.state;
        const {intl, path} = this.props;
        const {formatMessage} = intl;
        const parts = splitPath(path);
        const selected = [];
        if (parts.dir) {
            selected.push(parts.dir);
        }
        if (parts.filename) {
            selected.push(parts.filename);
        } else if (parts.dir) {
            selected.push("");
        }
        return (
            <BreadcrumbDropdown
              selected={selected.join("/")}
              remote={true}
              onSearch={this.onSearch}
              clearURL={this.clearURL}
              canClear={true}
              defaultMessage={formatMessage(translation.allPaths)}
              itemURL={(i) => "/" + i + "/"}
              count={Object.keys(items).length}
              items={items} />
        );
    }
}


export const PathsBreadcrumb = injectIntl(BasePathsBreadcrumb);
