// index.js
import { words as engWords } from './langs/engArray.js';
import { words as spanishWords } from './langs/spanishArray.js';

class ProfanityFilter {
    constructor(options = {}) {
        this.leetMap = {
            '4': 'a', '@': 'a', 
            '3': 'e', 
            '1': 'i', '!': 'i', 
            '0': 'o', 
            '$': 's', '5': 's', 
            '7': 't', '+': 't', 
            '2': 'z'
        };

        this.langs = options.langs || ['eng'];
        this.threshold = options.threshold || 1;
        this.debug = options.debug || false;
        this.checkSymbols = options.checkSymbols || false;

        this.log(`Using languages: ${this.langs.join(', ')}`);
        this.phraseSets = this.loadProfanityWords();

        this.profaneSymbols = [
            /8={2,}D/, // Matches 8==D, 8===D, 8====D, etc.
            /8-{2,}D/, // Matches 8--D, 8---D, 8----D, etc.
            /8-{2,}/, // Matches 8--, 8---, 8----, etc.
            /:-\)/,    // Matches :-)
            /:-\(/,    // Matches :-(
            /:-D/,     // Matches :-D
            /\.i\./,   // Matches .i.
            /\.l\./,   // Matches .l.
            /\.I\./,   // Matches .I.
            /\.t./,    // Matches .t
            /:--+/,    // Matches :--, :---, :----, etc.
            /:={2,}/   // Matches :=, :==, :===, etc.
        ]; 
    }

    normalizeWord(word) {
        if (!word) return '';
        let normalizedWord = word
            .toLowerCase()
            .split('')
            .map(char => this.leetMap[char] || char)  
            .join('')
            .trim();

        // Handle common feminine and plural suffixes in Spanish
        if (this.langs.includes('spanish')) {
            if (normalizedWord.endsWith('as')) {
                normalizedWord = normalizedWord.slice(0, -2) + 'o';
            } else if (normalizedWord.endsWith('os')) {
                normalizedWord = normalizedWord.slice(0, -1);
            } else if (normalizedWord.endsWith('a')) {
                normalizedWord = normalizedWord.slice(0, -1) + 'o';
            } else if (normalizedWord.endsWith('es')) {
                normalizedWord = normalizedWord.slice(0, -2);
            }
        }

        return normalizedWord;
    }

    normalizePhrase(phrase) {
        return phrase
            .toLowerCase()
            .replace(/\s+/g, ' ')  
            .trim()  
            .split(' ')  
            .map(word => this.normalizeWord(word))  
            .join(' ');  
    }

    levenshteinDistance(a, b) {
        if (!a || !b) return Infinity;

        const matrix = Array.from({ length: a.length + 1 }, () =>
            Array(b.length + 1).fill(0));

        for (let i = 0; i <= a.length; i) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = 1 + Math.min(
                        matrix[i - 1][j], 
                        matrix[i][j - 1], 
                        matrix[i - 1][j - 1]
                    );
                }
            }
        }

        return matrix[a.length][b.length];
    }

    loadProfanityWords() {
        const phraseSet = new Set();

        for (const lang of this.langs) {
            let words;
            if (lang === 'eng') {
                words = engWords;
            } else if (lang === 'spanish') {
                words = spanishWords;
            } else {
                this.log(`Unsupported language: ${lang}`);
                continue;
            }

            words.map(phrase => this.normalizePhrase(phrase.trim()))
                .filter(phrase => phrase.length > 0)
                .forEach(phrase => phraseSet.add(phrase));

            this.log(`Loaded ${words.length} phrases for ${lang}`);
        }

        this.log(`Total unique profane phrases loaded: ${phraseSet.size}`);
        return phraseSet;
    }

    isProfane(input) {
        if (!input || typeof input !== 'string') return false;

        const normalizedInput = this.normalizePhrase(input);
        this.log(`Normalized input: "${normalizedInput}"`);

        const words = normalizedInput.split(/\s+/);

        for (const word of words) {
            for (const phrase of this.phraseSets) {
                if (word.includes(phrase)) {
                    this.log(`Profanity found in word: "${word}" containing phrase: "${phrase}"`);
                    return true;
                }
            }
        }

        if (this.checkSymbols) {
            for (const symbol of this.profaneSymbols) {
                if (symbol.test(input)) {
                    this.log(`Profanity found in symbol: "${symbol}"`);
                    return true;
                }
            }
        }

        this.log(`No profanity found in: "${normalizedInput}"`);
        return false;
    }

    log(message) {
        if (this.debug) console.log(`[ProfanityFilter] ${message}`);
    }

    addProfaneWord(word) {
        const normalizedWord = this.normalizeWord(word);
        this.phraseSets.add(normalizedWord);
        this.log(`Added custom profane word: "${normalizedWord}"`);
        return this;
    }
}

export default ProfanityFilter;
