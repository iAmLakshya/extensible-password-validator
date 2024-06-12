import { compareValue, consecutiveCharSubStringMaxLength, convertStringToAsciiSequence, numberOfDigits, numberOfLowerCaseCharacters, numberOfUpperCaseCharacters, repetitiveCharSubStringMaxLength, substitutePlaceholdersFromString } from "./helper/utils"
import { ComparisonOperator, CreateWrapper, Plugin, ValidationCheckValue, ValidationConfig, ValidationFunction, ValidationFunctionConfig, ValidationInput } from "./lib/main"

/**
 * Creates a plugin function for password validation based on a provided validation function and default configuration.
 * 
 * @param {ValidationFunction} validationFunction - The validation function to use for the plugin.
 * @param {ValidationConfig} defaultValidationConfig - The default configuration for the plugin.
 * @returns {CreateWrapper} - A function that can be used to create plugin instances with specific configurations.
 */
export const createPlugin = (validationFunction: ValidationFunction, defaultValidationConfig: ValidationConfig): CreateWrapper => {
	const pluginWrapper: CreateWrapper = (
		checkOperation?: ComparisonOperator,
		checkValue?: ValidationCheckValue,
		validationConfig?: Partial<ValidationConfig>
	): Plugin => {
		const config = {
			...(validationConfig || {}),
			...(defaultValidationConfig || {})
		};

		// We have check value, config
		// We need to access the input string
		// Pass all three to validation function
		const createdPlugin = (input: ValidationInput) => {

			const validation_function_config: ValidationFunctionConfig = {}

			// if (config.id === 'consecutiveCharSubStringLength')
			// 	validation_function_config['max_sub_str_len'] = parseInt(`${checkValue}`);

			const validation_response = validationFunction(input, validation_function_config);

			const res_msg = substitutePlaceholdersFromString(
				config?.message || `Validation [${config?.id || ''}] failed`,
				{
					'check_value': checkValue,
					'operator': checkOperation,
				}
			);

			let executeComparison = () => validation_response;

			if (typeof validation_response !== 'boolean') {
				executeComparison = () => compareValue(validation_response, checkOperation, checkValue)
				if (config.id === 'stringChars') {
					executeComparison = () => compareValue(
						input.ascii_char_seq,
						checkOperation,
						Array.isArray(checkValue) ? checkValue.map(char => `${char}`.charCodeAt(0)) : convertStringToAsciiSequence(`${checkValue}`)
					)
				}
			}

			return executeComparison() ? null : res_msg;
		};

		createdPlugin.prototype = {};
		createdPlugin.prototype.id = config.id;
		createdPlugin.prototype.operation = checkOperation;
		createdPlugin.prototype.check_value = checkValue;
		return createdPlugin;
	}
	return pluginWrapper
}

/**
 * A pre-defined set of validation plugins for common password strength checks.
 */
export const predefine_plugins = {

	numberOfChars: createPlugin(({ str }) => {
		return str.length;
	}, {
		id: 'numberOfChars',
		message: 'Password length should be [:operator] [:check_value] character(s)'
	}),

	numberOfUpperCaseCharacters: createPlugin(({ ascii_char_seq }) => {
		return numberOfUpperCaseCharacters(ascii_char_seq);
	}, {
		id: 'numberOfUpperCaseCharacters',
		message: 'Uppercase characters in password should be [:operator] [:check_value]'
	}),

	numberOfLowerCaseCharacters: createPlugin(({ ascii_char_seq }) => {
		return numberOfLowerCaseCharacters(ascii_char_seq);
	}, {
		id: 'numberOfLowerCaseCharacters',
		message: 'Lowercase characters in password should be [:operator] [:check_value]'
	}),

	numberOfDigits: createPlugin(({ ascii_char_seq }) => {
		return numberOfDigits(ascii_char_seq);
	}, {
		id: 'numberOfDigits',
		message: 'Digits in password should be [:operator] [:check_value]'
	}),

	consecutiveCharSubStringMaxLength: createPlugin(({ ascii_char_seq }) => {
		return consecutiveCharSubStringMaxLength(ascii_char_seq);
	}, {
		id: 'consecutiveCharSubStringLength',
		message: 'Length of any consecutive character sub-string should be [:operator] [:check_value]'
	}),

	repetitiveCharSubStringMaxLength: createPlugin(({ ascii_char_seq }) => {
		return repetitiveCharSubStringMaxLength(ascii_char_seq);
	}, {
		id: 'repetitiveCharSubStringMaxLength',
		message: 'Length of any repetitive character sub-string should be [:operator] [:check_value]'
	}),

	stringChars: createPlugin(({ ascii_char_seq }) => {
		return ascii_char_seq;
	}, {
		id: 'stringChars',
		message: 'Password [:operator] [:check_value]'
	}),

}
