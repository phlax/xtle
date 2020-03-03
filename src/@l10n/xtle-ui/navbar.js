/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";

import {Row, Col} from "reactstrap";

import Logos from "@l10n/xtle-ui/logos";
import Menus from "@l10n/xtle-ui/menus";


export default class Navbar extends React.PureComponent {

    render () {
        return (
            <>
              <Row className="bg-white">
                <Col>
                  <Logos />
                </Col>
                <Col className="text-right py-1">
                  <Menus />
                </Col>
              </Row>
            </>);
    }
}
