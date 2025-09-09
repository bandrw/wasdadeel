export type EventMap = Record<string, unknown>;

type Listener<T> = (payload: T) => void;

export interface EventEmitter<T extends EventMap> {
    on: <Y extends keyof T>(event: Y, listener: Listener<T[Y]>) => () => void;
    once: <Y extends keyof T>(event: Y, listener: Listener<T[Y]>) => () => void;
    off: <Y extends keyof T>(event: Y, listener: Listener<T[Y]>) => void;
    offOnce: <Y extends keyof T>(event: Y, listener: Listener<T[Y]>) => void;
    emit: <Y extends keyof T>(event: Y, payload: T[Y]) => void;
}

export const createEventEmitter = <T extends EventMap>(): EventEmitter<T> => {
    type Self = EventEmitter<T>;

    const self: {
        _listeners: Map<keyof T, Set<Listener<unknown>>>;
        _onceListeners: Map<keyof T, Set<Listener<unknown>>>;
    } = {
        _listeners: new Map(),
        _onceListeners: new Map(),
    };

    const off: Self['off'] = (event, listener) => {
        const set = self._listeners.get(event);
        if (set !== undefined) {
            set.delete(listener as any);
        }
    };

    const on: Self['on'] = (event, listener) => {
        const existingSet = self._listeners.get(event);
        const set = existingSet ?? new Set<Listener<unknown>>([]);
        set.add(listener as any);
        if (existingSet === undefined) {
            self._listeners.set(event, set);
        }

        return () => {
            off(event, listener);
        };
    };

    const offOnce: Self['offOnce'] = (event, listener) => {
        const set = self._onceListeners.get(event);
        if (set !== undefined) {
            set.delete(listener as any);
        }
    };

    const once: Self['once'] = (event, listener) => {
        const existingSet = self._onceListeners.get(event);
        const set = existingSet ?? new Set<Listener<unknown>>([]);
        set.add(listener as any);
        if (existingSet === undefined) {
            self._onceListeners.set(event, set);
        }

        return () => {
            offOnce(event, listener);
        };
    };

    const emit: Self['emit'] = (event, payload) => {
        self._listeners.get(event)?.forEach((callback) => {
            callback(payload);
        });

        self._onceListeners.get(event)?.forEach((callback) => {
            callback(payload);
            offOnce(event, callback);
        });
    };

    return {
        on,
        off,
        once,
        offOnce,
        emit,
    };
};
