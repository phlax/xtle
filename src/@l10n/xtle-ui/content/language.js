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

import {TranslationTable} from "../table/translation";
import {Controls} from "@l10n/xtle-ui/controls";
import {Body} from "@l10n/xtle-ui/body";


export class Language extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
    });

    getName = (item) => {
        return (
            <>
              <i className="icon icon-project" />{" "}
              {item.name}
            </>);
    };

    render () {
        const {data, match} = this.props;
        const {children, totals} = data;
        return (
            <Body>
              <Controls
                match={match}
                data={data} />
              <Row>
                <Col>
                  <TranslationTable
                    totals={totals}
                    items={children}
                    getName={this.getName} />
                </Col>
              </Row>
            </Body>

        );
    }
}
