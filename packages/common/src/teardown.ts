export interface Teardown {
    add: (callback: () => void) => () => void;
    reset: () => void;
    getSize: () => number;
}

export const createTeardown = (): Teardown => {
    type Self = Teardown;

    const self: {
        callbacks: (() => unknown)[];
    } = {
        callbacks: [],
    };

    const add: Self['add'] = (callback) => {
        let done = false;
        const resetCallback = () => {
            if (done) return;
            done = true;

            try {
                callback();
            } finally {
                const i = self.callbacks.lastIndexOf(resetCallback);
                if (i !== -1) self.callbacks.splice(i, 1);
            }
        };

        self.callbacks.push(resetCallback);

        return resetCallback;
    };

    const reset: Self['reset'] = () => {
        const errors: unknown[] = [];
        const freshCallbacks = [...self.callbacks];
        freshCallbacks.reverse();

        freshCallbacks.forEach((x) => {
            try {
                x();
            } catch (e) {
                errors.push(e);
            }
        });

        if (errors.length > 0) {
            const err = new Error('One or more teardown callbacks threw during reset()');
            Object.assign(err, {errors});
            throw err;
        }

        self.callbacks = [];
    };

    const getSize: Self['getSize'] = () => self.callbacks.length;

    return {
        add,
        reset,
        getSize,
    };
};
