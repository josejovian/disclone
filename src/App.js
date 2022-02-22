/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, useToast } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./utility/Redux";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, onValue } from "firebase/database";

import { fetchData } from "./utility/Firebase";
import Login from "./pages/Login";
import { showErrorToast } from "./utility/ShowToast";

import ChatRoom from "./pages/ChatRoom";
import Register from "./pages/Register";

/* -------------------------------------------------------------------------- */
/*                           Firebase Configuration                           */
/* -------------------------------------------------------------------------- */

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.PROJECT_ID,
};

const c_app = firebase.initializeApp(config);
const c_auth = getAuth();
const c_db = getDatabase(c_app);
const c_database = firebase.database();

/* -------------------------------------------------------------------------- */
/*                             Main App Component                             */
/* -------------------------------------------------------------------------- */

const App = ({
	auth,
	chats,
	uid,
	channel,
	channels,
	channelUsers,
	db,
	database,
	configureFirebase,
	setChannel,
	downloadChannel,
	chatChannel,
	usersChannel,
	user,
	login,
	logout,
}) => {
	const [init, setInit] = useState(false);
	const [init_2, setInit_2] = useState(false);
	const [logged, setLogged] = useState(false);

	const toast = useToast();
	const toastIdRef = React.useRef();
	const history = useNavigate();

	// Force dark mode, I can't figure out the Chakra UI method to do this.
	if (localStorage.getItem("chakra-ui-color-mode") !== "dark") {
		localStorage.setItem("chakra-ui-color-mode", "dark");
		history("/");
	}

	/* ------------------------ Database Functionalities ------------------------ */

	// Makes sure that all database-related stuff are properly stored in redux for use
	// in other components.
	useEffect(() => {
		if (
			init_2 === false &&
			(db !== c_db || auth !== c_auth || database !== c_database)
		) {
			configureFirebase({
				db: c_db,
				auth: c_auth,
				database: c_database,
			});
			setInit_2(true);
		}
	}, [init_2, db, auth, database, configureFirebase, setInit]);

	const initialize = useCallback(async () => {
		if (user === null) return;

		let rawData = await fetchData(c_db, `channel/`);
		downloadChannel(rawData);
		setChannel(0);
	}, [downloadChannel, setChannel, user]);

	const getChannels = useCallback(() => {
		onValue(ref(c_db, `channel/`), (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				downloadChannel(data);
			}
		});
		setInit(true);
	}, [downloadChannel]);

	useEffect(() => {
		if (init === true || user === null) return;
		async function _initialize() {
			await initialize();
			await getChannels();
		}
		_initialize();
	}, [user, init, getChannels, initialize]);

	useEffect(() => {
		if (channel === null) {
			return;
		}

		const switchChannelData = async () => {
			if (
				channels === null ||
				channel === null ||
				channels[channel] === undefined
			)
				return;

			const getChatOfChannel = () => {
				if (channel === undefined) return;
				onValue(ref(c_db, `message/${channel}/`), (snapshot) => {
					if (snapshot.exists()) {
						const data = snapshot.val();
						chatChannel(Object.values(data));
					}
				});
			};

			const getMemberOfChannel = async () => {
				if (
					channels === null ||
					channel === null ||
					channels[channel] === undefined
				)
					return;

				let members = channels[channel].member;
				let memberOfChannel = {};

				for await (const [memberId, status] of Object.entries(
					members
				)) {
					let rawData = await fetchData(c_db, `user/${memberId}/`);
					if (rawData !== null) {
						memberOfChannel = {
							...memberOfChannel,
							[memberId]: rawData,
						};
						memberOfChannel[memberId] = rawData;
					}
				}

				const stringified = JSON.stringify(memberOfChannel);
				usersChannel(stringified);
			};

			await getChatOfChannel();
			await getMemberOfChannel();
		};

		switchChannelData();
	}, [channel, channels, chatChannel, usersChannel]);

	/* --------------------- Authentication Functionalities --------------------- */

	/* Reference:
	 * https://stackoverflow.com/a/69869761
	 */
	const PrivateRoute = () => {
		let ls_user = localStorage.getItem("disclone-user");
		let ls_uid = localStorage.getItem("disclone-uid");

		if (user === null && ls_uid !== null) {
			login(JSON.parse(ls_user), ls_uid);
		}

		return ls_user ? <Outlet /> : <Navigate to="/login" />;
	};

	useEffect(() => {
		c_auth.onAuthStateChanged((c_user) => {
			if (logged && c_user !== null) return;
			if (!logged && c_user !== null) {
				get(child(ref(c_db), `user/${c_user.uid}`))
					.then((snapshot) => {
						if (snapshot.exists()) {
							login(snapshot.val(), c_user.uid);
							setLogged(true);
						}
					})
					.catch((error) => {
						showErrorToast(toast, toastIdRef);
					});
			}
		});
	}, [user, uid, login, logged, toast]);

	return (
		<Box className="App">
			<Routes>
				<Route exact path="/" element={<PrivateRoute />}>
					<Route exact path="/" element={<ChatRoom />} />
				</Route>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
