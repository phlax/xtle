/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";

import {Container, Row, Col, Button} from "reactstrap";


export class RepositoryStatusFieldset extends React.PureComponent {

    render () {
        return (
            <Container>
              <Row>
                <Col>
                  <div>
                    <Button>Fetch repository now</Button>
                  </div>
                  <div>
                    <Button>Synchronize translations</Button>
                  </div>
                </Col>
                <Col>
                  Last synchronization...
                </Col>
                <Col>
                  has xtle changed ?

                  has fs changed ?
                </Col>
              </Row>
            </Container>
        );
    }
}
