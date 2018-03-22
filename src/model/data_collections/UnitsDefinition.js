/**
 * @description Available unit types.
 * @author Matej Berka <matejb@students.zcu.cz>
 */

export const unitIdx = {
    x10m: 0,
    m: 1,
    dm: 2,
    cm: 3,
    mm: 4,
    x10pct: 5,
    pct: 6,
    deg: 7
};

export const unitDefinition = [
    {index: 0, value: 10, name: "x10 m"},
    {index: 1, value: 1, name: "m"},
    {index: 2, value: 0.1, name: "dm"},
    {index: 3, value: 0.01, name: "cm"},
    {index: 4, value: 0.001, name: "mm"},
    {index: 0, value: 0.1, name: "x10%"},
    {index: 1, value: 0.01, name: "%"},
    {index: 0, value: 1, name: "&deg;"}
];
// export const percUnitDefinition = [
//     {index: 0, value: 0.1, name: "x10%"},
//     {index: 1, value: 0.01, name: "%"},
// ];
// export const degUnitDefinition = [
//     {index: 0, value: 1, name: "&deg;"}
// ];

export const unitDefinitionMenu = [
    {key: 0, value: 0, text: "x10 m"},
    {key: 1, value: 1, text: "m"},
    {key: 2, value: 2, text: "dm"},
    {key: 3, value: 3, text: "cm"},
    {key: 4, value: 4, text: "mm"},
];
export const percUnitDefinitionMenu = [
    {key: 5, value: 5, text: "x10%"},
    {key: 6, value: 6, text: "%"},
];
export const degUnitDefinitionMenu = [
    {key: 7, value: 7, text: "&deg;"}
];