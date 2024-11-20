# Profanity Filter
> version 1.0.0

This project is a profanity filter that detects and filters out offensive words and phrases from text. It supports multiple languages and includes leetspeak normalization.

## Features

- Detects offensive words and phrases in text
- Supports multiple languages
- Normalizes leetspeak
- Customizable profanity word list

## Installation

1. Install the package:
    ```sh
    npm install profanity-filter
    ```

## Usage

### Basic Usage

```javascript
import  ProfanityFilter  from 'profanity-filter'

const filter = new ProfanityFilter();
const text = "Your text here";
const isProfane = filter.isProfane(text);

console.log(`Is the text profane? ${isProfane}`);
```

### Custom Options

You can customize the filter by passing options to the constructor:

```javascript
const filter = new ProfanityFilter({
    langs: ['eng', 'spanish'], // Supported languages
    threshold: 2, // Levenshtein distance threshold
    debug: true // Enable debug logging
});
```

### Adding Custom Profane Words

You can add custom profane words to the filter:

```javascript
filter.addProfaneWord('customword');
```