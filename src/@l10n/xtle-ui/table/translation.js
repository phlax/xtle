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
    injectIntl,
    FormattedMessage, FormattedNumber} from "react-intl";

import {
    Badge,
    Progress
} from "reactstrap";

import {Link} from "@chango/ui";

import {Table} from "@phlax/react-checkbox-table";


function TranslationProgressBase({fuzzy, translated}) {
    return (
        <Progress multi style={{width: "100%", height: "8px", background: "#ccc"}}>
          <Progress bar color="success" value={translated} />
          <Progress bar color="warning" value={fuzzy} />
        </Progress>);
}


TranslationProgressBase.propTypes = exact({
    fuzzy: PropTypes.number.isRequired,
    translated: PropTypes.number.isRequired,
});


function Value({color, value, url}) {
    if (value === 0) {
        return "";
    } else if (!url) {
        return (
            <Badge color={color} pill className="opacity-3">
              <FormattedNumber
                value={value} />
            </Badge>
        );
    }
    return (
        <Link to={url}>
          <Badge color={color} pill>
            <FormattedNumber
              value={value} />
          </Badge>
        </Link>);
}


Value.propTypes = exact({
    color: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    url: PropTypes.string,
});


let memoize = fn => {
    let cache = {};
    return (...args) => {
        let stringifiedArgs = JSON.stringify(args);
        if (Object.keys(cache).indexOf(stringifiedArgs) === -1) {
            cache[stringifiedArgs] = fn(...args);
        }
        return cache[stringifiedArgs];
  };
};


// sketchy memoization 8/
const TD = memoize(Value);
const TranslationProgress = memoize(TranslationProgressBase);


export class BaseTranslationTable extends React.PureComponent {
    static propTypes = exact({
        getName: PropTypes.func,
        getPath: PropTypes.func,
        intl: PropTypes.object.isRequired,
        items: PropTypes.array,
        totals:  PropTypes.object,
    });

    columns = [
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.name"
                      defaultMessage="Name" />);
            },
            sortType: "basic",
            accessor: "name",
            Cell: (data) => {
                const cell = data.data[data.cell.row.id];
                const name = this.props.getName ? this.props.getName(cell): cell.name;
                return (
                    <Link to={cell.url}>
                      {name}
                    </Link>);
            },
        },
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.progress"
                      defaultMessage="Progress" />);
            },
            sortType: "basic",
            accessor: "translated_percent",
            className: "foo",
            Cell: (data) => {
                const cell = data.data[data.cell.row.id];
                return (
                    <TranslationProgress
                      fuzzy={Math.round(cell.fuzzy_percent)}
                      translated={Math.round(cell.translated_percent)}
                    />);
            },
        },
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.activity"
                      defaultMessage="Activity" />);
            },
            accessor: "activity",
            Cell: () => {
                return "";
                // return <Link to={"/user/" + data.cell.value.user}>{data.cell.value.user}</Link>;
            },
        },
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.critical"
                      defaultMessage="Critical" />);
            },
            sortType: "basic",
            accessor: "critical",
            Cell: (data) => {
                const cell = data.data[data.cell.row.id];
                if (cell.critical === 0) {
                    return "";
                } else if (!cell.translate_url) {
                    return (
                        <FormattedNumber
                          value={cell.critical} />);
                }
                return (
                    <Link to={cell.translate_url}>
                      <FormattedNumber
                        value={cell.critical} />
                    </Link>);
            },
        },
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.suggestions"
                      defaultMessage="Suggestions" />);
            },
            sortType: "basic",
            accessor: "suggestions",
            Cell: (data) => {
                const cell = data.data[data.cell.row.id];
                if (cell.suggestions === 0) {
                    return "";
                } else if (!cell.translate_url) {
                    return (
                        <FormattedNumber
                          value={cell.suggestions} />);
                }
                return (
                    <Link to={cell.translate_url}>
                      <FormattedNumber
                        value={cell.suggestions} />
                    </Link>);
            },
        },
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.incomplete"
                      defaultMessage="Incomplete" />);
            },
            sortType: "basic",
            accessor: "incomplete",
            Cell: (data) => {
                const cell = data.data[data.cell.row.id];
                return (
                    <TD
                      color={cell.incomplete > 0 ? "primary" : ""}
                      translate_url={cell.incomplete > 0 ? cell.translate_url : ""}
                      value={cell.incomplete}
                    />);
            },
        },
        {
            Header: () => {
                return (
                    <FormattedMessage
                      id="table.header.total"
                      defaultMessage="Total" />);
            },
            sortType: "basic",
            accessor: "total",
            Cell: (data) => {
                const cell = data.data[data.cell.row.id];
                return (
                    <TD
                      color={cell.total > 0 ? "link" : ""}
                      translate_url={cell.total > 0 ? cell.translate_url : ""}
                      value={cell.total}
                    />);
            },
        },
    ];

    render () {
        let {columns} = this;
        const {items, totals} = this.props;

        if (Object.keys(totals || {}).length === 0) {
            return "";
        }
        const remove = [];
        for (let total of ["critical", "suggestions", "incomplete"]) {
            if (!totals[total] > 0) {
                remove.push(total);
            }
        }
        if (remove.length > 0) {
            columns = columns.filter(c => remove.indexOf(c.accessor) === -1);
        }
        return (
            <div className="px-2 mt-2">
              <Table
                data={items || []}
                columns={columns} />
            </div>
        );
    }
}

export const TranslationTable = injectIntl(BaseTranslationTable);
