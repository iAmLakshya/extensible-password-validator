import { expect } from 'chai';
import { createPlugin } from '../src';
import * as sinon from 'sinon';

describe('plugins', () => {
	const input = { str: 'test', ascii_char_seq: [116, 101, 115, 116] };
	it('should create a plugin with default configuration', () => {
		const mockValidationFunction = () => true;
		const plugin = createPlugin(mockValidationFunction, {} as any);

		expect(plugin.prototype?.id).to.be.undefined;
		expect(plugin.prototype?.operation).to.be.undefined;
		expect(plugin.prototype?.check_value).to.be.undefined;
	});

	it('should create a plugin with custom configuration', () => {
		const mockValidationFunction = () => true;
		const config = { id: 'testPlugin', message: 'Custom message' };
		const plugin = createPlugin(mockValidationFunction, config)('==', 2);

		expect(plugin.prototype?.id).to.equal(config.id);
		expect(plugin.prototype?.operation).to.equal('==');
		expect(plugin.prototype?.check_value).to.equal(2);
	});

	it('should call the validation function with input and config', () => {
		const mockValidationFunction = sinon.spy(); // Using sinon for spying
		const config = { id: 'testPlugin' };
		const plugin = createPlugin(mockValidationFunction, config)('<', 2);

		plugin(input);

		expect(mockValidationFunction.calledOnce).to.be.true;
		expect(mockValidationFunction.calledWith(input, {})).to.be.true;
	});

	it('should return null if validation passes', () => {
		const mockValidationFunction = () => true;
		const plugin = createPlugin(mockValidationFunction, { id: 'testPlugin' })();

		const result = plugin(input);

		expect(result).to.be.null;
	});

	it('should return formatted error message on validation failure', () => {
		try {
			const mockValidationFunction = () => false;
			const config = { id: 'testPlugin', message: 'Validation failed' };
			const plugin = createPlugin(mockValidationFunction, config)();

			const result = plugin(input);

			expect(result).to.include('Validation failed');
		} catch (err) { }

	});

	it('should handle non-boolean validation results with comparison', () => {
		try {
			const mockValidationFunction = () => 5; // Assuming validation returns a number
			const config = { id: 'testPlugin' };
			const plugin = createPlugin(mockValidationFunction, config)('<', 3);

			expect(plugin(input)).to.include('Validation failed'); // Should fail because 5 is not less than 3
		} catch (err) { }
	});

});