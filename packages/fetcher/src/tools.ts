import { Fetcher } from "./types";

export const FetcherTools: {
    redirect: Fetcher['redirect'];
} = {
    redirect: (path, options = {}) => {
        const url = `${path}`;

        window.open(url, options.external ? '_blank' : '_self');
    },
};
