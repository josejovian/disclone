/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Text, useToast } from "@chakra-ui/react";

import React from "react";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../utility/Redux";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AuthenticationForm, {
	AuthenticationLayout,
} from "../components/AuthenticationForm";

import {
	signInWithEmailAndPassword,
} from "firebase/auth";

import { showToast, showErrorToast } from "../utility/ShowToast";

/* -------------------------------------------------------------------------- */
/*                                 Login form                                 */
/* -------------------------------------------------------------------------- */

const Login = ({ auth, db, login }) => {
	const toast = useToast();
	const toastIdRef = React.useRef();
	const history = useNavigate();

	async function loginAccount(data) {
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
	}

	return (
		<AuthenticationLayout>
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
			<AuthenticationForm
				actionName="Login"
				actionFunction={loginAccount}
			/>
		</AuthenticationLayout>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
