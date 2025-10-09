import { createTimeoutMiddleware, FetcherMiddleware } from "./middleware";
import { FetcherTools } from "./tools";
import { Fetcher, FetcherArgs, FetchOptions } from "./types";

type Options = {
    baseUrl?: string;
    fetchImpl?: typeof fetch;
    middleware?: FetcherMiddleware[];
    timeout?: number;
    on?: {
        beforeFetch?: (options: {
            args: FetcherArgs;
        }) => void;
        afterFetch?: (options: {
            response: Response;
            args: FetcherArgs;
        }) => void;
    };
}

// removes undefined values
const buildHeaders = (headers: FetcherArgs[1]['headers']): FetchOptions['headers'] => {
    if (headers === undefined) return undefined;

    return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});
};

export const createFetcher = (fetcherOptions: Options): Fetcher => {
    const context: {
        middleware: FetcherMiddleware[];
    } = {
        middleware: [...fetcherOptions.middleware || []],
    };
    const {
        baseUrl = '',
    } = fetcherOptions;

    const buildUrl: Fetcher['buildUrl'] = (path) => {
        return `${baseUrl}${path}`;
    };

    const fetchFn = async (
        path: FetcherArgs[0],
        options: FetcherArgs[1],
    ) => {
        const url = buildUrl(path);
        const fetchImpl = options.fetchImpl ?? fetcherOptions.fetchImpl ?? fetch;

        options = {...options, headers: {...options.headers}};
        if (typeof options.body === 'string') {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['Content-Type'] = 'application/json';
        }

        let args: FetcherArgs = [
            url,
            {
                credentials: 'include',
                ...options,
            },
        ];

        context.middleware.forEach((x) => {
            args = x(args);
        });
        if (options.timeout !== undefined) {
            args = createTimeoutMiddleware({timeout: options.timeout})(args);
        }

        fetcherOptions.on?.beforeFetch?.({args});
        const response = await fetchImpl(args[0], {...args[1], headers: buildHeaders(args[1].headers)});
        fetcherOptions.on?.afterFetch?.({args, response});
        return response;
    };

    const middleware: Fetcher['middleware'] = {
        add: (x) => {
            context.middleware.push(x);
        },
    };

    const get: Fetcher['get'] = async (path, options = {}) => {
        return fetchFn(path, {...options, method: 'GET'});
    };

    const post: Fetcher['post'] = async (path, options = {}) => {
        return fetchFn(path, {...options, method: 'POST'});
    };

    const put: Fetcher['put'] = async (path, options = {}) => {
        return fetchFn(path, {...options, method: 'PUT'});
    };

    const patch: Fetcher['patch'] = async (path, options = {}) => {
        return fetchFn(path, {...options, method: 'PATCH'});
    };

    const $delete: Fetcher['delete'] = async (path, options = {}) => {
        return fetchFn(path, {...options, method: 'DELETE'});
    };

    const redirect: Fetcher['redirect'] = async (path, options = {}) => {
        const url = buildUrl(path);

        FetcherTools.redirect(url, options);
    };

    const clone: Fetcher['clone'] = () => {
        return createFetcher(fetcherOptions);
    };

    if (fetcherOptions.timeout !== undefined) {
        middleware.add(
            createTimeoutMiddleware({timeout: fetcherOptions.timeout}),
        );
    }

    return {
        get,
        post,
        put,
        patch,
        delete: $delete,
        redirect,
        buildUrl,
        clone,
        middleware,
    } as const;
};
