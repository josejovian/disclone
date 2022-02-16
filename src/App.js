import { Routes, Route, Link } from "react-router-dom";
import Side from "./components/Side";
import Main from "./components/Main";
import ChatRoom from "./pages/ChatRoom";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";
import { useEffect, useState } from "react";
import { mapStateToProps, mapDispatchToProps, setChannel } from "./Redux";
import { connect } from "react-redux";
import { fetchData } from "./Firebase";
const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.PROJECT_ID,
};

const app = firebase.initializeApp(config);
const auth = getAuth();
const db = getDatabase(app);

const App = ({ channel, setChannel, downloadChannel, chatChannel }) => {

	const [init, setInit] = useState(false);

	async function initialize() {
		let rawData = await fetchData(db, `channel/`);
		downloadChannel(Object.values(rawData));
		setChannel(0);
		console.log(Object.values(rawData));
	}

	async function getChatOfChannel(channelId) {
		let rawData = await fetchData(db, `message/${channelId}/`);
		console.log(channelId);
		console.log(rawData);
		if(rawData === null)
			return;
		chatChannel(Object.values(rawData));
	}

	useEffect(() => {
		initialize();
	}, [ init ]);

	useEffect(() => {
		getChatOfChannel(channel);
	}, [ channel ]);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ChatRoom />} />
			</Routes>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
