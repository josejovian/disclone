export function mapStateToProps(state) {
	return {
		channel: state.channel,
		channels: state.channels,
		user: state.user
	};
}

export function setChannel(channel) {
	return {
		type: "CHANNEL_SWITCH",
		channel: channel,
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
		channels: chats,
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
	setChannel,
	downloadChannel,
	chatChannel,
	login,
	logout,
};
