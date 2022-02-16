import { Box, Text } from "@chakra-ui/react";
import Fragment from "./Fragment";
import SendChat from "./SendChat";
import { useState } from "react";

const Main = ({ channel }) => {
	const chats = [
		"Hello there!",
		"What's up?",
		"Lorem ipsum",
		"Gibberish",
		"Asdfghkl",
		"Hello there!",
		"What's up?",
		"Lorem ipsum",
		"Gibberish",
		"Asdfghkl",
		"Hello there!",
		"What's up?",
		"Lorem ipsum",
		"Gibberish",
		"Asdfghkl",
	];

	const [currentChat, setChat] = useState(chats);

	const ChatFragments = currentChat.map((value, idx) => (
		<Fragment key={`${idx}-${value}`} message={`${value}`} />
	));

	function chat(text) {
		console.log("TEXT");
		setChat([...currentChat, text]);
	}

	return (
		<Box
			display="flex"
			flexDirection="column-reverse"
			position="fixed"
			width="calc(100vw - 384px)"
			height="100vh"
			top="0"
			right="0"
			paddingLeft="4rem"
			paddingRight="4rem"
			bg="#252329"
			overflowY="auto"
		>
			<Box
				position="relative"
				paddingTop="3.2rem"
				paddingBottom="7.5rem"
				zIndex="-1"
			>
				{ChatFragments}
			</Box>
			<Box
				display="flex"
				position="fixed"
				height="3.2rem"
				top="0"
				right="0"
				paddingLeft="4rem"
				alignItems="center"
				shadow="md"
			>
				<Box
					display="flex"
					width="calc(100vw - 384px)"
					position="relative"
					justifyContent="flex-start"
					paddingLeft="4rem"
					alignItems="center"
					height="3.5rem"
					zIndex="4"
					bg="#252329"
				>
					<Text
						lineHeight="1rem"
						fontSize="1.2rem"
						fontWeight="bold"
						fontFamily="Noto Sans"
					>
						Welcome
					</Text>
				</Box>
			</Box>
			<SendChat chat={chat} />
		</Box>
	);
};

export default Main;
