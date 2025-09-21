"use client";
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useFactory, useRefOutput } from './hooks';
import { NonFunction } from '@wasdadeel/common';
import { createReactEmitter } from './emitter';
import { CreatedState, CreatedStateReader, createState } from '@wasdadeel/state';

export interface CreatedReactState<T extends NonFunction> extends CreatedState<T> {
    useOn: (...args: Parameters<CreatedState<T>['emitter']['on']>) => void;
}
export interface CreatedReactStateReader<T extends NonFunction> extends CreatedStateReader<T> {
    useOn: (...args: Parameters<CreatedStateReader<T>['emitter']['on']>) => void;
}

export const createReactState = <T extends NonFunction>(initialState: T | (() => T)): CreatedReactState<T> => {
    const state = createState(initialState);
    const emitter = createReactEmitter(state.emitter);

    return {
        ...state,
        emitter,
        useOn: emitter.useOn,
    };
};

export const useCreatedStateReader = <T extends NonFunction>(
    createdState: CreatedStateReader<T>,
    {stateless = false}: {stateless?: boolean} = {},
): CreatedReactStateReader<T> => {
    const reactEmitter = useFactory(() => createReactEmitter(createdState.emitter));

    const subscribe: Parameters<typeof useSyncExternalStore>[0] = (onChange) => {
        if (stateless) return () => {};

        return reactEmitter.on('change', () => {
            onChange();
        });
    };

    useSyncExternalStore(subscribe, createdState.getState, createdState.getState);

    return useRefOutput({
        ...createdState,
        emitter: reactEmitter,
        useOn: reactEmitter.useOn,
        state: createdState.getState(),
    });
};

export const useCreatedState = <T extends NonFunction>(
    createdState: CreatedState<T>,
    {stateless = false}: Parameters<typeof useCreatedStateReader<T>>[1] = {},
) => {
    const usedState = useCreatedStateReader(createdState, {stateless});

    return useRefOutput({
        ...usedState,
        setState: createdState.setState,
        state: createdState.getState(),
    });
};

export const useCreateState = <T extends NonFunction>(
    action: Parameters<typeof createState<T>>[0],
    options: Parameters<typeof useCreatedState<T>>[1] = {},
) => {
    const createdState = useFactory(() => createState<T>(action));

    return useCreatedState(createdState, options);
};
