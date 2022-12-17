import { Text, useToast } from "@chakra-ui/react";
import { useCallback, useMemo, useRef } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
	mapStateToProps,
	mapDispatchToProps,
	showToast,
	showErrorToast,
} from "../utility";
import { AuthLayout, AuthLoginForm } from "../components";

const Login = ({ auth, login }) => {
	const toast = useToast();
	const toastIdRef = useRef();
	const history = useNavigate();

	const handleLoginAccount = useCallback(
		async (data) => {
			let result = null;

			await signInWithEmailAndPassword(auth, data.email, data.password)
				.catch((error) => {
					result = error;

					showErrorToast(toast, toastIdRef);
				})
				.then(() => {
					if (result === null) {
						login(true, true);
						history("/");
						showToast(
							toast,
							toastIdRef,
							"Login successful!",
							"Welcome to Disclone!",
							"success",
							2000,
							true
						);
					}
				});
			return result;
		},
		[auth, history, login, toast]
	);

	const renderAuthHeader = useMemo(
		() => (
			<>
				<Text
					fontSize="xl"
					fontWeight="bold"
					textAlign="center"
					color="white"
				>
					Login
				</Text>
				<Text
					fontSize="md"
					textAlign="center"
					marginBottom="2rem"
					color="white"
				>
					Don't have an account?{" "}
					<Link to="/register">
						<u>Sign Up</u>
					</Link>{" "}
					instead.
				</Text>
			</>
		),
		[]
	);

	return (
		<AuthLayout>
			{renderAuthHeader}
			<AuthLoginForm title="Login" onSubmit={handleLoginAccount} />
		</AuthLayout>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
