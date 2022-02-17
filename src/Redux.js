export function mapStateToProps(state) {
	return {
		channel: state.channel,
		channels: state.channels,
		user: state.user,
		channelUsers: state.channelUsers,
		chats: state.chats,
		db: state.db,
		database: state.database,
	};
}

export function setChannel(channel) {
	return {
		type: "CHANNEL_SWITCH",
		channel: channel,
	};
}

export function setDatabase(database) {
	return {
		type: "DATABASE_INITIALIZE",
		database: database,
	};
}

export function setDb(db) {
	return {
		type: "DB_INITIALIZE",
		db: db,
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

export function login(user) {
	return {
		type: "USER_LOGIN",
		user: user,
	};
}

export function logout() {
	return {
		type: "USER_LOGOUT",
	};
}

export const mapDispatchToProps = {
	setDb,
	setDatabase,
	setChannel,
	downloadChannel,
	chatChannel,
	usersChannel,
	login,
	logout,
};
