type SetCookieOptions = (
    | {
          isInfinite?: boolean;
          expires?: undefined;
      }
    | {
          isInfinite?: undefined;
          expires?: string;
      }
) & {
    path?: string;
    domain?: string;
    sameSite?: 'None' | 'Lax' | 'Strict';
    maxAge?: string;
    isSecure?: boolean;
};

export const setCookie = (name: string, value: string, options: SetCookieOptions = {}) => {
    const rawCookieValues: {name: string; value?: string}[] = [{name, value}];

    if (options.isInfinite !== undefined) {
        rawCookieValues.push({
            name: 'Expires',
            value: 'Fri, 31 Dec 9999 23:59:59 GMT',
        });
    } else if (options.expires !== undefined) {
        rawCookieValues.push({
            name: 'Expires',
            value: options.expires,
        });
    }

    if (options.path !== undefined) {
        rawCookieValues.push({
            name: 'Path',
            value: options.path,
        });
    }

    if (options.domain !== undefined) {
        rawCookieValues.push({
            name: 'Domain',
            value: options.domain,
        })
    }

    if (options.sameSite !== undefined) {
        rawCookieValues.push({
            name: 'SameSite',
            value: options.sameSite,
        });
    }

    if (options.maxAge !== undefined) {
        rawCookieValues.push({
            name: 'Max-Age',
            value: options.maxAge,
        });
    }

    if (options.isSecure) {
        rawCookieValues.push({
            name: 'Secure',
        });
    }

    const rawCookieString = rawCookieValues.reduce((acc, val) => {
        if (val.value === undefined) {
            return `${acc}${val.name}; `;
        }
        return `${acc}${val.name}=${val.value}; `;
    }, '');

    document.cookie = rawCookieString.trim();
};

export const parseCookies = (cookiesRaw: string): Record<string, string> =>
    cookiesRaw.split('; ').reduce<{[K: string]: string}>((acc, val) => {
        const [name, value] = val.split('=');
        if (name !== undefined && value !== undefined) {
            acc[name] = value;
        }
        return acc;
    }, {});

export const getCookies = (): Record<string, string> => parseCookies(document.cookie);
