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

import {Button, Col, Row} from "reactstrap";

import ChannelsUI from "@chango/ui";
import {Search} from "@chango/ui";

import {AdminPage} from "./page";

import CheckboxTable from "@phlax/react-checkbox-table";


export class BaseAdmin extends React.Component {
    static contextType = ChannelsUI.Context;
    static propTypes = exact({
        searchAPI: PropTypes.string.isRequired,
        deleteAPI: PropTypes.string.isRequired,
        addMessage: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        match: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        store: PropTypes.string.isRequired,
        deleteLabel: PropTypes.string.isRequired
    });

    state = {selected: null};

    onSearch = async (e) => {
        const {searchAPI, match} = this.props;
        const path = match.path + "/?search=" + e.target.value;
        this.context.history.push(path);
        this.context.call(searchAPI, {search: e.target.value});
    };

    onChange = (selected) => {
        this.setState({selected});
    };

    handleDelete = async () => {
        const {selected} = this.state;
        const {deleteAPI, match} = this.props;
        const {errors} = await this.context.call(deleteAPI, {params: {items: [...selected]}});
        if (!errors) {
            this.context.send({route: match.url});
        }
    };

    get items () {
        const {store} = this.props;
        const {getData} = this.context;
        return getData(store) || [];
    }

    render () {
        const {
            addMessage, data, match,
            title, deleteLabel} = this.props;
        return (
            <AdminPage data={data} match={match}>
              <h3>{title}</h3>
              <Row>
                <Col className="p-3">
                  <Search onChange={this.onSearch} />
                </Col>
                <Col className="p-3">
                  <Button color="primary">{addMessage}</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <CheckboxTable
                    data={this.items}
                    onChange={this.onChange}
                    columns={this.context.getColumns(["name"])} />
                  <Button onClick={this.handleDelete}>
                    {deleteLabel}
                  </Button>
                </Col>
              </Row>
            </AdminPage>
        );
    }
}
