/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import {Admin} from "./admin";
import {LanguagesAdmin, LanguageAdmin, LanguageAdminAdd} from "./languages";
import {ProjectsAdmin, ProjectAdmin, ProjectAdminAdd} from "./projects";
import {UserAdmin, UsersAdmin, UserAdminAdd} from "./users";
import {TeamAdmin, TeamsAdmin, TeamAdminAdd} from "./teams";


const XTLEAdminUI = {
    Admin,
    LanguagesAdmin, LanguageAdmin, LanguageAdminAdd,
    ProjectsAdmin, ProjectAdmin, ProjectAdminAdd,
    UserAdmin, UsersAdmin, UserAdminAdd,
    TeamAdmin, TeamsAdmin, TeamAdminAdd};

export {
    Admin,
    LanguagesAdmin, LanguageAdmin, LanguageAdminAdd,
    ProjectsAdmin, ProjectAdmin, ProjectAdminAdd,
    UserAdmin, UsersAdmin, UserAdminAdd,
    TeamAdmin, TeamsAdmin, TeamAdminAdd};

export default XTLEAdminUI;
