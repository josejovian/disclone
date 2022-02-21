export function mapStateToProps(state) {
	return {
		channel: state.channel,
		channels: state.channels,
		uid: state.uid,
		user: state.user,
		channelUsers: state.channelUsers,
		chats: state.chats,
		db: state.db,
		database: state.database,
		auth: state.auth,
		focus: state.focus,
		drawer: state.drawer,
	};
}

export function openDrawer() {
	return {
		type: "DRAWER_OPEN",
		drawer: "drawer-open",
	};
}

export function closeDrawer() {
	return {
		type: "DRAWER_CLOSE",
		drawer: "",
	};
}

export function setChannel(channel) {
	return {
		type: "CHANNEL_SWITCH",
		channel: channel,
		focus: channel,
	};
}

export function removeFocus() {
	return {
		type: "FOCUS_REMOVE",
		focus: null,
	};
}

export function configureFirebase(config) {
	return {
		type: "CONFIG_INITIALIZE",
		db: config.db,
		database: config.database,
		auth: config.auth,
	};
}

export function downloadChannel(channels) {
	return {
		type: "CHANNEL_ALL",
		channels: channels,
	};
}

export function chatChannel(chats) {
	return {
		type: "CHANNEL_CHAT",
		chats: chats,
	};
}

export function sendChat(users) {
	return {
		type: "CHANNEL_CHAT_SEND",
	};
}

export function usersChannel(users) {
	return {
		type: "CHANNEL_USERS",
		channelUsers: users,
	};
}

export function login(user, uid) {
	localStorage.setItem("disclone-user", JSON.stringify(user));
	localStorage.setItem("disclone-uid", uid);
	return {
		type: "USER_LOGIN",
		user: user,
		uid: uid,
	};
}

export function logout() {
	localStorage.removeItem("disclone-user");
	localStorage.removeItem("disclone-uid");
	return {
		type: "USER_LOGOUT",
	};
}

export const mapDispatchToProps = {
	openDrawer,
	closeDrawer,
	configureFirebase,
	setChannel,
	removeFocus,
	downloadChannel,
	chatChannel,
	usersChannel,
	login,
	logout,
};
