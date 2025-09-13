import { DeepReadonly } from "./types";

export const postorderTraversal = <T>(
    root: DeepReadonly<T>,
    childrenAccessor: (node: DeepReadonly<T>) => DeepReadonly<T[]> | undefined,
    callback: (node: DeepReadonly<T>, idx: number, array: DeepReadonly<T[]>) => void,
) => {
    const stack = [root];
    const result: DeepReadonly<T>[] = [];

    while (stack.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = stack.pop()!;

        result.push(item);
        const children = childrenAccessor(item);
        if (children !== undefined) {
            children.forEach((child) => {
                stack.push(child);
            });
        }
    }

    for (let i = result.length - 1; i >= 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = result[i]!;
        callback(item, i, result);
    }
};

export const postorderTraversalSearch = <T, R = T>(
    root: DeepReadonly<T>,
    childrenAccessor: (node: DeepReadonly<T>) => DeepReadonly<T[]> | undefined,
    callback: (node: DeepReadonly<T>) => boolean,
): R | null => {
    const stack = [root];
    const result: DeepReadonly<T>[] = [];

    while (stack.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = stack.pop()!;

        result.push(item);
        const children = childrenAccessor(item);
        if (children !== undefined) {
            children.forEach((child) => {
                stack.push(child);
            });
        }
    }

    for (let i = result.length - 1; i >= 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = result[i]!;
        if (callback(item)) return item as R;
    }

    return null;
};
