import * as Yup from "yup";
import { FormInput } from "../Form/FormInput";
import { AuthForm } from "./AuthForm";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Email is required!"),
  password: Yup.string()
    .min(8, "Password is too short!")
    .max(100, "Password is too long!")
    .required("Password is required!"),
});

export const AuthLoginForm = ({ onSubmit }) => {
  const initialValues = { email: "", password: "" };

  return (
    <AuthForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={LoginSchema}
      title="Login"
    >
      <FormInput name="email" display="Email" type="text" />
      <FormInput name="password" display="Pass" type="password" />
    </AuthForm>
  );
};
