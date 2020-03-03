/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import exact from "prop-types-exact";

import ChannelsUI from "@chango/ui";
import {Link} from "@chango/ui";

import {ReactComponent as SiteIcon} from "./resources/icon.svg";


export default class Logos extends React.PureComponent {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
    });

    render () {
        const title = this.context.getState("title");
        return (
            <>
              <Link className="img-logo" to="/">
                <SiteIcon viewBox="-20 -10 70 60"  />
              </Link>
              <Link className="font-lg p-3 font-weight-bold" to="/">
                <span>
                  {title}
                </span>
              </Link>
            </>);
    }
}
