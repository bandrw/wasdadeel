export const wait = (duration: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, duration);
    });

export const MINUTE = 1000 * 60;

export const EMAIL_REGEXP =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (str: string): boolean => Boolean(str.match(EMAIL_REGEXP));

export const CAN_USE_DOM: boolean =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined';
