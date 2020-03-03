/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */


export const reduceChecks = (data, __schema__) => {
    const {checks} = data;
    const _checks = [];

    for (let check of checks || []) {
        const item = {};
        let i = 0;
        for (let schema of __schema__.checks) {
            item[schema] = check[i];
            i++;
        }
        _checks.push(item);
    }
    return {checks: _checks};
};
