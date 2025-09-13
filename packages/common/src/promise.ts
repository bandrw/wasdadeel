import { wait } from "./tools";

/**
 * Executes a pool of asynchronous functions while limiting the concurrency to a specified number.
 * @returns an array of results
 */
const $promisePool = async <T>(
    functions: (() => Promise<T>)[],
    limit: number,
    {
        onProgress,
    }: {
        onProgress?: (options: {totalTasks: number; finishedTasks: number; remainingTasks: number; finishedPercent: number; remainingPercent: number}) => void;
    } = {},
): Promise<T[]> => {
    const context = {
        count: 0,
    };
    const res: (T | undefined)[] = functions.map(() => undefined);

    let n = limit;
    const handleData = async (data: T, idx: number): Promise<void> => {
        context.count++;
        const totalTasks = functions.length;
        const finishedTasks = context.count;
        const remainingTasks = totalTasks - finishedTasks;
        const finishedPercent = Math.floor(finishedTasks / totalTasks * 100);
        const remainingPercent = 100 - finishedPercent;

        onProgress?.({totalTasks, finishedTasks, remainingTasks, finishedPercent, remainingPercent});
        res[idx] = data;
        const getPromise = functions[n];
        const promiseIdx = n;
        n++;
        if (getPromise !== undefined) {
            return getPromise().then((d) => handleData(d, promiseIdx));
        }
        return undefined;
    };

    await Promise.all(functions.slice(0, n).map((it, i) => it().then((data) => handleData(data, i))));
    return res as T[];
};

export const promisePool = async <T>(
    functions: (() => Promise<T>)[],
    limit: number,
    {delayBetween, ...restOptions}: {delayBetween?: number} & Parameters<typeof $promisePool>[2] = {},
) => {
    const context: {
        lastExecutionStart: Date | null;
        aborted: boolean;
    } = {
        lastExecutionStart: null,
        aborted: false,
    };

    const res = $promisePool(
        functions.map((fn) => {
            return async () => {
                if (delayBetween !== undefined && context.lastExecutionStart !== null) {
                    const timeToWait = context.lastExecutionStart.getTime() + delayBetween - new Date().getTime();
                    if (timeToWait > 0) {
                        await wait(timeToWait);
                        if (context.aborted) throw new Error('Aborted');
                    }
                }
                context.lastExecutionStart = new Date();
                return fn();
            };
        }),
        limit,
        restOptions,
    ).catch((e) => {
        context.aborted = true;
        throw e;
    });

    return res;
};
