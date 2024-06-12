import { createPlugin, predefine_plugins } from "../src/plugins";
import { CreateValidator } from "../src/validator";


const myCustomValidationPlugin = createPlugin(({ str }) => {
	return !['qwerty', 'abeccc12!'].includes(str.toLowerCase())
}, {
	id: 'myCustomValidationPlugin',
	message: `Please enter a strong password`
});

const validator = new CreateValidator({
	plugins: [
		myCustomValidationPlugin(),
		predefine_plugins.consecutiveCharSubStringMaxLength('<', 5),

	]
});


console.log(validator.validate('ABCDeCCC12'))