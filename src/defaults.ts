import { SPECIAL_CHARS } from "./helper/constants";
import { ValidatorConfig } from "./lib/main";
import { predefine_plugins } from "./plugins";

/**
 * The default configuration object for the password validator.
 */
export const DEFAULT_CONFIG: ValidatorConfig = {
	checkAll: true,
	mergeDuplicatePlugins: true,
	mergePlugins: true
}

/**
 * The default set of plugins used by the password validator.
 */
export const DEFAULT_PLUGIN_SET = [
	predefine_plugins.numberOfChars('<=', 32),
	predefine_plugins.numberOfChars('>=', 8),

	predefine_plugins.numberOfUpperCaseCharacters('>=', 1),
	predefine_plugins.numberOfLowerCaseCharacters('>=', 1),

	predefine_plugins.numberOfDigits('>=', 2),

	predefine_plugins.consecutiveCharSubStringMaxLength('<', 3),
	predefine_plugins.repetitiveCharSubStringMaxLength('<', 3),

	predefine_plugins.stringChars('should-contain-any', SPECIAL_CHARS),
]