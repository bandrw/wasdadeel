import { createEventEmitter, EventEmitter } from '@wasdadeel/emitter';
import {createState} from './create-state';

type EventMap = {
    increment: {prevState: number; newState: number};
    decrement: {prevState: number; newState: number};
    change: {prevState: number; newState: number};
    reset: {prevState: number; newState: number};
};

export interface CreatedCounter {
    getState: () => number;
    reset: () => number;
    increment: () => number;
    decrement: () => number;
    on: EventEmitter<EventMap>['on'];
    once: EventEmitter<EventMap>['once'];
    emitter: EventEmitter<EventMap>;
}

export type CreatedCounterReader = Pick<CreatedCounter, 'getState' | 'on' | 'once'>;

export const createCounter = (initial?: number): CreatedCounter => {
    const INITIAL_VALUE = initial ?? 0;
    const state = createState<number>(INITIAL_VALUE);
    const emitter = createEventEmitter<EventMap>();

    return {
        getState: state.getState,
        reset: () => {
            const prevState = state.getState();
            const newState = INITIAL_VALUE;
            state.setState(newState);
            emitter.emit('reset', {prevState, newState});
            return state.getState();
        },
        decrement: () => {
            const prevState = state.getState();
            const newState = prevState - 1;
            state.setState(newState);
            emitter.emit('decrement', {prevState, newState});
            return state.getState();
        },
        increment: () => {
            const prevState = state.getState();
            const newState = prevState + 1;
            state.setState(newState);
            emitter.emit('increment', {prevState, newState});
            return state.getState();
        },
        on: emitter.on,
        once: emitter.once,
        emitter,
    };
};
