"use client";
import { createTeardown } from "@wasdadeel/common";
import { useFactory, useOnUnmount } from "./hooks";

export const useTeardown = () => {
    const teardown = useFactory(() => createTeardown());

    useOnUnmount(() => teardown.reset());

    return teardown;
};
