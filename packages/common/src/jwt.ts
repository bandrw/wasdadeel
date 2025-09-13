import crypto from 'node:crypto';

interface CreatedJWT {
    sign: (options: {payload: string; expiresIn?: number}) => string;
    verifyOrThrow: (options: {token: string}) => string;
    verify: (...args: Parameters<CreatedJWT['verifyOrThrow']>) => ReturnType<CreatedJWT['verifyOrThrow']> | null;
}

const base64UrlEncode = (data: string): string => {
    return Buffer.from(data).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const base64UrlDecode = (data: string): string => {
    return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
};

export const createJWT = ({secret}: {secret: string; expiresIn?: number}): CreatedJWT => {
    const createSignature = ({header, payload}: {header: string; payload: string}): string => {
        return crypto
            .createHmac('sha256', secret)
            .update(`${header}.${payload}`)
            .digest('base64')
            .replace(/=+$/, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    };

    const sign: CreatedJWT['sign'] = ({payload, expiresIn = 3600 * 1000}) => {
        const header = base64UrlEncode(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
        const exp = Date.now() + expiresIn;
        const tokenPayload = base64UrlEncode(JSON.stringify({payload, exp}));
        const signature = createSignature({header, payload: tokenPayload});

        return `${header}.${tokenPayload}.${signature}`;
    };

    const verifyOrThrow: CreatedJWT['verifyOrThrow'] = ({token}) => {
        const [header, tokenPayload, signature] = token.split('.');
        if (!header || !tokenPayload || !signature) throw new Error('Invalid token');

        const expectedSignature = createSignature({header, payload: tokenPayload});
        if (signature !== expectedSignature) throw new Error('Invalid signature');

        const {exp, payload} = JSON.parse(base64UrlDecode(tokenPayload));
        if (exp < Date.now()) throw new Error('Expired');

        return payload;
    };

    const verify: CreatedJWT['verify'] = (options) => {
        try {
            return verifyOrThrow(options);
        } catch (e) {
            console.error('CreatedJWT error:', e);
            return null;
        }
    };

    return {
        sign,
        verifyOrThrow,
        verify,
    };
};
