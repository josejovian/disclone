export function mapStateToProps(state) {
	return {
		channel: state.channel,
		channels: state.channels,
		user: state.user
	};
}

export function setChannel(channel, channels) {
	console.log(`Set Channel: ${channel}`);
	return {
		type: "CHANNEL_SWITCH",
		channel: channels[channel],
	};
}

export function downloadChannel(channels) {
	return {
		type: "CHANNEL_DOWNLOAD",
		channels: channels,
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
	login,
	logout,
};
