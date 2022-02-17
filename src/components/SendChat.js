import { Box, Input, Icon, IconButton } from "@chakra-ui/react";
import { MdSend } from "react-icons/md";

const profileSize = "64px";

const SendChat = ({ chat }) => {
	function sendChat() {
		let text = document.getElementById("chat");

		let spaces = true;
		for (let i = 0; i < text.value.length; i++) {
			if (text.value[i] != " ") {
				spaces = false;
			}
		}

		if (spaces == true) return;

		chat(text.value);
		text.value = "";
	}

	function enter(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			sendChat();
			
		}
	}

	return (
		<Box position="fixed" width="calc(100% - 384px - 128px)" bottom="2rem">
			<Box
				display="flex"
				position="relative"
				justifyContent="flex-end"
				alignItems="center"
				height="3.5rem"
			>
				<Input
					position="absolute"
					top="0"
					left="0"
					height="3.5rem"
					bg="#3C393F"
					id="chat"
					type="text"
					placeholder="Type message here"
					autoComplete="off"
					onKeyUp={enter}
				/>
				<IconButton
					position="absolute"
					marginRight="0.5rem"
					right="0"
					colorScheme="blue"
					aria-label="Search database"
					icon={<Icon as={MdSend} />}
					zIndex="1"
					onClick={sendChat}
				/>
			</Box>
		</Box>
	);
};

export default SendChat;
