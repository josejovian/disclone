import { Box, Text, useToast } from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import AuthenticationForm, {
	AuthenticationLayout,
} from "../components/AuthenticationForm";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { showToast, showErrorToast } from "../utility/ShowToast";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";
import { connect } from "react-redux";
import { mapStateToProps, setChannel, mapDispatchToProps } from "../utility/Redux";
import { fetchData } from "../utility/Firebase";

const Login = ({ auth, db, login }) => {
	const toast = useToast();
	const toastIdRef = React.useRef();
	const history = useNavigate();

	async function loginAccount(data) {
		let result = null;
		console.log(auth);
		await signInWithEmailAndPassword(auth, data.email, data.password)
			.catch((error) => {
				result = error;
				console.log(error);
				console.log(data);
				showErrorToast(toast, toastIdRef);
			})
			.then(() => {
				if (result === null) {
					console.log("GOOD");
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
			<Text fontSize="xl" fontWeight="bold" textAlign="center" color="white">
				Login
			</Text>
			<Text fontSize="md" textAlign="center" marginBottom="2rem" color="white">
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

