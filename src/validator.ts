import { DEFAULT_CONFIG, DEFAULT_PLUGIN_SET } from "./defaults";
import { convertStringToAsciiSequence } from "./helper/utils";
import { Plugin, ValidatorConfig, ValidatorInitialisationParameters, ValidatorResult } from "./lib/main";

/**
 * A class that represents a password validator.
 */
export class CreateValidator {
	/**
	* The current validator configuration.
	* @type {ValidatorConfig}
	*/
	currentConfig: ValidatorConfig = DEFAULT_CONFIG;

	/**
	 * The current set of plugins used by the validator.
	 * @type {Plugin[]}
	 */
	plugins: Plugin[] = DEFAULT_PLUGIN_SET;

	/**
	* Creates a new validator instance.
	* 
	* @param {ValidatorInitialisationParameters} params - Optional parameters for initialization.
	*/
	constructor(params?: ValidatorInitialisationParameters) {
		this.updateConfig(params?.config || {});
		this.setPlugins(params?.plugins || []);
	}

	/**
	* Sets the plugins to be used by the validator.
	* 
	* @param {Plugin[]} plugins_to_set - The plugins to set.
	*/
	setPlugins = (plugins_to_set: Plugin[]) => {
		// Add Plugins
		this.plugins = this.currentConfig.mergePlugins ? [...this.plugins, ...plugins_to_set] : plugins_to_set;

		// Merge provided duplicate with current config
		if (this.currentConfig.mergeDuplicatePlugins)
			this.plugins = Object.values(
				this.plugins.reduce(
					((prev, curr: Plugin) => {
						const signature = `${curr.prototype.id}|${curr.prototype.operation}|${curr.prototype.check_value}`;
						return (
							{
								...prev,
								[signature]: curr
							}
						)
					}
					), {})
			);

		// Override plugins
		if (this.currentConfig.overridePlugins)
			this.plugins = Object.values(this.plugins.reduce((
				(prev, curr: Plugin) => ({ ...prev, [curr.prototype.id + curr.prototype.operation]: curr })
			), {}));
	}

	/**
	 * Updates the validator configuration.
	 * 
	 * @param {ValidatorConfig} config - The new configuration.
	 */
	updateConfig = (config: ValidatorConfig) => {
		// Merge provided config with current config
		this.currentConfig = { ...this.currentConfig, ...config };
	}

	/**
	 * Validates a password string.
	 * 
	 * @param {string} str - The password string to validate.
	 * @returns {ValidatorResult} - The validation result.
	 */
	validate = (str: string) => {
		const ascii_char_seq = convertStringToAsciiSequence(str);
		let errors: ValidatorResult[] = [];

		// Iterate through all plugins
		for (const plugin of this.plugins) {
			console.debug(`Executing [${plugin.prototype.signature}]`)
			const validation_res = plugin({ str, ascii_char_seq });
			if (validation_res) {
				errors.push({
					plugin_id: plugin.prototype.id,
					check: {
						value: plugin.prototype.check_value,
						operation: plugin.prototype.operation,
					},
					message: validation_res
				});
				if (!this.currentConfig.checkAll)
					return this._generateResult(errors);
			}
		}
		return this._generateResult(errors);
	}

	/**
	 * Generates a validation result object.
	 * 
	 * @param {ValidatorResult[]} errors - An array of validation errors.
	 * @returns {ValidatorResult} - The validation result object.
	 */
	_generateResult = (errors: ValidatorResult[]) => {
		return { errors, pass: !errors.length, config: this.currentConfig };
	}
}
