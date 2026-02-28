// =========================================
// SkillSync — Persistence Layer (localStorage)
// Phase 2: Swap this file for Supabase client
// =========================================

const STORAGE_PREFIX = 'skillsync_';

/**
 * Get data from localStorage with type safety.
 */
export function getData<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

/**
 * Save data to localStorage.
 */
export function setData<T>(key: string, value: T): void {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
        console.error(`[SkillSync Storage] Failed to save "${key}":`, e);
    }
}

/**
 * Remove data from localStorage.
 */
export function removeData(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * Clear all SkillSync data from localStorage.
 */
export function clearAll(): void {
    Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
}

// ---- Storage Keys (centralized) ----
export const KEYS = {
    USER_PROFILE: 'user_profile',
    RESUME_DATA: 'resume_data',
    MILESTONES: 'milestones',
    APTITUDE_HISTORY: 'aptitude_history',
    INTERVIEW_HISTORY: 'interview_history',
    LEARNING_PROGRESS: 'learning_progress',
    NOTIFICATIONS: 'notifications',
    SETTINGS: 'settings',
} as const;
