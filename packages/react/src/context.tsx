import React from 'react';

export interface CreatedContext<T, Arg = never> {
    context: React.Context<T | undefined>;
    useContextOrThrow: () => T;
    useContext: () => T | undefined;
    Provider: React.FC<React.PropsWithChildren<[Arg] extends [never] ? object : {initialValue: Arg}>>;
}

export const createContext = <T, Arg = never>(name: string, initState: (arg: Arg) => T): CreatedContext<T, Arg> => {
    type Self = CreatedContext<T, Arg>;

    const context: Self['context'] = React.createContext<T | undefined>(undefined);

    const useContext: Self['useContext'] = () => {
        return React.useContext(context);
    };

    const useContextOrThrow: Self['useContextOrThrow'] = () => {
        const value = useContext();
        if (value === undefined) throw new Error(`${name} hook used outside of provider`);
        return value;
    };

    const Provider: Self['Provider'] = ({
        // @ts-expect-error
        initialValue,
        children,
    }) => {
        return <context.Provider value={initState(initialValue)}>{children}</context.Provider>
    };

    return {
        context,
        useContext,
        useContextOrThrow,
        Provider,
    };
};
