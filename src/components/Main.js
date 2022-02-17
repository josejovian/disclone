import { Box, Text } from "@chakra-ui/react";
import Fragment from "./Fragment";
import SendChat from "./SendChat";
import { useState } from "react";
import { mapStateToProps, setChannel, mapDispatchToProps } from "../Redux";
import { writeData, fetchData } from "../Firebase";
import { connect } from "react-redux";
import { store } from "../index";
import { getDatabase, ref, set, child, get } from "firebase/database";
import firebase from "firebase/compat/app";

const Main = ({
	database,
	db,
	chats = [],
	usersChannel,
	channel,
	channels,
}) => {
	const ChatFragments = chats.map((value, idx) => {
		return <Fragment key={`${idx}-${value}`} data={value} />;
	});

	async function getChatCounter() {
		return await fetchData(db, 'counter/');
	}

	async function sendChat(text) {
		let id = await getChatCounter();
		let message = {
			author: "system",
			message: text,
			timestamp: "Unknown Time",
		};

		writeData(db, `message/${channel}/${id.message}`, message);
		database
			.ref("counter/")
			.child("message")
			.set(firebase.database.ServerValue.increment(1));
	}

	let display =
		channel !== null && channels !== null
			? channels[channel].name
			: "Unknown Channel";

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
			>
				<Box
					display="flex"
					width="calc(100vw - 384px)"
					position="relative"
					justifyContent="flex-start"
					paddingLeft="4rem"
					alignItems="center"
					height="3.2rem"
					zIndex="4"
					bg="#252329"
					shadow="md"
				>
					<Text
						lineHeight="1rem"
						fontSize="1.2rem"
						fontWeight="bold"
						fontFamily="Noto Sans"
					>
						{display}
					</Text>
				</Box>
			</Box>
			<SendChat chat={sendChat} />
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);