export const getEnvOrThrow = (name: string): string => {
    const res = process.env[name];
    if (res === undefined) throw new Error(`Cannot find \`${name}\` env`);
    return res;
};

export const getEnv = (name: string): string | null => {
    try {
        return getEnvOrThrow(name);
    } catch {
        return null;
    }
};

export const getEnvIntOrThrow = (name: string): number => {
    const env = getEnvOrThrow(name);
    const parsed = Number.parseInt(env, 10);
    if (Number.isNaN(parsed)) throw new Error('Invalid env int value')
    return parsed;
};

export const getEnvInt = (name: string): number | null => {
    try {
        return getEnvIntOrThrow(name);
    } catch {
        return null;
    }
};
