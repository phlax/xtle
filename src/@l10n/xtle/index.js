/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import * as utils from "./utils";
import * as reducers from "./reducers";
import {App} from "./app";
import {columns} from "./columns";


const XTLE = {columns, reducers, utils, App};

export {App, columns};
export default XTLE;
