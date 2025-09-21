import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useFactory, useRefOutput } from './hooks';
import { NonFunction } from '@wasdadeel/common';
import { createReactEmitter } from './emitter';
import { CreatedCounter, CreatedCounterReader, createCounter } from '@wasdadeel/state';

export interface CreatedReactCounter extends CreatedCounter {
    useOn: (...args: Parameters<CreatedCounter['emitter']['on']>) => void;
}
export interface CreatedReactCounterReader extends CreatedCounterReader {
    useOn: (...args: Parameters<CreatedCounterReader['emitter']['on']>) => void;
}

export const createReactCounter = <T extends NonFunction>(initialState: number = 0): CreatedReactCounter => {
    const state = createCounter(initialState);
    const emitter = createReactEmitter(state.emitter);

    return {
        ...state,
        emitter,
        useOn: emitter.useOn,
    };
};

export const useCreatedCounterReader = <T>(
    createdCounter: CreatedCounterReader,
    {stateless = false}: {stateless?: boolean} = {},
): CreatedReactCounterReader => {
    const reactEmitter = useFactory(() => createReactEmitter(createdCounter.emitter));

    const subscribe: Parameters<typeof useSyncExternalStore>[0] = (onChange) => {
        if (stateless) return () => {};

        return reactEmitter.on('change', () => {
            onChange();
        });
    };

    useSyncExternalStore(subscribe, createdCounter.getState, createdCounter.getState);

    return useRefOutput({
        ...createdCounter,
        emitter: reactEmitter,
        useOn: reactEmitter.useOn,
        state: createdCounter.getState(),
    });
};

export const useCreatedCounter = <T>(
    createdCounter: CreatedCounter,
    {stateless = false}: Parameters<typeof useCreatedCounterReader<T>>[1] = {},
) => {
    const usedCounter = useCreatedCounterReader(createdCounter, {stateless});

    return useRefOutput({
        ...usedCounter,
        reset: createdCounter.reset,
        increment: createdCounter.increment,
        decrement: createdCounter.decrement,
        state: createdCounter.getState(),
    });
};

export const useCreateCounter = <T extends NonFunction>(
    action: Parameters<typeof createCounter>[0] = 0,
    options: Parameters<typeof useCreatedCounter<T>>[1] = {},
) => {
    const createdCounter = useFactory(() => createCounter(action));

    return useCreatedCounter(createdCounter, options);
};
