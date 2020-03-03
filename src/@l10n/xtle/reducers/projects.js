/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */


export const reduceProjects = (data, __schema__) => {
    const {"xtle.admin.projects": projects} = data;
    const _projects = [];

    for (let project of projects || []) {
        const item = {};
        let i = 0;
        for (let schema of __schema__["xtle.admin.projects"]) {
            item[schema] = project[i];
            i++;
        }
        _projects.push(item);
    }
    return {"xtle.admin.projects": _projects};
};
