import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useFactory, useRefOutput } from './hooks';
import { NonFunction } from '@wasdadeel/common';
import { createReactEmitter } from './emitter';
import { CreatedBoolean, CreatedBooleanReader, createBoolean } from '@wasdadeel/state';

export interface CreatedReactBoolean extends CreatedBoolean {
    useOn: (...args: Parameters<CreatedBoolean['emitter']['on']>) => void;
}
export interface CreatedReactBooleanReader extends CreatedBooleanReader {
    useOn: (...args: Parameters<CreatedBooleanReader['emitter']['on']>) => void;
}

export const createReactBoolean = <T extends NonFunction>(initialState: boolean | (() => boolean)): CreatedReactBoolean => {
    const state = createBoolean(initialState);
    const emitter = createReactEmitter(state.emitter);

    return {
        ...state,
        emitter,
        useOn: emitter.useOn,
    };
};

export const useCreatedBooleanReader = <T>(
    createdBoolean: CreatedBooleanReader,
    {stateless = false}: {stateless?: boolean} = {},
): CreatedReactBooleanReader => {
    const reactEmitter = useFactory(() => createReactEmitter(createdBoolean.emitter));

    const subscribe: Parameters<typeof useSyncExternalStore>[0] = (onChange) => {
        if (stateless) return () => {};

        return reactEmitter.on('change', () => {
            onChange();
        });
    };

    useSyncExternalStore(subscribe, createdBoolean.getState, createdBoolean.getState);

    return useRefOutput({
        ...createdBoolean,
        emitter: reactEmitter,
        useOn: reactEmitter.useOn,
        state: createdBoolean.getState(),
    });
};

export const useCreatedBoolean = <T>(
    createdBoolean: CreatedBoolean,
    {stateless = false}: Parameters<typeof useCreatedBooleanReader<T>>[1] = {},
) => {
    const usedBoolean = useCreatedBooleanReader(createdBoolean, {stateless});

    return useRefOutput({
        ...usedBoolean,
        setTrue: createdBoolean.setTrue,
        setFalse: createdBoolean.setFalse,
        toggle: createdBoolean.toggle,
        setState: createdBoolean.setState,
        state: createdBoolean.getState(),
    });
};

export const useCreateBoolean = <T extends NonFunction>(
    action: Parameters<typeof createBoolean>[0],
    options: Parameters<typeof useCreatedBoolean<T>>[1] = {},
) => {
    const createdBoolean = useFactory(() => createBoolean(action));

    return useCreatedBoolean(createdBoolean, options);
};
