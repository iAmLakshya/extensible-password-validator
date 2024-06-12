export interface Range {
	start: number,
	end: number,
	end_inclusive?: boolean
}

export type AsciiCharacterSequence = number[];

export type ValidationCheckValue = string | number | boolean | (string | number | boolean)[];
export interface ValidationRuleConfig {
	value: ValidationCheckValue,
	disabled?: boolean,
	message?: string
}

export interface ValidationInput {
	/**
	 * Original string provider by the user to validator
	 */
	str: string;

	/**
	 * Original string provider by the user to validator
	 */
	ascii_char_seq: AsciiCharacterSequence;
}
export interface PluginWrapperInput {
	/**
	 *  Message returned if validation fails
	 */
	message?: string;

}

export type ComparisonOperator = '==' | '<=' | '>=' | '>' | '<' | '!=' | 'is-in' | 'is-not-in' | 'should-contain-any';

export interface ValidationConfig {
	// value: number | boolean,
	id: string,
	message?: string
}
export type ValidationResponse = string | undefined | false | null | void;

export interface ValidationFunctionConfig {
	max_sub_str_len?: number
}
export type ValidationFunction = (data: ValidationInput, config?: ValidationFunctionConfig) => ValidationCheckValue;

export type Plugin = (data: ValidationInput) => ValidationResponse;
export type PluginWrapper = (data: PluginWrapperInput) => Plugin;

export interface ValidatorConfig {
	checkAll?: boolean,
	mergeDuplicatePlugins?: boolean,
	overridePlugins?: boolean,
	mergePlugins?: boolean,

}

export interface ValidatorInitialisationParameters {
	config?: ValidatorConfig,
	plugins?: Plugin[]
}

export interface ValidatorResult {
	plugin_id: string,
	check: {
		value?: ValidationCheckValue,
		operation?: ComparisonOperator
	},
	message: string
}


export type CreateWrapper = (
	checkOperation?: ComparisonOperator,
	checkValue?: ValidationCheckValue,
	validationConfig?: Partial<ValidationConfig>
) => Plugin