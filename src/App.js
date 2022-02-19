import { Routes, Route, Link } from "react-router-dom";
import Side from "./components/Side";
import Main from "./components/Main";
import ChatRoom from "./pages/ChatRoom";
import Register from "./pages/Register";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import {
	mapStateToProps,
	mapDispatchToProps,
	setChannel,
	logout,
} from "./utility/Redux";
import { connect } from "react-redux";
import { fetchData } from "./utility/Firebase";
import { Navigate, Switch, Outlet } from "react-router";
import Login from "./pages/Login";
import { showErrorToast } from "./utility/ShowToast";

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

const App = ({
	auth,
	chats,
	uid,
	channel,
	channels,
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

	/*
	 * Firebase
	 * Functions
	 * * * * * * * * * * */

	// async function configureFirebase() {
	// setDatabase(firebase.database());
	if (db !== c_db || auth !== c_auth || database !== c_database) {
		configureFirebase({
			db: c_db,
			auth: c_auth,
			database: c_database,
		});
	}

	async function initialize() {
		let rawData = await fetchData(c_db, `channel/`);
		downloadChannel(Object.values(rawData));
		setChannel(0);
	}

	async function getChannels() {
		onValue(ref(c_db, `channel/`), (snapshot) => {
			if (
				snapshot.exists() &&
				Object.values(snapshot.val()) !== channels
			) {
				const data = snapshot.val();
				downloadChannel(Object.values(data));
			}
		});
	}

	async function getChatOfChannel() {
		if (channel === undefined) return;
		onValue(ref(c_db, `message/${channel}/`), (snapshot) => {
			if (snapshot.exists() && Object.values(snapshot.val()) !== chats) {
				const data = snapshot.val();
				chatChannel(Object.values(data));
			}
		});
	}

	async function getMemberOfChannel() {
		if (channels === null || channel === null) return;

		let members = channels[channel].member;
		let memberOfChannel = {};

		for await (const [memberId, status] of Object.entries(members)) {
			let rawData = await fetchData(c_db, `user/${memberId}/`);
			if (rawData !== null) {
				memberOfChannel = { ...memberOfChannel, [memberId]: rawData };
				memberOfChannel[memberId] = rawData;
			}
		}

		usersChannel(JSON.stringify(memberOfChannel));
	}

	useEffect(async () => {
		// await configureFirebase();
		await initialize();
		await getChannels();
	}, [init]);

	useEffect(async () => {
		chatChannel([]);
		await getChatOfChannel();
		await getMemberOfChannel();
	}, [channel, channels]);

	/*
	 * Authentication
	 * Functions
	 * * * * * * * * * * */

	const PrivateRoute = () => {
		return user ? <Outlet /> : <Navigate to="/login" />;
	};

	useEffect(async () => {
		c_auth.onAuthStateChanged((c_user) => {
			if (c_user.uid === uid) return;
			if (c_user) {
				if (c_user.uid !== uid) {
					get(child(ref(c_db), `user/${c_user.uid}`))
						.then((snapshot) => {
							if (snapshot.exists()) {
								login(snapshot.val(), c_user.uid);
							}
						})
						.catch((error) => {
							showErrorToast();
						});
				}
			} else {
				logout();
			}
		});
	}, [user, uid]);

	return (
		<div className="App">
			<Routes>
				<Route exact path="/" element={<PrivateRoute />}>
					<Route exact path="/" element={<ChatRoom />} />
				</Route>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
