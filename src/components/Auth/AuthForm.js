import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useCallback } from "react";

export const AuthForm = ({
	initialValues,
	validationSchema,
	onSubmit,
	children,
	title,
}) => {
	const handleSubmitForm = useCallback(
		async (values, actions) => {
			onSubmit(values);
			actions.setSubmitting(false);
		},
		[onSubmit]
	);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmitForm}
		>
			{({ isSubmitting }) => (
				<Form>
					{children}
					<Button
						colorScheme="blue"
						isLoading={isSubmitting}
						type="submit"
						width="100%"
						marginTop="1rem"
					>
						{title}
					</Button>
				</Form>
			)}
		</Formik>
	);
};
