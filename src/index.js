import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

const initialState = {
	channels: null,
	channel: null,
	user: null,
	channelUsers: null,
	chats: [],
	database: null,
	db: null,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "DATABASE_INITIALIZE":
			return {
				...state,
				database: action.database,
			};
		case "DB_INITIALIZE":
			return {
				...state,
				db: action.db,
			};
		case "CHANNEL_SWITCH":
			return {
				...state,
				channel: action.channel,
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
				channel: action.channels[0],
				user: action.user,
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
