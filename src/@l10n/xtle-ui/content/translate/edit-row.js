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

import {Col, Container, Row} from "reactstrap";

import ChannelsUI from "@chango/ui";


export class UnitEditRow extends React.Component {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        row: PropTypes.object.isRequired,
    });

    state = {unit: {}};

    componentDidMount () {
        // set timeout ?
        this.fetch();
    }

    componentDidUpdate (prevProps) {
        const {row} = this.props;
        if (prevProps.row !== row) {
            this.fetch();
        }
    }

    fetch = async () => {
        const {row} = this.props;
        const {call} = this.context;
        const {unit} = await call("xtle.store.unit", {params: {id: row.id}});
        this.setState({unit});
    };

    render () {
        const {unit} = this.state;
        const {row} = this.props;
        return (
            <Row className="edit-row">
              <Col className="translate-container">
                <Container>
                  <Row>
                    <Col className="unit-path">
                      {unit.id}{" "}
                      {row.source}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="xxx">
                      left
                    </Col>
                    <Col className="xxx">
                      <textarea value={row.target[0]} />
                    </Col>
                    <Col className="xxx">
                      right
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>);
    }
}
