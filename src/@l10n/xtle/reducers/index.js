/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import {reduceData} from "./data";

export {extractUnits, reduceUnits} from "./units";
export {reduceChildren} from "./children";
export {reduceData};


export const dataReducer = (state=null, action) => {

    switch (action.type) {
    case "SET_DATA":
        return reduceData(state, action);
    case "UPDATE_DATA":
        return {...state || {}, ...reduceData(state, action)};
    default:
        return state;
    }
};
