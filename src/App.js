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
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
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

const App = ({
	chats,
	channel,
	channels,
	setDatabase,
	setDb,
	setChannel,
	downloadChannel,
	chatChannel,
	usersChannel,
}) => {
	const [init, setInit] = useState(false);

	async function initFirebase() {
		if(setDatabase === undefined)
			return;
		
		setDatabase(firebase.database());
		setDb(db);
	}

	async function initialize() {
		let rawData = await fetchData(db, `channel/`);
		downloadChannel(Object.values(rawData));
		setChannel(0);
	}

	async function getChatOfChannel() {
		let rawData = await fetchData(db, `message/${channel}/`);

		if (rawData === null) return;

		onValue(ref(db, `message/${channel}/`), (snapshot) => {
			console.log(`${channel}`);
			const data = snapshot.val();
			chatChannel(Object.values(data).reverse());
		});
	}

	async function getMemberOfChannel() {
		if (channels === null || channel === null) return;

		let members = channels[channel].member;
		let memberOfChannel = {};

		for await (const memberId of members) {
			let rawData = await fetchData(db, `user/${memberId}/`);
			if(rawData !== null) {
				memberOfChannel = {...memberOfChannel, [memberId]: rawData}
				memberOfChannel[memberId] = rawData;
			}
		}
		
		usersChannel(JSON.stringify(memberOfChannel));
	}

	useEffect(async () => {
		await initFirebase();
		initialize();
	}, [init]);

	useEffect(async () => {
		chatChannel([]);
		await getChatOfChannel();
		await getMemberOfChannel();
	}, [channel, channels]);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ChatRoom />} />
			</Routes>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
