import { createEventEmitter, EventEmitter } from "@wasdadeel/emitter";

type NonFunction = object | string | number | boolean | null | undefined;

type EventMap<Payload> = {
    setState: {newState: Payload};
    change: {newState: Payload; prevState: Payload};
};
type EmitterEvent<Payload> = keyof EventMap<Payload>;

export interface CreatedState<Payload> {
    state: Payload;
    getState: () => Payload;
    setState: (
        action: Payload | ((prevState: Payload) => Payload),
        options?: {
            shouldEmit?: boolean | ((event: EmitterEvent<Payload>) => boolean);
        },
    ) => void;
    on: EventEmitter<EventMap<Payload>>['on'];
}

export type CreatedStateReader<T> = Omit<CreatedState<T>, 'setState'>;
export type CreatedStateInfer<T extends CreatedState<any>> = T extends CreatedState<infer R> ? R : never;

export const createState = <T extends NonFunction>(initialState: T | (() => T)): CreatedState<T> => {
    type Self = CreatedState<T>;

    const emitter = createEventEmitter<EventMap<T>>();

    const self = {
        state: typeof initialState === 'function' ? initialState() : initialState,
    };

    const getState: Self['getState'] = () => self.state;

    const setState: Self['setState'] = (action, options = {}) => {
        const emit: typeof emitter.emit = (...args) => {
            let willEmit = true;
            if (options.shouldEmit !== undefined) {
                if (typeof options.shouldEmit === 'function') {
                    willEmit = options.shouldEmit(args[0]);
                } else {
                    willEmit = options.shouldEmit;
                }
            }
            if (willEmit) {
                emitter.emit(...args);
            }
        };

        const prevState = getState();
        const newState = typeof action === 'function' ? action(prevState) : action;
        const isChanged = prevState !== newState;
        self.state = newState;
        emit('setState', {newState});
        if (isChanged) {
            emit('change', {newState, prevState});
        }
    };

    return {
        state: self.state,
        getState,
        setState,
        on: emitter.on,
    };
};
