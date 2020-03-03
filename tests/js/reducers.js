
import Reducers from "@l10n/xtle/reducers";
import UnitReducers from "@l10n/xtle/reducers/units";
import DataReducers from "@l10n/xtle/reducers/data";
import {
    dataReducer, extractUnits,
    reduceUnits, reduceData} from "@l10n/xtle/reducers";


const unitTests = [
    ["none",
     undefined,
     {units: "UNITS"},
     {start: 0, end: 0, units: ["NEW UNITS"]}],
    ["first20",
     undefined,
     {units: "UNITS", start: 0, end: 20},
     {start: 0, end: 20, units: ["NEW UNITS"]}],
    ["next20",
     {units: ["OLD UNITS"], start: 0, end: 20},
     {units: "UNITS", start: 20, end: 40},
     {start: 0, end: 40, units: ["OLD UNITS", "NEW UNITS"]}],
    ["jumpForward",
     {units: ["OLD UNITS"], start: 0, end: 20},
     {units: "UNITS", start: 100, end: 120},
     {start: 100, end: 120, units: ["NEW UNITS"]}],
    ["previous20",
     {units: ["OLD UNITS"], start: 100, end: 120},
     {units: "UNITS", start: 80, end: 100},
     {start: 80, end: 120, units: ["NEW UNITS", "OLD UNITS"]}],
    ["jumpBack",
     {units: ["OLD UNITS"], start: 100, end: 120},
     {units: "UNITS", start: 40, end: 60},
     {start: 40, end: 60, units: ["NEW UNITS"]}],
]


test.each(unitTests)(
    "reducers.reduceUnits %s",
    (name, state, data, expected) => {
        const extractUnits = jest.fn(() => ["NEW UNITS"]);
        UnitReducers.__Rewire__("extractUnits", extractUnits);
        const result = reduceUnits(state, data);
        expect(extractUnits.mock.calls).toEqual([["UNITS"]])
        expect(result).toEqual(expected);
    });


test("reducers.reduceUnits jumpBack firstFew", () => {
    const extractUnits = jest.fn(() => ({slice}));
    UnitReducers.__Rewire__("extractUnits", extractUnits);
    const slice = jest.fn(() => ["SLICED UNITS"]);
    const result = reduceUnits(
        {units: ["OLD UNITS"], start: 10, end: 30},
        {units: "UNITS", start: 0, end: 20});
    expect(extractUnits.mock.calls).toEqual([["UNITS"]]);
    expect(result).toEqual(
        {start: 0,
         end: 30,
         units: ["SLICED UNITS", "OLD UNITS"]});
    expect(slice.mock.calls).toEqual([[0, 10]]);
});


const dataTests = [
    ["none",
     {units: "REDUCED UNITS"},
     {children: "REDUCED CHILDREN"},
     {foo: "BAR"},
     {route: "ROUTE", data: {__schema__: "SCHEMA", other: "OTHER"}},
     {other: "OTHER"},
     [],
     []],
    ["children",
     {units: "REDUCED UNITS"},
     {children: "REDUCED CHILDREN"},
     {foo: "BAR"},
     {route: "ROUTE", data: {children: "CHILDREN", __schema__: "SCHEMA", other: "OTHER"}},
     {children: "REDUCED CHILDREN", other: "OTHER"},
     [],
     [[{children: "CHILDREN", other: "OTHER"}, "ROUTE", "SCHEMA"]]],
    ["units",
     {units: "REDUCED UNITS"},
     {children: "REDUCED CHILDREN"},
     {foo: "BAR"},
     {route: "ROUTE", data: {units: "UNITS", __schema__: "SCHEMA", other: "OTHER"}},
     {units: "REDUCED UNITS", other: "OTHER"},
     [[{foo: "BAR"}, {units: "UNITS", other: "OTHER"}]],
     []],
]


test.each(dataTests)(
    "reducers.reduceData %s",
    (name, units, children, state, action, expected, unitCalls, childrenCalls) => {
	const reduceUnits = jest.fn(() => units);
	DataReducers.__Rewire__("reduceUnits", reduceUnits);
	const reduceChildren = jest.fn(() => children);
	DataReducers.__Rewire__("reduceChildren", reduceChildren);
	const result = reduceData(state, action);
	expect(result).toEqual(expected)
	expect(reduceUnits.mock.calls).toEqual(unitCalls);
	expect(reduceChildren.mock.calls).toEqual(childrenCalls);
	reduceUnits.mockClear();
	reduceChildren.mockClear();
});


const dataReducerTests = [
    ["nostate",
     undefined,
     {},
     null,
     []],
    ["SET_DATA",
     undefined,
     {type: "SET_DATA", foo: "BAR"},
     {reduced: "REDUCED"},
     [[null, {type: "SET_DATA", foo: "BAR"}]]],
    ["SET_DATA update",
     {existing: "DATA"},
     {type: "SET_DATA", foo: "BAR"},
     {reduced: "REDUCED"},
     [[{existing: "DATA"},
       {type: "SET_DATA", foo: "BAR"}]]],
    ["UPDATE_DATA",
     undefined,
     {type: "UPDATE_DATA", foo: "BAR"},
     {reduced: "REDUCED"},
     [[null, {type: "UPDATE_DATA", foo: "BAR"}]]],
    ["UPDATE_DATA update",
     {existing: "DATA"},
     {type: "UPDATE_DATA", foo: "BAR"},
     {existing: "DATA", reduced: "REDUCED"},
     [[{existing: "DATA"},
       {type: "UPDATE_DATA", foo: "BAR"}]]],
    ["UPDATE_DATA update existing",
     {reduced: "OLD DATA"},
     {type: "UPDATE_DATA", foo: "BAR"},
     {reduced: "REDUCED"},
     [[{reduced: "OLD DATA"},
       {type: "UPDATE_DATA", foo: "BAR"}]]],
]


test.each(dataReducerTests)(
    "reducers.dataReducer %s",
    (name, state, action, expected, reduceCalls) => {
	const reduceData = jest.fn(() => ({reduced: "REDUCED"}))
	Reducers.__Rewire__("reduceData", reduceData);
	expect(dataReducer(state, action)).toEqual(expected)
	expect(reduceData.mock.calls).toEqual(reduceCalls);
	reduceData.mockClear();
    });
