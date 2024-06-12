import { expect } from 'chai';
import { compareValue, consecutiveCharSubStringMaxLength, convertAsciiSequenceToString, convertStringToAsciiSequence, isNumberInRange, numberOfDigits, numberOfLowerCaseCharacters, numberOfUpperCaseCharacters, repetitiveCharSubStringMaxLength, replaceAll, substitutePlaceholdersFromString } from '../src';
import { Range } from '../src/lib/main';

describe('utils', () => {
	const test_string = 'AbcdeZzZ12#';
	const test_string_ascii = [65, 98, 99, 100, 101, 90, 122, 90, 49, 50, 35];

	describe('convertStringToAsciiSequence', () => {
		it('Empty string', () => {
			expect(convertStringToAsciiSequence('')).to.deep.equal([]);
		});
		it('string should convert to ASCII array', () => {
			expect(convertStringToAsciiSequence(test_string)).to.deep.equal(test_string_ascii);
		});
		it('string should not convert to ASCII array', () => {
			expect(convertStringToAsciiSequence('')).not.to.deep.equal(test_string_ascii);
		});
	});

	describe('convertAsciiSequenceToString', () => {
		it('Empty sequence', () => {
			expect(convertAsciiSequenceToString([])).to.equal('');
		});

		it('ASCII array should not convert to valid string', () => {
			expect(convertAsciiSequenceToString(test_string_ascii)).not.to.equal('AbZ z12#');
		});
	});

	describe('isNumberInRange', () => {
		const range_end_inclusive: Range = { start: 2, end: 8, end_inclusive: true };
		const range_end_exclusive: Range = { start: 2, end: 8 };

		it('Number is within the end inclusive range', () => {
			expect(isNumberInRange(5, range_end_inclusive)).to.true;
		});
		it('Number is greater then the end inclusive range', () => {
			expect(isNumberInRange(range_end_inclusive.end + 1, range_end_inclusive)).to.not.be.true;
		});

		it('Start number is within the end inclusive range', () => {
			expect(isNumberInRange(range_end_inclusive.start, range_end_inclusive)).to.true;
		});
		it('Start number is less then the end inclusive range', () => {
			expect(isNumberInRange(range_end_inclusive.start - 1, range_end_inclusive)).to.not.be.true;
		});

		it('End number is within the end inclusive range', () => {
			expect(isNumberInRange(range_end_inclusive.end, range_end_inclusive)).to.true;
		});
		it('End number is not within the end exclusive range', () => {
			expect(isNumberInRange(range_end_inclusive.end, range_end_exclusive)).to.not.be.true;
		});
	});

	describe('numberOfLowerCaseCharacters', () => {
		it(`Correct uppercase chars count`, () => {
			expect(numberOfUpperCaseCharacters(test_string_ascii)).to.equal(3);
		});
	});

	describe('numberOfLowerCaseCharacters', () => {
		it(`Correct lower chars count`, () => {
			expect(numberOfLowerCaseCharacters(test_string_ascii)).to.equal(5);
		});
	});

	describe('numberOfDigits', () => {
		it(`Correct digit count`, () => {
			expect(numberOfDigits(test_string_ascii)).to.equal(2);
		});
	});

	describe('consecutiveCharSubStringMaxLength', () => {
		it(`Empty string`, () => {
			expect(consecutiveCharSubStringMaxLength([])).to.equal(0);
		});
		it(`Single character`, () => {
			expect(consecutiveCharSubStringMaxLength([65])).to.equal(1);
		});
		it(`Short string`, () => {
			expect(consecutiveCharSubStringMaxLength([65, 66])).to.equal(2);
		});
		it(`Correct max length of sub-string made of consecutive characters`, () => {
			expect(consecutiveCharSubStringMaxLength(test_string_ascii)).to.equal(5);
		});
	});

	describe('repetitiveCharSubStringMaxLength', () => {
		it(`Empty string`, () => {
			expect(repetitiveCharSubStringMaxLength([])).to.equal(0);
		});
		it(`Single character`, () => {
			expect(repetitiveCharSubStringMaxLength([65])).to.equal(1);
		});
		it(`Short string`, () => {
			expect(repetitiveCharSubStringMaxLength([65, 65])).to.equal(2);
		});
		it(`Correct max length of made of repetitive characters`, () => {
			expect(repetitiveCharSubStringMaxLength(test_string_ascii)).to.equal(3);
		});
	});

	describe('compareValue', () => {
		it(`is-in`, () => {
			expect(compareValue(1, 'is-in', [2, 3, 1])).to.be.true;
			expect(compareValue(1, 'is-in', 1)).to.be.true;
			expect(compareValue(1, 'is-in', [2, 3,])).to.be.not.true;
		});
		it(`is-not-in`, () => {
			expect(compareValue(1, 'is-not-in', [2, 3, 1])).to.be.not.true;
			expect(compareValue(1, 'is-not-in', [2, 3,])).to.be.true;
			expect(compareValue(1, 'is-not-in', 4)).to.be.true;
		});
		it(`should-contain-any`, () => {
			expect(compareValue([1, 2, 3], 'should-contain-any', [4, 3, 6])).to.be.true;
			expect(compareValue(2, 'should-contain-any', 2)).to.be.true;
			expect(compareValue(2, 'should-contain-any', 3)).to.not.be.true;
			expect(compareValue([1, 2, 3], 'should-contain-any', [4, 5, 6])).to.not.be.true;
		});

		it(`!=`, () => {
			expect(compareValue('2', '!=', 3)).to.be.true;
			expect(compareValue('2', '!=', '2')).to.be.not.true;
		});
		it(`==`, () => {
			expect(compareValue(1, '==', 1)).to.be.true;
			expect(compareValue('2', '==', 2)).to.be.true;
			expect(compareValue('3', '==', '4')).to.be.not.true;
		});
		it(`>=`, () => {
			expect(compareValue(2, '>=', 1)).to.be.true;
			expect(compareValue(1, '>=', 1)).to.be.true;
			expect(compareValue(0, '>=', 1)).to.be.not.true;

			expect(compareValue('2', '>=', '1')).to.be.true;
			expect(compareValue('0', '>=', '1')).to.not.be.true;
		});
		it(`<=`, () => {
			expect(compareValue(2, '<=', 4)).to.be.true;
			expect(compareValue(1, '<=', 1)).to.be.true;
			expect(compareValue(3, '<=', 2)).to.be.not.true;

			expect(compareValue('2', '<=', '3')).to.be.true;
			expect(compareValue('3', '<=', '1')).to.not.be.true;
		});
		it(`>`, () => {
			expect(compareValue(2, '>', 1)).to.be.true;
			expect(compareValue(1, '>', 1)).to.not.be.true;
			expect(compareValue(0, '>', 1)).to.not.be.true;

			expect(compareValue('2', '>', '1')).to.be.true;
			expect(compareValue('0', '>', '1')).to.not.be.true;
		});
		it(`<`, () => {
			expect(compareValue(2, '<', 4)).to.be.true;
			expect(compareValue(1, '<', 1)).to.be.not.true;
			expect(compareValue(3, '<', 2)).to.be.not.true;

			expect(compareValue('2', '<', '3')).to.be.true;
			expect(compareValue('3', '<', '1')).to.not.be.true;
		});

		it(`invalid operator`, () => {
			try {
				expect(compareValue(2, '*' as any, 4)).to.throw('Invalid/unsupported operator [*] passed');
			} catch (e) { }
		});

		describe('replaceAll', () => {
			it(`Replace all occurrences of a sub-string`, () => {
				expect(replaceAll('123ABC2432ABC342', 'AB', '0')).to.equal('1230C24320C342');
				expect(replaceAll('123ABC2432ABC342', 'ABD', '0')).to.equal('123ABC2432ABC342');
			});
		});

		describe('substitutePlaceholdersFromString', () => {
			it(`Replace all occurrences of placeholders in the given string`, () => {
				const str_with_placeholders = `x=[:x] is not what [:x] looks like but is actually [:y] but values of z are [:z]`;
				const replacement_map = { x: 1, y: 2, z: ['p', 'q', 'r'] };

				expect(substitutePlaceholdersFromString(str_with_placeholders, replacement_map)).to.equal('x=1 is not what 1 looks like but is actually 2 but values of z are p, q, r');
			});
		});

	});
})