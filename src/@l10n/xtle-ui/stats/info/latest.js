/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import exact from "prop-types-exact";
import {FormattedMessage} from "react-intl";

import {UserAvatar} from "@chango/ui";

import {getUserURL} from "@l10n/xtle/utils/path";


export class LatestTranslation extends React.PureComponent {
    static propTypes = exact({});

    render () {
        const action = "marked as needs work";
        const unit = ["ID", "some unit content"];
        const time = "1 hour";
        return (
            <>
              <h4 className="text-black-50">
                <FormattedMessage
                  id="stats.translations.latest"
                  defaultMessage="Translations" />
              </h4>
              <div className="mb-3 bg-light py-2 px-3">
                <FormattedMessage
                  id="stats.translations.lastaction"
                  defaultMessage="Last action" />
                <UserAvatar
                  url={getUserURL("foo")}
                  username="foo"
                  md5="ryan@3ca.org.uk" />
                {action}
                {unit[1]}
                {time}
              </div>
            </>
        );
    }
}
