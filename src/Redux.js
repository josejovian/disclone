export function mapStateToProps(state) {
	return {
		channel: state.channel,
	};
}

export function setChannel(channel) {
	return {
		type: "SWITCH",
		channel: channel,
	};
}

export function login(user) {
	return {
		type: "LOGIN",
		user: user,
	};
}

export function logout() {
	return {
		type: "LOGOUT",
	};
}

export const mapDispatchToProps = {
	setChannel,
	login,
	logout,
};
