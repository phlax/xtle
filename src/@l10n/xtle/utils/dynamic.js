/*
 * Copyright (C) XTLE contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from "react";
import PropTypes from "prop-types";


export class DynamicImport extends React.Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
        load: PropTypes.func.isRequired
    };

    state = {
        component: null
    };

    async componentDidMount () {
        const {load} = this.props;
        const module = await load();
        this.setState(() => ({
            component: module.default ? module.default : module
        }));
    }
    render() {
        const {children} = this.props;
        const {component} = this.state;
        return children(component);
  }
}


export const dynamic = (imported, component, loading) => {
    const importer = (props) => {
        return (
            <DynamicImport load={imported}>
              {(Module) => {
                  let Component = component && Module ? Module[component] : Module;
                  return (Component === null
                          ? loading || ""
                          : <Component {...props} />);
              }}
            </DynamicImport>);
    };
    importer.displayName = "DynamicImporter (" + component + ")";
    return importer;
};
