/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, useToast } from "@chakra-ui/react";

import React, { useState, useRef } from "react";
import {
	mapStateToProps,
	setChannel,
	mapDispatchToProps,
} from "../utility/Redux";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Formik, Field, Form } from "formik";
import AuthenticationForm, {
	AuthenticationLayout,
} from "../components/AuthenticationForm";

import { writeData } from "../utility/Firebase";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";

import { showToast, showErrorToast } from "../utility/ShowToast";

/* -------------------------------------------------------------------------- */
/*                                Register form                               */
/* -------------------------------------------------------------------------- */

const Register = ({ auth, db, login }) => {
	const toast = useToast();
	const toastIdRef = React.useRef();
	const history = useNavigate();

	async function registerAccount(data) {
		let result = null;
		await createUserWithEmailAndPassword(auth, data.email, data.password)
			.then((cred) => {
				const userData = {
					name: data.name,
					role: 'member',
					isMuted: false,
				};
				writeData(db, `user/${cred.user.uid}`, userData);
				login(userData, cred.user.uid);
			})
			.catch((error) => {
				result = error;

				showErrorToast(toast, toastIdRef);
			})
			.then(() => {
				if (result === null) {
					login(true);
					history("/");
					showToast(
						toast,
						toastIdRef,
						"Sign up successful!",
						"You are logged in automatically.",
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
				Sign Up
			</Text>
			<Text
				fontSize="md"
				textAlign="center"
				marginBottom="2rem"
				color="white"
			>
				Already have an account?{" "}
				<Link to="/login">
					<u>Login</u>
				</Link>{" "}
				instead.
			</Text>
			<AuthenticationForm
				actionName="Sign Up"
				actionFunction={registerAccount}
			/>
		</AuthenticationLayout>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
