import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
    initialSeconds: number;
    onExpire?: () => void;
    autoStart?: boolean;
}

export function useTimer({ initialSeconds, onExpire, autoStart = false }: UseTimerOptions) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onExpireRef = useRef(onExpire);

    // Keep the onExpire ref fresh without restarting the timer
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    }, []);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const reset = useCallback((newSeconds?: number) => {
        stop();
        setSecondsLeft(newSeconds ?? initialSeconds);
    }, [stop, initialSeconds]);

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    setIsRunning(false);
                    onExpireRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return { secondsLeft, isRunning, formatted, start, stop, reset };
}
