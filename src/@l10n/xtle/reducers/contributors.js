/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */


export const reduceContributors = (data, __schema__) => {
    const {contributors} = data;
    const contribs = [];

    for (let contrib of contributors || []) {
        const item = {};
        let i = 0;
        for (let schema of __schema__.contributors) {
            item[schema] = contrib[i];
            i++;
        }
        contribs.push(item);
    }
    return {contributors: contribs};
};
