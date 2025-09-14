"use client";
import { createRenderLoop } from "@wasdadeel/common";
import { useEffect } from "react";

export const useCreateRenderLoop = (...args: Parameters<typeof createRenderLoop>) => {
    useEffect(() => {
        const loop = createRenderLoop(...args);

        loop.start();

        return () => {
            loop.stop();
        };
    }, []);
};
