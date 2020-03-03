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

import {Body} from "@l10n/xtle-ui/body";


export class User extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    render () {
        return (
            <Body>
              <Row>
                <Col>
                  USER INFO
                </Col>
              </Row>
            </Body>

        );
    }
}
