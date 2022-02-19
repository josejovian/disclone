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
		auth: state.auth
	};
}

export function setChannel(channel) {
	return {
		type: "CHANNEL_SWITCH",
		channel: channel,
	};
}

export function configureFirebase(config) {
	console.log("CONFIGURE FIREBASE!!!!!!!!!!!");
	return {
		type: "CONFIG_INITIALIZE",
		db: config.db,
		database: config.database,
		auth: config.auth
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
	return {
		type: "USER_LOGIN",
		user: user,
		uid: uid,
	};
}

export function logout() {
	return {
		type: "USER_LOGOUT",
	};
}

export const mapDispatchToProps = {
	configureFirebase,
	setChannel,
	downloadChannel,
	chatChannel,
	usersChannel,
	login,
	logout,
};
