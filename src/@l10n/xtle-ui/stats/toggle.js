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

import {Button} from "reactstrap";

import {APILink} from "@chango/ui";

import {Icon} from "@chango/ui";


export class StatsToggle extends React.PureComponent {
    static propTypes = exact({
        path: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired
    });
    api = "xtle.stats";

    render () {
        const {isOpen, path, toggle} = this.props;
        if (!isOpen) {
            return (
                <APILink
                  api={this.api}
                  params={{path}}
                  onResponse={toggle}>
                  <Button
                    tag="span"
                    className="btn-sm btn-link"
                    color="white">
                    <Icon name="expand-stats" />
                  </Button>
                </APILink>);
        }
        return (
            <Button
              tag="span"
              onClick={toggle}
              className="btn-sm btn-link"
              color="white">
              <Icon name="collapse-stats" />
            </Button>);
    }
}
