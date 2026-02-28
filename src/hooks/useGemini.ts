// ================================================
// SkillSync — useGemini React Hook
// Wraps async AI calls with loading/error state
// ================================================

import { useState, useCallback } from 'react';

interface UseGeminiReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: (...args: any[]) => Promise<T | null>;
    reset: () => void;
}

/**
 * React hook for calling Gemini AI functions with loading/error state.
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useGemini(enhanceResumeBullets);
 *
 * const handleEnhance = () => {
 *   execute(myBullets);
 * };
 * ```
 */
export function useGemini<T>(
    asyncFn: (...args: any[]) => Promise<T>
): UseGeminiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(
        async (...args: any[]): Promise<T | null> => {
            setLoading(true);
            setError(null);
            try {
                const result = await asyncFn(...args);
                setData(result);
                setLoading(false);
                return result;
            } catch (err: any) {
                const message =
                    err?.message || 'An error occurred while processing your request.';
                setError(message);
                setLoading(false);
                return null;
            }
        },
        [asyncFn]
    );

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
    }, []);

    return { data, loading, error, execute, reset };
}
