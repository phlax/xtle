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
import {
    defineMessages, injectIntl} from "react-intl";

import {
    Form,
    Input,
    InputGroupAddon,
    InputGroup,
    InputGroupText,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown
} from "reactstrap";


const translation = defineMessages({
    search: {
        id: "toolbar.search.placeholder",
        defaultMessage: "Search"
    }
});


export class BaseSearch extends React.PureComponent {
    static propTypes = exact({
        intl: PropTypes.object.isRequired,
    });

    onClick = () => {
    };

    render () {
        const {intl} = this.props;
        return (
            <UncontrolledDropdown>
              <DropdownToggle tag="div">
                <Form>
                  <InputGroup>
                    <Input
                      onClick={this.onClick}
                      className="form-control-sm"
                      placeholder={intl.formatMessage(translation.search)} />
                    <InputGroupAddon
                      addonType="append">
                      <InputGroupText
                        className="form-control-sm p-1">
                        <i className="icon icon-search" />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Form>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Header</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}


export const ToolbarSearch = injectIntl(BaseSearch);

export {translation};
