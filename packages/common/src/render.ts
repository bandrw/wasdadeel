export const createRenderLoop = (callback: () => void, {fps = 60}: {fps?: number} = {}) => {
    if (fps <= 0) throw new Error('FPS has to be positive');

    const context: {
        prevTime: number;
        requestId: number;
        status: 'started' | 'stopped';
    } = {
        prevTime: 0,
        requestId: 0,
        status: 'stopped',
    };

    const getStatus = () => context.status;

    const handler = (currentTime: number) => {
        if (currentTime - context.prevTime > 1000 / fps) {
            callback();
            context.prevTime = currentTime;
        }

        $continue();
    };

    const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            pause();
        } else if (document.visibilityState === 'visible') {
            $continue();
        }
    };

    const $continue = () => {
        context.requestId = requestAnimationFrame(handler);
    };
    const pause = () => {
        cancelAnimationFrame(context.requestId);
    };

    const start = () => {
        if (getStatus() === 'started') return;

        context.status = 'started';
        $continue();
        document.addEventListener('visibilitychange', onVisibilityChange);
    };

    const stop = () => {
        if (getStatus() === 'stopped') return;

        pause();
        document.removeEventListener('visibilitychange', onVisibilityChange)
    };

    return {
        start,
        stop,
        getStatus,
    };
};
