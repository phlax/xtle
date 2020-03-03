
import React from "react";

import {shallow} from "enzyme";

import {Admin} from "@l10n/xtle-ui/content/admin";


test("Admin constructor", () => {
    shallow(
        <Admin data={{}} match={{}} />);
});
