import { FetcherArgs } from "./types";

export type FetcherMiddleware = (args: FetcherArgs) => FetcherArgs;

export const createTimeoutMiddleware = ({timeout}: {timeout: number}): FetcherMiddleware => (args) => {
    return [args[0], {...args[1], signal: AbortSignal.timeout(timeout)}];
};
