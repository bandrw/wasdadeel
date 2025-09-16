import { createEventEmitter, EventEmitter } from "@wasdadeel/emitter";
import { CreatedState, createState } from "./create-state";

type EventMap = {
    setTrue: {prevState: boolean; newState: boolean};
    setFalse: {prevState: boolean; newState: boolean};
    change: {prevState: boolean; newState: boolean};
    setState: {prevState: boolean; newState: boolean};
    'change.toTrue': {prevState: boolean; newState: boolean};
    'change.toFalse': {prevState: boolean; newState: boolean};
};

export interface CreatedBoolean {
    getState: () => boolean;
    setTrue: () => void;
    setFalse: () => void;
    setState: (payload: Parameters<CreatedState<boolean>['setState']>[0]) => void;
    toggle: () => void;
    on: EventEmitter<EventMap>['on'];
    emitter: EventEmitter<EventMap>;
}

export type CreatedBooleanReader = Omit<CreatedBoolean, 'setTrue' | 'setFalse' | 'setState' | 'toggle'>;

export const createBoolean = (initialState: boolean | (() => boolean)): CreatedBoolean => {
    const state = createState<boolean>(initialState);
    const emitter = createEventEmitter<EventMap>();

    state.on('change', ({prevState, newState}) => {
        emitter.emit('change', {prevState, newState});
        emitter.emit(newState ? 'change.toTrue' : 'change.toFalse', {prevState, newState});
    });

    return {
        getState: state.getState,
        setState: (payload) => {
            const prevState = state.getState();
            state.setState(payload);
            const newState = state.getState();
            emitter.emit('setState', {prevState, newState})
        },
        setTrue: () => {
            const prevState = state.getState();
            const newState = true;
            state.setState(newState);
            emitter.emit('setTrue', {prevState, newState});
        },
        setFalse: () => {
            const prevState = state.getState();
            const newState = false;
            state.setState(newState);
            emitter.emit('setFalse', {prevState, newState});
        },
        toggle: () => {
            const prevState = state.getState();
            const newState = !prevState;
            state.setState(newState);
        },
        on: emitter.on,
        emitter,
    };
};
