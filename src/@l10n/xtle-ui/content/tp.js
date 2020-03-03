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

import {Link} from "@chango/ui";

import {TranslationTable} from "../table/translation";
import {Controls} from "@l10n/xtle-ui/controls";
import {Body} from "@l10n/xtle-ui/body";


export class TP extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    get language () {
        const {match} = this.props;
        return match.params.language;
    }

    getName = (item) => {
        if (item.dir) {
            return (
                <>
                  <i className="icon icon-folder" />{" "}
                  {item.code}
                </>
            );
        }
        return (
            <>
              <i className="icon icon-file" />{" "}
              {item.code}
            </>
        );
    };

    render () {
        const {data, match} = this.props;
        let link = "/" + this.language + "/";
        let text = "🡐 Back to language";
        if (match.params.tp_path) {
            link = link + match.params.project + "/";
            text = "🡐 Back to parent folder";
        }
        return (
            <Body>
              <Controls
                match={match}
                data={data} />
              <Row>
                <Col className="px-4 py-0 mb-0 mt-2">
                  <Link to={link}>{text}</Link>
                </Col>
              </Row>
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
