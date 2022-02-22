/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Input, Icon, IconButton } from "@chakra-ui/react";
import { MdSend } from "react-icons/md";

/* -------------------------------------------------------------------------- */
/*                      Send chat Input form and Button                       */
/* -------------------------------------------------------------------------- */

const SendChat = ({ chat, isDisabled, mainWidth }) => {
	function sendChat() {
		let text = document.getElementById("chat");

		// Prevent users from sending just spaces.
		let spaces = true;
		for (let i = 0; i < text.value.length; i++) {
			if (text.value[i] !== " ") {
				spaces = false;
			}
		}

		if (spaces === true) return;

		chat(text.value);
		text.value = "";
	}

	// User can also use ENTER to send messages.
	function enter(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			sendChat();
		}
	}

	return (
		<Box
			position="fixed"
			width={{
				base: "calc(100vw - 128px)",
				lg: "calc(100vw - 384px - 128px)",
			}}
			bottom="2rem"
		>
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
					isDisabled={isDisabled}
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
					isDisabled={isDisabled}
				/>
			</Box>
		</Box>
	);
};

export default SendChat;
