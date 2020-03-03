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

import {Col, Row} from "reactstrap";

import ChannelsUI, {Icon} from "@chango/ui";

import {TranslationTable} from "../table/translation";
import {Controls} from "@l10n/xtle-ui/controls";
import {Body} from "@l10n/xtle-ui/body";


export class Project extends React.PureComponent {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });
    _languages = null;

    get languages () {
        if (!this._languages) {
            this._languages = this.context.getState(
                "settings")["xtle.languages.site"];
        }
        return this._languages;
    }

    getName = (item) => {
        return (
            <>
              <Icon name="language" />{" "}
              {this.languages[item.code]}
            </>);
    };

    render () {
        const {data, match} = this.props;
        return (
            <Body>
              <Controls
                match={match}
                data={data} />
              <Row>
                <Col>
                  <TranslationTable
                    getName={this.getName}
                    totals={data.totals}
                    items={data.children} />
                </Col>
              </Row>
            </Body>
        );
    }
}


export class Projects extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    getName = (item) => {
        return (<div><i className="icon icon-project" /> {item.name}</div>);
    };

    render () {
        const {data, match} = this.props;
        if (!data) {
            return "";
        }
        return (
            <Body>
              <Controls
                match={match}
                data={data} />
              <Row>
                <Col>
                  <TranslationTable
                    getName={this.getName}
                    totals={data.totals}
                    items={data.children} />
                </Col>
              </Row>
            </Body>

        );
    }
}
