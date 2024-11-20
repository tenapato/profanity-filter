// src/index.d.ts

declare module '@tenapato/profanity-filter' {
    interface ProfanityFilterOptions {
        langs?: string[];
        threshold?: number;
        debug?: boolean;
    }

    class ProfanityFilter {
        constructor(options?: ProfanityFilterOptions);

        normalizeWord(word: string): string;
        normalizePhrase(phrase: string): string;
        levenshteinDistance(a: string, b: string): number;
        isProfane(input: string): boolean;
        addProfaneWord(word: string): this;
        log(message: string): void;
    }

    export = ProfanityFilter;
}