/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import {strip} from "./strip";


export function splitPath (path) {
    let parts = strip.strip(path, "/").split("/");
    let language = parts[0] !== "projects" ? parts[0] : "";
    let project = parts.length > 1 ? parts[1] : "";
    let translate = parts.length > 2 && parts[2] === "translate";
    let filename = !path.endsWith("/") ? parts.pop() : "";
    let dir = parts.slice(translate ? 3 : 2).join("/");
    return {language, project, dir, filename, translate};
}


export function getUserURL (username) {
    return "/users/" + username;
}


export function getTranslateURL (path) {
    return updatePath(path, {translate: true});
}


export function getBrowseURL (path) {
    return updatePath(path, {translate: false});
}


export function joinPath (parts) {
    const result = [""];
    if (!parts.language) {
        result.push("projects");
    } else {
        result.push(parts.language);
    }
    if (parts.project) {
        result.push(parts.project);
    }
    if (parts.translate) {
        result.push("translate");
    }
    if (parts.dir) {
        result.push(parts.dir);
    }
    if (parts.filename) {
        result.push(parts.filename);
    } else {
        result.push("");
    }
    return result.join("/");
}


export const updatePath = (path, update) => {
    return joinPath({...splitPath(path), ...update});
};



export function splitAdminPath (path) {
    let parts = strip.strip(path, "/").split("/");
    let domain = parts[1];
    let action = parts.length > 2 && parts[2] === "add";
    let extra = parts.slice(action ? 3 : 2).join("/");
    return {domain, action, extra};
}


export function joinAdminPath (parts) {
    const result = ["", "admin"];
    if (parts.domain) {
        result.push(parts.domain);
    }
    if (parts.action) {
        result.push(parts.action);
    }
    if (parts.extra) {
        result.push(parts.extra);
    }
    result.push("");
    return result.join("/");
}
