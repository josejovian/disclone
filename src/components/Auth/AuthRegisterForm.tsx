import * as Yup from "yup";
import { FormInput } from "../Form/FormInput";
import { AuthForm } from "./AuthForm";

const RegisterSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email!").required("Email is required!"),
	name: Yup.string()
		.min(4, "Name is too short!")
		.max(50, "Name is too long!")
		.required("Name is required!"),
	password: Yup.string()
		.min(8, "Password is too short!")
		.max(100, "Password is too long!")
		.required("Password is required!"),
});

export const AuthRegisterForm = ({ onSubmit }) => {
	const initialValues = { email: "", name: "", password: "" };

	return (
		<AuthForm
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={RegisterSchema}
			title="Sign Up"
		>
			<FormInput name="email" display="Email" type="text" />
			<FormInput name="name" display="First Name" type="text" />
			<FormInput name="password" display="Pass" type="password" />
		</AuthForm>
	);
};
