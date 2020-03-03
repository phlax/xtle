/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import {joinPath, splitPath} from "@l10n/xtle/utils";


export const reduceChildren = (data, route, __schema__) => {
    const aggregates = ["total", "suggestions", "critical", "translated", "fuzzy"];
    const totals = {total: 0, suggestions: 0, critical: 0, translated: 0, fuzzy: 0};
    const children = [];

    for (let child of data.children || []) {
        const item = {};
        let i = 0;
        for (let schema of __schema__.children) {
            item[schema] = child[i];
            if (aggregates.indexOf(schema) !== -1) {
                totals[schema] += child[i];
            }
            i++;
        }
        item["translated_percent"] = (
            item["translated"] > 0
                ? item["translated"] / item["total"] * 100
                : 0);
        item["fuzzy_percent"] = (
            item["fuzzy"] > 0
                ? item["fuzzy"] / item["total"] * 100
                : 0);
        item["incomplete"] = item.total - item.fuzzy - item.translated;

        const parts = splitPath(route);

        if (parts.language && parts.project) {
            if (item.dir) {
                parts.dir = item.code;
            } else {
                parts.filename = item.code;
            }
        } else if (parts.project) {
            parts.language = item.code;
        } else {
            parts.project = item.code;
        }
        item["url"] = joinPath(parts);
        if (parts.project && parts.language) {
            parts.translate = true;
            item["translate_url"] = joinPath(parts);
        }
        children.push(item);
    }
    totals["incomplete"] = (
        totals["total"]
            - totals["fuzzy"]
            - totals["translated"]);
    return {children, totals};
};
