export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'logical' | 'quantitative' | 'verbal' | 'programming';
export type Role = 'frontend' | 'backend' | 'fullstack' | 'data' | 'devops' | 'general';
export type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'react' | 'nodejs' | 'general';
export type PlatformSource = 'GeeksforGeeks' | 'LeetCode' | 'HackerRank' | 'InterviewBit' | 'Glassdoor' | 'General';

export interface Question {
    id: string;
    type: QuestionType;
    category: string;
    language?: Language;
    role: Role[];
    difficulty: Difficulty;
    text: string;
    options: string[];
    correct: number; // index into options[]
    explanation: string;
    source: PlatformSource;
}

export interface TestConfig {
    role: Role;
    language: Language;
    difficulty: Difficulty;
    questionCount: number;
}

export interface UserAnswer {
    questionId: string;
    selectedIndex: number | null;
    isCorrect: boolean;
}

export interface TestResult {
    config: TestConfig;
    questions: Question[];
    answers: UserAnswer[];
    score: number;
    total: number;
    accuracy: number;
    timeTakenSeconds: number;
    weakAreas: string[];
    categoryBreakdown: { category: string; correct: number; total: number }[];
}
