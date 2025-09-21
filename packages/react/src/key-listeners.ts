import { useEffect } from "react";
import { useRefCopy } from "./hooks";
import { CAN_USE_DOM } from "@wasdadeel/common";
import { useCreateState } from "./create-state";

const useEventListener = ({
    event,
    callback,
    root,
}: {
    event: Parameters<Element['addEventListener']>[0];
    callback: (context: {target: EventTarget; event: Event}) => void;
    root?: Element;
}) => {
    const callbackRef = useRefCopy(callback);

    useEffect(() => {
        const rootEl = root ?? document;

        type Listener = Parameters<typeof rootEl.addEventListener>[1];

        const onPointerDown: Listener = (e) => {
            if (e.target !== null) {
                callbackRef.current({target: e.target, event: e});
            }
        };

        rootEl.addEventListener(event, onPointerDown);

        return () => {
            rootEl.removeEventListener(event, onPointerDown);
        };
    }, [callbackRef, event, root]);
};

export const useOnKeyDown = (callback: (options: {key: string; event: KeyboardEvent}) => void) => {
    const callbackRef = useRefCopy(callback);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            callbackRef.current({key: e.key, event: e});
        };

        document.addEventListener('keydown', handler);

        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, [callbackRef]);
};

export const useOnKeyUp = (callback: (options: {key: string; event: KeyboardEvent}) => void) => {
    const callbackRef = useRefCopy(callback);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            callbackRef.current({key: e.key, event: e});
        };

        document.addEventListener('keyup', handler);

        return () => {
            document.removeEventListener('keyup', handler);
        };
    }, [callbackRef]);
};

export const useOnEscape = (callback: () => void) => {
    useOnKeyDown(({key}) => {
        if (key === 'Escape') {
            callback();
        }
    });
};

export const useOnEnter = (callback: () => void) => {
    useOnKeyDown(({key}) => {
        if (key === 'Enter') {
            callback();
        }
    });
};

export const useOnSpace = (callback: (e: KeyboardEvent) => void) => {
    useOnKeyDown(({key, event}) => {
        if (key === ' ') {
            callback(event);
        }
    });
};

export const useOnClick = (
    callback: (context: {event: Event; target: EventTarget; pointerDownTarget: EventTarget}) => void,
    {root}: {root?: Element} = {},
) => {
    const pointerDownTarget = useCreateState<EventTarget | null>(null, {stateless: true});
    const callbackRef = useRefCopy(callback);

    useEventListener({
        event: 'click',
        callback: ({event, target}) => {
            const freshPointerDownTarget = pointerDownTarget.getState();
            if (target !== null && freshPointerDownTarget !== null) {
                callbackRef.current({
                    event,
                    target,
                    pointerDownTarget: freshPointerDownTarget,
                });
            }
        },
        root,
    });

    useEventListener({
        event: 'pointerdown',
        callback: (e) => pointerDownTarget.setState(e.target),
        root,
    });
};

export const useOnPointerDown = (callback: (context: {target: EventTarget}) => void, {root}: {root?: Element} = {}) => {
    useEventListener({
        event: 'pointerdown',
        callback,
        root,
    });
};

export const useOnPointerUp = (callback: (context: {target: EventTarget}) => void, {root}: {root?: Element} = {}) => {
    useEventListener({
        event: 'pointerup',
        callback,
        root,
    });
};

export const useOnPointerMove = (callback: (context: {target: EventTarget}) => void, {root}: {root?: Element} = {}) => {
    useEventListener({
        event: 'pointermove',
        callback,
        root,
    });
};

export const useOnClickAway = (
    callback: (options: {event: Event}) => void,
    {getRoot}: {getRoot: () => HTMLElement | null},
) => {
    useOnClick(
        ({pointerDownTarget, event}) => {
            const root = getRoot();
            if (root === null) return;
            if (pointerDownTarget instanceof HTMLElement && !root.contains(pointerDownTarget)) {
                callback({event});
            }
        },
        {root: CAN_USE_DOM ? document.body : undefined},
    );
};

export const useOnPointerDownAway = (
    callback: (options: {target: EventTarget}) => void,
    {getRoot}: {getRoot: () => HTMLElement | null},
) => {
    useOnPointerDown(
        ({target}) => {
            const root = getRoot();
            if (root === null) return;
            if (target instanceof HTMLElement && !root.contains(target)) {
                callback({target});
            }
        },
        {root: CAN_USE_DOM ? document.body : undefined},
    );
};

export const useOnScroll = (callback: () => void, {root}: {root?: Element} = {}) => {
    const callbackRef = useRefCopy(callback);

    useEffect(() => {
        const rootEl = root ?? document;

        const handler = () => {
            callbackRef.current();
        };

        rootEl.addEventListener('scroll', handler);

        return () => {
            rootEl.removeEventListener('scroll', handler);
        };
    }, [callbackRef, root]);
};
