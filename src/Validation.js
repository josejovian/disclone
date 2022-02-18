const validateValue = (rule, name, value) => {
	let error = '';

	const functionRule = {
		required: (val, params) => {
			if(!val) error = `${name} is required!`;
		},
		maxLength: (val, params) => {
			if(val.length > parseInt(params)) error = `${name} cannot be longer than ${params} characters!`;
		},
		alphanumeric: (val, params) => {
			const regex = /^[a-zA-Z0-9_-\s]*$/;
			if(!regex.test(val)) error = `${name} must be alphanumeric!`;
		}
	};

	const validate = functionRule[rule.rule];
	validate(value, rule.params);

	let status = false;
	
	if(error === '') {
		status = true;
	}

	return {
		status: status,
		message: error
	};
};

export default validateValue;