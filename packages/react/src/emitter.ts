"use client";
import { createEventEmitter, EventEmitter, EventMap } from "@wasdadeel/emitter";
import { useSyncEffect } from "./hooks";

export interface ReactEmitter<T extends EventMap> extends EventEmitter<T> {
    useOn: (
        event: Parameters<EventEmitter<T>['on']>[0],
        listener: Parameters<EventEmitter<T>['on']>[1],
    ) => void;
}

export const createReactEmitter = <T extends EventMap>(emitter?: EventEmitter<T>): ReactEmitter<T> => {
    type Self = ReactEmitter<T>;

    if (!emitter) {
        emitter = createEventEmitter<T>();
    }

    const useOn: Self['useOn'] = (event, listener) => {
        useSyncEffect(() => {
            return emitter.on(event, listener);
        });
    };

    return {
        ...emitter,
        useOn,
    };
};
