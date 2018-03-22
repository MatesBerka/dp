// @flow
/**
 * @description Custom Flow types used across the application to make type checking easier.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export type trnsType = {scaleX: number, translateX: number, scaleY: number, translateY: number};

export type vec4 = [number, number, number, number];

export type vec3 = [number, number, number];

export type vec2 = [number, number];

export type vec1 = [number];

export type vecN = vec3 | vec2 | vec4 | vec1 | [];

export type det3x3 = [[number, number, number], [number, number, number], [number, number, number]];

export type vertices = Array<[number, number, number]>;

export type imagesType = Array<Array<Array<[number, number]>>>;

export  type reconstructionType =  Array<Array<[number, number, number]>>;

export type cameraType = {
    location: vec3;
    direction: vec3;
    right: vec3;
    up: vec3;
    aspect: number;
    color: vec3
};

export type camerasType = Array<cameraType>;

type eyeType = {
    location: vec3,
    direction: vec3,
    right: vec3,
    up: vec3,
    aspect: number,
    color: vec3
};

export type eyesType = [eyeType, eyeType];

export type displayType = {
    center: vec3,
    right: vec3,
    up: vec3,
    aspect: number
};

export type ruler = Array<number>;
export type rulers = [Array<number>, Array<number>];