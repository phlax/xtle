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
import {defineMessages} from "react-intl";

import {Col, Row} from "reactstrap";

import Scroller from  "@phlax/react-scroller";

import ChannelsUI from "@chango/ui";

import {updatePath} from "@l10n/xtle/utils";
import {Body} from "@l10n/xtle-ui/body";
import {UnitRow} from "./row";
import {UnitEditRow} from "./edit-row";
import {TranslateControls} from "./controls";


const messages = defineMessages({
    up: {
        id: "scroller.nav.up",
        defaultMessage: "Up"},
    down: {
        id: "scroller.nav.down",
        defaultMessage: "Down"},
});

export {messages};


export class Translate extends React.Component {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
    });
    api = "xtle.store.units";
    state = {updating: false, current: null};

    fetch = (index) => {
        const {updating} = this.state;
        if (updating) {
            return;
        }
        const {data, match} = this.props;
        const {end, start, units} = data;
        const params = {
            offset: index,
            path: updatePath(match.url, {translate: false})};
        if (index > start && index < end) {
            params.offset = data.end;
            params["previous_uids"] = units.map(u => u.id);
        }
        this.call(params);
    };

    call = async (params) => {
        this.setState({updating: true});
        await this.context.call(this.api, {params});
        this.setState({updating: false});
    };

    text = (msg) => {
        const {intl} = this.props;
        this.strings = {
            up: intl.formatMessage(messages.up),
            down: intl.formatMessage(messages.down),
        };
        return this.strings[msg] || msg;
    };

    render () {
        const {intl, ...props} = this.props;
        const {end, start, total, units} = props.data;
        return (
            <Body>
              <Scroller.Provider
                formatter={this.text}
                fetch={this.fetch}>
                <TranslateControls {...props} />
                <Row>
                  <Scroller.Content
                    className="py-3"
                    Container={Col}
                    Row={UnitRow}
                    FocusRow={UnitEditRow}
                    units={units}
                    start={start}
                    end={end}
                    total={total}
                  />
                </Row>
              </Scroller.Provider>
            </Body>
        );
    }
}
