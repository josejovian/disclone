import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { extendTheme } from "@chakra-ui/react";
import { ColorModeScript, ColorModeProvider } from "@chakra-ui/react";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

const theme = extendTheme({ config });

const initialState = {
	channels: null,
	channel: 0,
	user: null,
	channelUsers: null,
	chats: [],
	database: null,
	db: null,
	auth: null,
	focus: 0,
	drawer: "",
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "DRAWER_OPEN":
			return {
				...state,
				drawer: "drawer-open",
			};
		case "DRAWER_CLOSE":
			return {
				...state,
				drawer: "",
			};
		case "CONFIG_INITIALIZE":
			return {
				...state,
				db: action.db,
				database: action.database,
				auth: action.auth,
			};
		case "FOCUS_REMOVE":
			return {
				...state,
				focus: null,
			};
		case "CHANNEL_SWITCH":
			return {
				...state,
				channel: action.channel,
				focus: action.focus,
			};
		case "CHANNEL_ALL":
			return {
				...state,
				channels: action.channels,
			};
		case "CHANNEL_CHAT":
			return {
				...state,
				chats: action.chats,
			};
		case "CHANNEL_USERS":
			return {
				...state,
				channelUsers: action.channelUsers,
			};
		case "USER_LOGIN":
			return {
				...state,
				user: action.user,
				uid: action.uid,
			};
		case "USER_LOGOUT":
			return {
				channels: null,
				channel: null,
				user: null,
			};
		default:
			return state;
	}
};

export const store = createStore(reducer);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider>
				<BrowserRouter>
					<ColorModeScript options={config.initialColorMode} />
					<App />
				</BrowserRouter>
			</ChakraProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
