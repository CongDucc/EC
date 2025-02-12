import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    // Remember the last callback if it changes
    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        // Don't schedule if no delay is specified
        if (delay === null) {
            return;
        }

        const id = setInterval(() => {
            savedCallback.current();
        }, delay);

        return () => {
            clearInterval(id); // ✅ Đã sửa lỗi
        };
    }, [delay]);
}
