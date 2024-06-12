import { ASCII_DIGIT_RANGE, ASCII_LOWERCASE_ALPHA_RANGE, ASCII_UPPERCASE_ALPHA_RANGE } from "./constants";
import { AsciiCharacterSequence, ComparisonOperator, Range, ValidationCheckValue } from "../lib/main"

/**
 * Converts string characters to their corresponding ASCII value and returns them as an array.
 * 
 * @param {string} str - The input string to convert.
 * @returns {number[]} AsciiCharacterSequence - An array of ASCII character codes representing the input string.
 */
export const convertStringToAsciiSequence = (str: string): AsciiCharacterSequence => {
	if (!str.length) return []
	return str.split('').map(char => char.charCodeAt(0));
}

/**
 * Converts an array of ASCII values to a corresponding string.
 * 
 * @param {number[]} ascii_char_seq - The array of ASCII character codes to convert.
 * @returns {string} - The string representation of the ASCII character codes.
 */
export const convertAsciiSequenceToString = (ascii_char_seq: AsciiCharacterSequence): string => {
	if (!ascii_char_seq.length) return ''
	return String.fromCharCode(...ascii_char_seq)
}

/**
 * Checks whether a numerical value is within a specified range (inclusive or exclusive).
 * 
 * @param {number} value - The numerical value to check.
 * @param {Range} range - The range to check the value against.
 * @returns {boolean} - True if the value is within the range, false otherwise.
 */
export const isNumberInRange = (value: number, range: Range): boolean => {
	if (
		value >= range.start
		&& (
			range.end_inclusive
				? value <= range.end
				: value < range.end
		)
	) {
		return true;
	}
	return false;
}

/**
 * Counts the number of uppercase characters in a string (determined by ASCII code range).
 * 
 * @param {number[]} ascii_char_seq - The array of ASCII character codes representing the string.
 * @returns {number} - The number of uppercase characters in the string.
 */
export const numberOfUpperCaseCharacters = (ascii_char_seq: AsciiCharacterSequence): number => {
	return ascii_char_seq.filter(ascii_code => isNumberInRange(ascii_code, ASCII_UPPERCASE_ALPHA_RANGE)).length
}

/**
 * Counts the number of lowercase characters in a string (determined by ASCII code range).
 * 
 * @param {number[]} ascii_char_seq - The array of ASCII character codes representing the string.
 * @returns {number} - The number of lowercase characters in the string.
 */
export const numberOfLowerCaseCharacters = (ascii_char_seq: AsciiCharacterSequence): number => {
	return ascii_char_seq.filter(ascii_code => isNumberInRange(ascii_code, ASCII_LOWERCASE_ALPHA_RANGE)).length
}

/**
 * Counts the number of digits (0-9) in a string (determined by ASCII code range).
 * 
 * @param {number[]} ascii_char_seq - The array of ASCII character codes representing the string.
 * @returns {number} - The number of digits in the string.
 */
export const numberOfDigits = (ascii_char_seq: AsciiCharacterSequence): number => {
	return ascii_char_seq.filter(ascii_code => isNumberInRange(ascii_code, ASCII_DIGIT_RANGE)).length
}


/**
 * Finds the maximum length of a consecutive character substring in a string (not case-sensitive).
 * 
 * @param {number[]} ascii_char_seq - The array of ASCII character codes representing the string.
 * @returns {number} - The maximum length of a consecutive character substring.
 */
export const consecutiveCharSubStringMaxLength = (ascii_char_seq: AsciiCharacterSequence): number => {
	// Convert all char to lowercase (AbC and ABC should be treated same)
	ascii_char_seq = convertStringToAsciiSequence(convertAsciiSequenceToString(ascii_char_seq).toLowerCase());


	// Empty string  is less than 1 (if 1, check will be redundant)
	if (ascii_char_seq.length < 2) return ascii_char_seq.length;

	// Save first value in the sequence
	let last_scan = ascii_char_seq[0];
	let max_length = 1;
	let current_len = 1;

	// Iterate through all the items in the sequence except first item
	for (const value of ascii_char_seq.slice(1)) {
		if (last_scan + 1 === value) {
			current_len += 1;
		} else {
			// Rest len
			current_len = 1;
		}

		last_scan = value;
		max_length = Math.max(current_len, max_length);

	}
	return max_length;
}

/**
 * Calculates the maximum length of a repetitive character substring within the provided ASCII character sequence.
 * 
 * @param {AsciiCharacterSequence} ascii_char_seq - The ASCII character sequence to analyze.
 * @returns {number} - The maximum length of a repetitive character substring.
 */
export const repetitiveCharSubStringMaxLength = (ascii_char_seq: AsciiCharacterSequence): number => {
	// Convert all char to lowercase (AbC and ABC should be treated same)
	ascii_char_seq = convertStringToAsciiSequence(convertAsciiSequenceToString(ascii_char_seq).toLowerCase());

	// Empty string  is less than 1 (if 1, check will be redundant)
	if (ascii_char_seq.length < 2) return ascii_char_seq.length;

	// Save first value in the sequence
	let last_scan = ascii_char_seq[0];
	let current_len = 1;
	let max_length = 1;

	// Iterate through all the items in the sequence except first item
	for (const value of ascii_char_seq.slice(1)) {
		if (last_scan === value) {
			current_len++;
		} else {
			// Rest len
			current_len = 1;
		}

		last_scan = value;
		max_length = Math.max(current_len, max_length);

	}
	return max_length;
}

/**
 * Compares two values based on the provided operator.
 * 
 * @param {ValidationCheckValue} lhs - The left-hand side value for the comparison.
 * @param {ComparisonOperator} operator - The comparison operator to use.
 * @param {ValidationCheckValue} rhs - The right-hand side value for the comparison.
 * @returns {boolean} - The result of the comparison.
 * @throws {Error} - If an invalid or unsupported operator is provided.
 */
export const compareValue = (lhs: ValidationCheckValue, operator: ComparisonOperator, rhs: ValidationCheckValue): boolean => {
	// Array Operation on RHS
	if (['is-in', 'is-not-in'].includes(operator)) {
		const rhs_parsed = Array.isArray(rhs) ? rhs : [rhs];
		if (operator === 'is-in') return rhs_parsed.includes(lhs as any);
		if (operator === 'is-not-in') return !rhs_parsed.includes(lhs as any);
	}

	// Array Operation on RHS & LHS
	if (['should-contain-any'].includes(operator)) {
		const rhs_parsed = (Array.isArray(rhs) ? rhs : [rhs]);
		const lhs_parsed = Array.isArray(lhs) ? lhs : [lhs];

		if (operator === 'should-contain-any') return lhs_parsed.some(lhs_char => rhs_parsed.includes(lhs_char));
	}

	if (operator === '!=') return lhs != rhs;
	if (operator === '==') return lhs == rhs;
	if (operator === '>=') return lhs >= rhs;
	if (operator === '<=') return lhs <= rhs;
	if (operator === '<') return lhs < rhs;
	if (operator === '>') return lhs > rhs;

	throw new Error(`Invalid/unsupported operator [${operator}] passed`);
}

/**
 * Replaces all occurrences of a search string with a replacement string within the provided string.
 * 
 * @param {string} str - The string to perform the replacement on.
 * @param {string} search - The string to search for.
 * @param {string} replace - The string to replace the search string with.
 * @returns {string} - The modified string with all replacements done.
 */
export const replaceAll = (str: string, search: string, replace: string) => {
	return str.replace(new RegExp((search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")), 'g'), replace)
}

/**
 * Substitutes placeholders within a string using a provided replacement map.
 * 
 * @param {string} str - The string to perform the substitution on.
 * @param {{ [key: string]: ValidationCheckValue }} replacementMap - A map containing key-value pairs for substitution.
 * @returns {string} - The modified string with all substitutions done.
 */
export const substitutePlaceholdersFromString = (str: string, replacementMap: { [key: string]: ValidationCheckValue }) => {
	for (const [key, value] of Object.entries(replacementMap)) {
		str = replaceAll(str, `[:${key.trim()}]`, `${Array.isArray(value) ? `${value.join(', ')}` : value}`);
	}
	return str;
}