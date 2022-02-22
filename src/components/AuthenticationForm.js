/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Button } from "@chakra-ui/react";

import { Formik, Form } from "formik";

import { ValidationInput, validateWithRules } from "../utility/Validation";

/* -------------------------------------------------------------------------- */
/*                A box that contains the register/login Form.                */
/* -------------------------------------------------------------------------- */

export const AuthenticationLayout = ({ children }) => {
	return (
		<Box
			position="fixed"
			top="0"
			left="0"
			width="100vw"
			height="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center"
		>
			<Box
				padding="2rem"
				width="24rem"
				bg="#120F13"
				borderRadius="lg"
				shadow="lg"
			>
				{children}
			</Box>
		</Box>
	);
};

/* -------------------------------------------------------------------------- */
/*                           The register/login form                          */
/* -------------------------------------------------------------------------- */

/* NOTE:
 * While this may be a simple way to reuse the same code for both register/login,
 * I might have to create a separate component if there is the need to create extra
 * input columns in any of the form.
 */

const AuthenticationForm = ({ actionName, actionFunction }) => {
	const columnRules = {
		email: {
			required: true,
		},
		name: {
			required: true,
			alphanumeric: true,
		},
		password: {
			required: true,
		},
	};

	const validateManager = {
		email: (value) => {
			return validateWithRules(columnRules, "E-mail", "email", value);
		},
		name: (value) => {
			return validateWithRules(
				columnRules,
				"Display Name",
				"name",
				value
			);
		},
		password: (value) => {
			return validateWithRules(
				columnRules,
				"Password",
				"password",
				value
			);
		},
	};

	let nameElement = (
		<ValidationInput
			validateManager={validateManager}
			name="name"
			display="Display Name"
			type="text"
		/>
	);
	let initialValues = { email: "", name: "", password: "" };

	// In the login form, there won't be name inputs so just pretend it doesn't exist.
	if (actionName === "Login") {
		nameElement = <></>;
		initialValues = { email: "", password: "" };
	}

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values, actions) => {
				actionFunction(values);
				actions.setSubmitting(false);
			}}
		>
			{(props) => (
				<Form>
					<ValidationInput
						validateManager={validateManager}
						name="email"
						display="Email"
						type="email"
					/>
					{nameElement}
					<ValidationInput
						validateManager={validateManager}
						name="password"
						display="Password"
						type="password"
					/>
					<Button
						colorScheme="blue"
						isLoading={props.isSubmitting}
						type="submit"
						width="100%"
						marginTop="1rem"
					>
						{actionName}
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default AuthenticationForm;
