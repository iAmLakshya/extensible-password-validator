import { ComparisonOperator, AsciiCharacterSequence, Range } from "../lib/main";

export const COMPARISON_OPERATORS: ComparisonOperator[] = ['==', '<=', '>=', '>', '<', '!=', 'is-in', 'is-not-in'];

export const ASCII_UPPERCASE_ALPHA_RANGE: Range = {
	start: 65, end: 90, end_inclusive: true
}
export const ASCII_LOWERCASE_ALPHA_RANGE: Range = {
	start: 97, end: 122, end_inclusive: true
}
export const ASCII_DIGIT_RANGE: Range = {
	start: 48, end: 57, end_inclusive: true
}

export const ASCII_QWERTY_KEYBOARD_CHAR_SEQUENCE: AsciiCharacterSequence = [
	81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77
	// 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
	// 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
	// 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
]

export const ASCII_VALID_SPECIAL_CHAR = [
	33, 64, 35, 36, 37, 94, 38, 42, 40, 41, 95, 43, 123, 125, 124, 58, 34,
	60, 62, 63,
	45, 61,
	91, 93, 92,
	59, 39,
	44, 46, 47
]

export const SPECIAL_CHARS = [
	'!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+',
	'{', '}', '|',
	':', '"',
	'<', '>', '?',
	'-', '=',
	'[', ']', '\\',
	';', '\'',
	',', '.', '/'
]