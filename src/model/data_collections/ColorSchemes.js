/**
 * @description Color schemes.
 * @author Matej Berka <matejb@students.zcu.cz>
 */

export const colorSchemeIdx = {
    redCyan: 0,
    greenMagenta: 1,
    amberBlue: 2,
    redGreen: 3,
    redBlue: 4,
    yellowBlue: 5
};

export const colorSchemeMenu = [
    { key: 0, value: 0, text: 'Red-Cyan' },
    { key: 1, value: 1, text: 'Green-Magenta' },
    { key: 2, value: 2, text: 'Amber-Blue' },
    { key: 3, value: 3, text: 'Red-Green' },
    { key: 4, value: 4, text: 'Red-Blue' },
    { key: 5, value: 5, text: 'Yellow-Blue' }
];

export const colorScheme = [
    [[1, 0, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 0, 1]],
    [[0.6, 0.5, 0], [0, 0, 1]],
    [[1, 0, 0], [0, 1, 0]],
    [[1, 0, 0], [0, 0, 1]],
    [[1, 1, 0], [0, 0, 1]]
];