
import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import {defineMessages, injectIntl} from "react-intl";

import {BaseAdmin} from "../../base";


const translation = defineMessages({
    title: {
        id: "admin.project.title",
        defaultMessage: "Project admin"
    },
    add: {
        id: "admin.project.add",
        defaultMessage: "Add a new project"
    },
    delete: {
        id: "admin.project.delete",
        defaultMessage: "Delete selected projects"
    },
});


export {translation};


export class BaseProjectsAdmin extends React.PureComponent {
    static propTypes = exact({
        data: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    });

    searchAPI = "xtle.admin.projects";
    deleteAPI = "xtle.admin.projects.delete";
    store = "xtle.admin.projects";

    render () {
        const {intl, ...props} = this.props;
        const {formatMessage} = intl;
        return (
            <BaseAdmin
              store={this.store}
              searchAPI={this.searchAPI}
              deleteAPI={this.deleteAPI}
              title={formatMessage(translation.title)}
              addMessage={formatMessage(translation.add)}
              deleteLabel={formatMessage(translation.delete)}
              {...props} />);
    }
}


export const ProjectsAdmin = injectIntl(BaseProjectsAdmin);
