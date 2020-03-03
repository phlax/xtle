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

import {Row, Col} from "reactstrap";

import Scroller from "@phlax/react-scroller";

import {ToolbarSearch} from "@l10n/xtle-ui/toolbar";


export class TranslateToolbar extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired,
    });

    render () {
        return (
            <>
              <Row className="p-2 bg-white">
                <Col>
                  <ToolbarSearch />
                </Col>
                <Col>
                </Col>
                <Col className="text-right">
                  <Scroller.Nav
                    className="bg-light"
                    buttonClassName="btn btn-light p-1"/>
                </Col>
              </Row>
            </>
        );
    }
}
