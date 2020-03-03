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

import {
    Row,
    Col,
    Collapse,
} from "reactstrap";

import {dynamic} from "@l10n/xtle/utils/dynamic";
import {ProgressBar} from "./progress";
import {ContributorsSummary} from "./contributors";
import {StatsToggle} from "./toggle";


const StatisticsPanel = dynamic(
    () => import("./info"), "StatisticsPanel");


export {StatisticsPanel};


export class Stats extends React.Component {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired,
    });

    state = {isOpen: false};

    get progress () {
        const {totals={}} = this.props.data;
        const translated = Math.round((totals.translated / totals.total) * 1000) / 10;
        const fuzzy = Math.round((totals.fuzzy / totals.total) * 1000) / 10;
        return [
            ["success", translated || 0],
            ["warning", fuzzy || 0]
        ];
    }

    toggle = () => {
        const {isOpen} = this.state;
        this.setState({isOpen: !isOpen});
    };

    render () {
	const {isOpen} = this.state;
        const {data, match} = this.props;
        const {contributors=[]} = data;
        return (
            <>
              <Row className="bg-light">
                <Col>
                  <ProgressBar
                    items={this.progress} />
                </Col>
              </Row>
              <Row className="bg-light pl-3 pr-3">
                <Col xs={10} className="pr-0 pt-1 bg-white">
                  {!isOpen &&
                   <ContributorsSummary
                     contributors={contributors.slice(0, 3)} />
                  }
                </Col>
                <Col xs={2} className="pl-0 pr-0 bg-white text-right">
                  <StatsToggle
                    toggle={this.toggle}
                    isOpen={isOpen}
                    path={match.url} />
                </Col>
              </Row>
              <Collapse
                isOpen={isOpen}
                className="row pl-3 pr-3 pb-3 bg-light text-dark small">
                {isOpen &&
                 <StatisticsPanel data={data} />
                }
              </Collapse>
            </>
        );
    }
}
