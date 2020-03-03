/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */


export const extractUnits = (units) => {
    const newUnits = [];
    units.map((value) => {
        Object.values(value)[0].units.map((value) => {
            newUnits.push(value);
        });
    });
    return newUnits;
};


export const reduceUnits = (state, data) => {
    let {end=0, start=0, units: current=[]} = state || {};
    const {units} = data;
    const newUnits = extractUnits(units);
    let unitResult;
    if (data.start > end || start > data.end) {
        // not contiguous
        unitResult = newUnits;
        start = data.start;
        end = data.end;
    } else {
        if (data.start < start) {
            // overlapping ?
            if (data.end > start) {
                unitResult = [...newUnits.slice(0, start), ...current];
            } else {
                unitResult = [...newUnits, ...current];
            }
            start = data.start;
        } else {
            end = data.end || 0;
            unitResult = [...current, ...newUnits];
        }
    }
    return {units: unitResult, start, end};
};
