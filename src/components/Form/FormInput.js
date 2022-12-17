import {
	FormControl,
	FormErrorMessage,
	Input,
	Textarea,
} from "@chakra-ui/react";
import { Field } from "formik";
import { useCallback } from "react";

export const FormInput = ({ name, display, type }) => {
	const renderInput = useCallback(
		(field) =>
			type === "textarea" ? (
				<Textarea
					{...field}
					id={name}
					placeholder={display}
					autoComplete="off"
					size="md"
					maxHeight="10rem"
					color="white"
					isRequired
				/>
			) : (
				<Input
					{...field}
					id={name}
					type={type}
					placeholder={display}
					autoComplete="off"
					color="white"
					isRequired
				/>
			),
		[display, name, type]
	);

	return (
		<Field name={name}>
			{({ field, form }) => (
				<FormControl
					marginTop="1rem"
					isInvalid={form.errors[name] && form.touched[name]}
				>
					{renderInput(field)}
					<FormErrorMessage>{form.errors[name]}</FormErrorMessage>
				</FormControl>
			)}
		</Field>
	);
};
