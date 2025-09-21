import { FetcherMiddleware } from "./middleware";

type FetchInput = Parameters<typeof fetch>[0];
export type FetchOptions = Exclude<Parameters<typeof fetch>[1], undefined>;

export type FetcherArgs = [
    FetchInput,
    Omit<FetchOptions, 'method' | 'headers'> & {
        headers?:
            | Record<'Content-Type', 'text/html' | 'multipart/form-data' | 'application/json' | undefined>
            | Record<string, string | undefined>;
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    },
];

export type Fetcher = Record<
    'get' | 'post' | 'put' | 'patch' | 'delete',
    (url: FetcherArgs[0], options?: FetcherArgs[1]) => Promise<Response>
> & {
    redirect: (path: FetcherArgs[0], options?: {external?: boolean}) => void;
    clone: () => Fetcher;
    middleware: {
        add: (middleware: FetcherMiddleware) => void;
    };
}
