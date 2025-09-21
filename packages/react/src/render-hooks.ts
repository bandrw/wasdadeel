import {useCallback, useRef, useState} from 'react';

export const useRendersCount = () => {
    const countRef = useRef(0);
    countRef.current++;
    return countRef.current;
};

export const useIsFirstRender = () => {
    const rendersCount = useRendersCount();
    return rendersCount === 1;
};

export const useOnFirstRender = (action: () => void) => {
    const isFirstRender = useIsFirstRender();
    if (isFirstRender) {
        action();
    }
};

export const useForceUpdate = () => {
    const [, setState] = useState(0);

    const forceUpdate = useCallback(() => {
        setState((prevState) => prevState + 1);
    }, []);

    return forceUpdate;
};
