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

import {Progress} from "reactstrap";


export class ProgressBar extends React.PureComponent {
    static propTypes = exact({
        items: PropTypes.array.isRequired,
    });

    render () {
        const {items} = this.props;
        return (
            <Progress
              multi
              className="xtle-progress">
              {items.map(([color, value], key) => {
                  return (
                      <Progress
                        key={key}
                        bar
                        color={color}
                        value={value} />
                  );
              })}
            </Progress>
        );
    }
}
