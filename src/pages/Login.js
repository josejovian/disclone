/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, useToast } from "@chakra-ui/react";

import React, { useState, useRef, useEffect } from "react";
import {
	mapStateToProps,
	setChannel,
	mapDispatchToProps,
} from "../utility/Redux";
import { connect } from "react-redux";
import { Link, useNavigate, Redirect } from "react-router-dom";

import { Formik, Field, Form } from "formik";
import AuthenticationForm, {
	AuthenticationLayout,
} from "../components/AuthenticationForm";

import { fetchData } from "../utility/Firebase";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";

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
