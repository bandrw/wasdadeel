const matchHtmlRegExp = /["'&<>]/;

/**
 * Escape special characters in the given string of text.
 */
export const escapeHtml = <T extends string = string>(str: T): T => {
    const match: RegExpExecArray | null = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    let escape: string | undefined;
    let html: string = '';
    let index: number = 0;
    let lastIndex: number = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 39: // '
                escape = '&#39;';
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return (lastIndex !== index ? html + str.substring(lastIndex, index) : html) as T;
};

export const escapeHtmlStrings = <T = unknown>(obj: object): Record<string, T> => {
    return Object.entries(obj).reduce<Record<string, T>>((acc, [key, val]) => {
        let newValue: unknown = val;
        if (typeof newValue === 'string') {
            newValue = escapeHtml(newValue);
        } else if (typeof newValue === 'object' && newValue !== null) {
            if (Array.isArray(newValue)) {
                newValue = newValue.map((it) =>
                    typeof it === 'object' || typeof it === 'string' ? escapeHtmlStrings(it) : it,
                );
            } else {
                newValue = escapeHtmlStrings(newValue);
            }
        }
        acc[key] = newValue as T;
        return acc;
    }, {});
};

const htmlEntities: Record<string, string> = {
    '&quot;': '"',
    '&amp;': '&',
    '&#39;': "'",
    '&lt;': '<',
    '&gt;': '>',
};

export const unescapeHtml = (str: string): string => {
    return str.replace(/&quot;|&amp;|&#39;|&lt;|&gt;/g, (match) => htmlEntities[match] ?? '');
};

export const unescapeHtmlStrings = <T = unknown>(obj: object): Record<string, T> => {
    return Object.entries(obj).reduce<Record<string, T>>((acc, [key, val]) => {
        let newValue: unknown = val;
        if (typeof newValue === 'string') {
            newValue = unescapeHtml(newValue);
        } else if (typeof newValue === 'object' && newValue !== null) {
            if (Array.isArray(newValue)) {
                newValue = newValue.map((it) =>
                    typeof it === 'object' || typeof it === 'string' ? unescapeHtmlStrings(it) : it,
                );
            } else {
                newValue = unescapeHtmlStrings(newValue);
            }
        }
        acc[key] = newValue as T;
        return acc;
    }, {});
};
