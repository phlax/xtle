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

import {Col} from "reactstrap";

import {Contributors} from "./contributors";
import {LatestTranslation} from "./latest";
import {Checks} from "./checks";
import {Translation} from "./translation";


export class StatisticsPanel extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
    });

    render () {
        const {data} = this.props;
        const {checks, contributors, totals} = data;
        return (
            <>
              <Col xs={6} className="bg-white pb-3">
                <Translation
                  totals={totals} />
                <Checks
                  checks={checks} />
                <LatestTranslation />
              </Col>
              <Col xs={6} className="bg-white pb-3">
                <Contributors
                  contributors={contributors} />
              </Col>
            </>
        );
    }
}
