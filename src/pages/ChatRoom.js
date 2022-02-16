import { Box } from "@chakra-ui/react";
import Side from "../components/Side";
import Main from "../components/Main";
import { useState } from "react";

const ChatRoom = () => {

	const [currentChannel, setChannel] = useState(0);

	const chats = {
		0: [
			"Hello! "
		]
	}

	return (
		<div>
			<Side />
			<Main />
		</div>
	);
}

export default ChatRoom;
