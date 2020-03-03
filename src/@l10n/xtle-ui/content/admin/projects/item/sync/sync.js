/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import {defineMessages, injectIntl} from "react-intl";

import {Form} from "reactstrap";

import {FormErrors, FormGroups} from "@chango/ui";


const translation = defineMessages({
    policyName: {
        id: "admin.project.sync.policy.select",
        defaultMessage: "Select a synchronization policy"
    },
    policyManual: {
        id: "admin.project.sync.policy.manual",
        defaultMessage: "Manually synchronize the repository"
    },
    policyNotifyOnConflict: {
        id: "admin.project.sync.policy.notify",
        defaultMessage: "Automatically synchronize the repository, notify on conflict"
    },
    policyXTLEWinsOnConflict: {
        id: "admin.project.sync.policy.xtle_wins",
        defaultMessage: "Automatically synchronize the repository, XTLE wins on conflict"
    },
    policyFSWinsOnConflict: {
        id: "admin.project.sync.policy.fs_wins",
        defaultMessage: "Automatically synchronize the repository, FS wins on conflict"
    },
    frequency: {
        id: "admin.project.sync.frequency",
        defaultMessage: "Synchronization frequency"
    },
    frequencyHourly: {
        id: "admin.project.sync.frequency.hourly",
        defaultMessage: "Hourly"
    },
    frequencyDaily: {
        id: "admin.project.sync.frequency.daily",
        defaultMessage: "Daily"
    },
    frequencyWeekly: {
        id: "admin.project.sync.frequency.weekly",
        defaultMessage: "Weekly"
    },
});


export {translation};


export class BaseProjectSyncFieldset extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
        onSubmit: PropTypes.func,
    });

    state = {name: null};

    onChange = (e) => {
        const {name, value} = e.target;
        const state = {};
        state[name] = value;
        this.setState(state);
    };

    get policyOptions () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            formatMessage(translation.policyManual),
            formatMessage(translation.policyNotifyOnConflict),
            formatMessage(translation.policyXTLEWinsOnConflict),
            formatMessage(translation.policyFSWinsOnConflict)];
    }

    get frequencyOptions () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            formatMessage(translation.frequencyHourly),
            formatMessage(translation.frequencyDaily),
            formatMessage(translation.frequencyWeekly)];
    }

    get fields () {
        const {intl} = this.props;
        const {formatMessage} = intl;
        return [
            {name: "name",
             type: "select",
             options: this.policyOptions,
             label: formatMessage(translation.policyName),
             onChange: this.onChange},
            {name: "name",
             type: "select",
             options: this.frequencyOptions,
             label: formatMessage(translation.frequency),
             onChange: this.onChange},
        ];
    }

    render () {
        const {errors} = this.state;
        const {onSubmit} = this.props;
        return (
            <Form onSubmit={onSubmit}>
              <FormErrors
                errors={errors || []}
                messages={this.errorMessages || {}} />
              <FormGroups
                col={3}
                fields={this.fields} />
            </Form>
        );
    }

}


export const ProjectSyncFieldset = injectIntl(BaseProjectSyncFieldset);
