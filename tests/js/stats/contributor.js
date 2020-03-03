
import React from "react";
import {FormattedMessage, FormattedNumber} from "react-intl";

import {shallow} from "enzyme";

import {UserAvatar} from "@chango/ui";
import {
    ContributorSummary,
    ContributorsSummary} from "@l10n/xtle-ui/stats/contributors";


test("ContributorsSummary render", () => {
    const contributors = [
        {md5: "MD5", username: "USERNAME", score: 7},
        {md5: "MD52", username: "USERNAME2", score: 72}];
    const summary = shallow(
        <ContributorsSummary
          contributors={contributors} />);
    // 2nd child is an array
    expect(summary.props().children.length).toEqual(2);
    expect(summary.props().children[1].length).toEqual(2);

    const prefix = summary.childAt(0);
    expect(prefix.type()).toEqual("span");
    expect(prefix.props().className).toEqual("text-black-50");
    const msg = prefix.childAt(0);
    expect(msg.type()).toBe(FormattedMessage);
    expect(msg.props()).toEqual(
        {"defaultMessage": "Top contributors:",
         "id": "control.stats.contributors.top",
         "values": {}});

    const contrib1 = summary.childAt(1);
    expect(contrib1.type()).toBe(ContributorSummary);
    expect(contrib1.props()).toEqual(
        {"md5": "MD5",
         "rank": 0,
         "score": 7,
         "username": "USERNAME"});

    const contrib2 = summary.childAt(2);
    expect(contrib2.type()).toBe(ContributorSummary);
    expect(contrib2.props()).toEqual(
        {"md5": "MD52",
         "rank": 1,
         "score": 72,
         "username": "USERNAME2"});
});


test("ContributorSummary render", () => {
    const summary = shallow(
        <ContributorSummary
          rank={3}
          score={42}
          username="USERNAME"
          md5="MD5" />);
    expect(summary.type()).toEqual("span");
    expect(summary.props().className).toEqual(
        "pl-4 d-inline-block");
    const rank = summary.childAt(0);
    expect(rank.type()).toEqual("small");
    const rankMsg = rank.childAt(0);
    expect(rankMsg.type()).toBe(FormattedNumber);
    expect(rankMsg.props()).toEqual(
        {"style": "ordinal", "value": 3});

    const avatar = summary.childAt(2);
    expect(avatar.props()).toEqual(
        {"md5": "MD5",
	 "url": "/users/USERNAME",
	 "username": "USERNAME"});
    expect(avatar.type()).toBe(UserAvatar);

    const score = summary.childAt(4);
    expect(score.type()).toEqual("small");
    const scoreMsg = score.childAt(0);
    expect(scoreMsg.type()).toBe(FormattedNumber);
    expect(scoreMsg.props()).toEqual(
        {"value": 42});

});
