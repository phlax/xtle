/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import exact from "prop-types-exact";

import {DropdownItem} from "reactstrap";

import ChannelsUI, {Link} from "@chango/ui";


export const AdminMenuItem = (user) => {
    if (!user && !user.is_superuser) {
        return "";
    }
    return (
        <DropdownItem>
          <Link to="/admin/">Admin</Link>
        </DropdownItem>);
};


export default class Menus extends React.PureComponent {
    static propTypes = exact({});

    render () {
        return (
            <>
              <ChannelsUI.menus.ContactMenu />{" "}
              <ChannelsUI.menus.UserMenu>
                {AdminMenuItem}
              </ChannelsUI.menus.UserMenu>
            </>);
    }
}
