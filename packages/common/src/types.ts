export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepReadonly<T> = T extends Set<infer R>
    ? ReadonlySet<DeepReadonly<R>>
    : T extends Map<infer R, infer Y>
    ? ReadonlyMap<R, DeepReadonly<Y>>
    : T extends (infer R)[]
    ? DeepReadonlyArray<R>
    : // eslint-disable-next-line
    T extends Function
    ? T
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

export const deepFreeze = <T>(val: T): DeepReadonly<T> => val as DeepReadonly<T>;

export type NonFunction = object | string | number | boolean | null | undefined;
