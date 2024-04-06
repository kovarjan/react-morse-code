/**
 * morseEncoder - Encodes a string into Morse code.
 * @param {string} input
 * @return {object} The Morse code representation of the input.
 */
export default function morseEncoder(input) {
    // Define the Morse code dictionary
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
        '\'': '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
        '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
        '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    };

    // Convert the input to uppercase and slice it to words
    input = input.toUpperCase();
    const words = input.split(' ');
    let morseCharacters = '';

    words.forEach((word) => {
        // Split the input into an array of characters
        const characters = word.split('');

        // Encode each character into Morse code
        characters.forEach((character) => {
            if (morseCode[character]) {
                morseCharacters += morseCode[character] + ' ';
            } else {
                console.warn('Invalid character: ', character);
            }
        });

        // Add a space between words
        morseCharacters += '/ ';
    });

    // remove last separator
    morseCharacters = morseCharacters.slice(0, -2);

    return morseCharacters;
}
