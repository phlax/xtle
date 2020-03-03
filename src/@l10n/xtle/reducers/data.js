/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import {reduceChildren} from "./children";
import {reduceUnits} from "./units";
import {reduceChecks} from "./checks";
import {reduceContributors} from "./contributors";
import {reduceProjects} from "./projects";
import {reduceTeams} from "./teams";
import {reduceLanguages} from "./languages";


export const reduceData = (state, action) => {
    const {__schema__, ...data} = action.data;
    let children = {};
    if (Object.keys(data).indexOf("children") !== -1) {
        children = reduceChildren(data, action.route, __schema__);
    }
    let units = {};
    if (Object.keys(data).indexOf("units") !== -1) {
        units = reduceUnits(state, data);
    }
    let contributors = {};
    if (Object.keys(data).indexOf("contributors") !== -1) {
	contributors = reduceContributors(data, __schema__);
    }
    let checks = {};
    if (Object.keys(data).indexOf("checks") !== -1) {
	checks = reduceChecks(data, __schema__);
    }
    let projects = {};
    if (Object.keys(data).indexOf("xtle.admin.projects") !== -1) {
	projects = reduceProjects(data, __schema__);
    }
    let teams = {};
    if (Object.keys(data).indexOf("xtle.admin.teams") !== -1) {
	teams = reduceTeams(data, __schema__);
    }
    let languages = {};
    if (Object.keys(data).indexOf("xtle.admin.languages") !== -1) {
	languages = reduceLanguages(data, action.settings, __schema__);
    }
    return {
	...data,
	...checks,
	...contributors,
	...children,
	...projects,
	...languages,
	...teams,
	...units};
};
