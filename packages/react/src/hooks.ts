import { CAN_USE_DOM, NonFunction } from '@wasdadeel/common';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { useIsFirstRender } from './render-hooks';
import { useCreateBoolean } from './create-boolean';

const useIsomorphicLayoutEffect = CAN_USE_DOM ? useLayoutEffect : useEffect;

export {useIsomorphicLayoutEffect as useLayoutEffect};

/**
 * Runs effect synchronously on first render
 * Supports cleanup function
 */
export const useSyncEffect = (effect: () => (() => void) | void) => {
    const isFirstRender = useIsFirstRender();
    const cleanupRef = useRef<(() => void) | undefined>(undefined);

    if (isFirstRender) {
        const cleanupFn = effect();
        if (cleanupFn !== undefined) {
            cleanupRef.current = cleanupFn;
        }
    }

    useEffect(() => {
        return () => {
            cleanupRef.current?.();
        };
    }, []);

    if (isFirstRender && !CAN_USE_DOM) {
        cleanupRef.current?.();
    }
};

/**
 * Allows to create and maintain a mutable reference to a value.
 *
 * The reference remains up-to-date with the latest value, even when the component re-renders.
 *
 * Beneficial when working with mutable data or accessing the most recent value inside event handlers or asynchronous operations.
 */
export const useRefCopy = <T>(value: T) => {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
};

/**
 * Creates constant object reference with renewable properties, ideal for managing dependencies.
 */
export const useRefOutput = <T extends object>(value: T) => {
    const ref = useRef<T>({} as T);
    Object.assign(ref.current, value);
    return ref.current;
};

export const useFactory = <T extends NonFunction>(factory: () => T) => {
    return useState(factory)[0];
};

export const useOnUnmount = (callback: () => void) => {
    useEffect(() => {
        return () => {
            callback();
        };
    }, []);
};

export const useIsMounted = ({stateless = false}: {stateless?: boolean} = {}) => {
    const mounted = useCreateBoolean(false, {stateless});

    useEffect(() => {
        mounted.setTrue();

        return () => {
            mounted.setFalse();
        }
    }, [mounted]);

    return useRefOutput({
        isMounted: mounted.state,
        getIsMounted: mounted.getState,
    });
}
