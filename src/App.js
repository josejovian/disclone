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
import { mapStateToProps, mapDispatchToProps } from "./Redux";
import { connect } from "react-redux";

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.PROJECT_ID,
};

const app = firebase.initializeApp(config);
const auth = getAuth();
const db = getDatabase(app);

async function fetchData(link) {
	let promise = new Promise(function (res, rej) {
		get(child(ref(db), link))
			.then((snapshot) => {
				let data = null;
				if (snapshot.exists()) {
					data = snapshot.val();
				}
				res(data);
			})
			.catch((error) => {
				console.log(error);
				rej(error);
			});
	});

	let result = await promise;
	return result;
}

const App = ({ downloadChannel }) => {

	const [init, setInit] = useState(false);

	async function initialize() {
		let rawData = await fetchData(`channel/`);
		downloadChannel(Object.values(rawData));
		console.log(Object.values(rawData));
	}

	useEffect(() => {
		initialize();
	}, [init]);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ChatRoom />} />
			</Routes>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
