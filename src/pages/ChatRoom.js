import { Box } from "@chakra-ui/react";
import Side from "../components/Side";
import Main from "../components/Main";
import { useState } from "react";

export const channels = {
	0: {
		name: "Welcome",
		property: {
			isReadOnly: true
		}
	},
	1: {
		name: "Front-End Dev",
		property: {
			isReadOnly: false
		}
	},
	2: {
		name: "Gaming",
		property: {
			isReadOnly: false
		}
	}
};

const ChatRoom = () => {

	const [currentChannel, setChannel] = useState(0);

	const chats = {
		0: [
			"Hello! "
		]
	}

	return (
		<div>
			<Side channels={channels}/>
			<Main />
		</div>
	);
}

export default ChatRoom;
