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

import {Link} from "@chango/ui";

import {Row, Col} from "reactstrap";
import {Body} from "@l10n/xtle-ui/body";


export class Welcome extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    get languageData () {
        const {data} = this.props;
        const result = [];
        if (!data || !data.site_languages) {
            return [];
        }
        for (let child of data.language_activity || []) {
            result.push({
                url: "/",
                code: child[0],
                name: child[1],
                activity: "foo",
                totalWords: child[2],
                critical: child[3],
                fuzzy: child[4],
                progress: 23});
        }
        return result;
    }

    get projectData () {
        const {data} = this.props;
        const result = [];
        if (!data) {
            return [];
        }
        for (let child of data.project_activity || []) {
            result.push({
                url: "/",
                code: child[0],
                name: child[1],
                activity: "foo",
                total: child[2],
                critical: child[3],
                fuzzy: child[4],
                progress: 23});
        }
        return result;
    }


    render () {
        return (
            <Body>
              <Row className="welcome-content">
                <Col xs={6}>
                  <div className="m-2 p-2 bg-gradient-light">Intro text</div>
                  <div className="m-2 p-2 bg-gradient-light">
                    Languages
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="m-2 p-2 bg-gradient-light">
                    <Link to="/projects/">Projects</Link>
                  </div>
                  <div className="m-2 p-2 bg-gradient-light">Contributors</div>
                </Col>
              </Row>
            </Body>
        );
    }
}
