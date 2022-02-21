/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, useToast, IconButton } from "@chakra-ui/react";

import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
	mapStateToProps,
	setChannel,
	mapDispatchToProps,
} from "../utility/Redux";
import { MdMenu } from "react-icons/md";

import { writeData, fetchData } from "../utility/Firebase";
import firebase from "firebase/compat/app";

import InfiniteScroll from "react-infinite-scroll-component";
import Fragment from "./Fragment";
import SendChat from "./SendChat";
import { showErrorToast } from "../utility/ShowToast";

/* -------------------------------------------------------------------------- */
/*              Contains the fragments (all chats) in a channel.              */
/* -------------------------------------------------------------------------- */

const ChatFragments = ({ chats = [] }) => {
	/* Reference (for the infinite scroll):
	 * https://blog.logrocket.com/4-ways-to-render-large-lists-in-react/
	 */

	const range = 10;
	const [count, setCount] = useState({
		prev: Math.max(chats.length - range, 0),
		next: chats.length,
	});
	const [hasMore, setHasMore] = useState(true);
	const [current, setCurrent] = useState(chats.slice(count.prev, count.next));

	const getMoreData = () => {
		const floor = Math.max(count.prev - range, 0);

		setTimeout(() => {
			let newData = chats.slice(floor, count.prev - 1);
			setCurrent(newData.concat(current));
		}, 1000);
		setCount({
			prev: floor,
			next: count.next,
		});
		if (floor === 0) {
			setHasMore(false);
		}
	};

	/* Reference
	 * https://stackoverflow.com/questions/19614069/get-percentage-scrolled-of-an-element-with-jquery
	 *
	 * Used to detect when the element is at top, such that older chats are rendered, if there is any.
	 */
	function checkAndGetMoreData() {
		const root = document.getElementById("scrollable");
		let scrollPercentage =
			(100 * root.scrollTop) / (-root.scrollHeight + root.clientHeight);

		if (hasMore && scrollPercentage >= 99) {
			getMoreData();
		}
	}

	useEffect(() => {
		let element = document.getElementById("scrollable");
		element.onscroll = () => checkAndGetMoreData();
	}, []);

	return (
		<InfiniteScroll
			dataLength={chats.length}
			inverse={true}
			next={getMoreData}
			hasMore={hasMore}
			scrollThreshold="10px"
		>
			<Box
				position="relative"
				paddingTop="3.2rem"
				paddingBottom="7.5rem"
				zIndex="-1"
			>
				{current.map((value, idx) => (
					<Fragment key={`chat-${value.id}`} data={value} />
				))}
			</Box>
		</InfiniteScroll>
	);
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

const Main = ({
	database,
	db,
	chats = [],
	user,
	channel,
	channels,
	uid,
	drawer,
	openDrawer,
	closeDrawer,
}) => {
	const toast = useToast();
	const toastIdRef = React.useRef();

	async function writeChat(id, message) {
		writeData(db, `message/${channel}/${id}`, message);
	}

	async function sendChat(text) {
		let id = await fetchData(db, "counter/");
		let message = {
			id: id.message,
			author: uid,
			message: text,
			timestamp: new Date().toLocaleString(),
		};

		database
			.ref("counter/")
			.child("message")
			.set(firebase.database.ServerValue.increment(1))
			.then(() => {
				writeChat(id.message, message);
			})
			.catch((e) => {
				showErrorToast(toast, toastIdRef);
			});
	}

	let display =
		channel !== null && channels !== null && channels[channel] !== undefined
			? channels[channel].name
			: "Unknown Channel";

	let cannotSendChat =
		channel !== null && channels !== null && channels[channel] !== undefined
			? channels[channel].property.isReadOnly
			: false;

	let mainWidth = { base: "100vw", lg: "calc(100vw - 384px)" };

	const Mask = () => {
		return (
			<Box
				id="mask"
				display={drawer !== "" ? "unset" : "none"}
				position="fixed"
				width="100vw"
				height="100vh"
				top="0"
				left="0"
				zIndex="2"
				background="rgba(0.2, 0.2, 0.2, 0.4)"
				onClick={() => closeDrawer()}
			></Box>
		);
	};

	return (
		<Box
			display="flex"
			flexDirection="column-reverse"
			position="fixed"
			width={mainWidth}
			height="100vh"
			top="0"
			right="0"
			paddingLeft="4rem"
			paddingRight="4rem"
			bg="#252329"
			overflowY="auto"
			id="scrollable"
		>
			<Mask />
			<ChatFragments chats={chats} />
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
					width={mainWidth}
					position="relative"
					justifyContent="flex-start"
					paddingLeft="4rem"
					alignItems="center"
					height="3.2rem"
					zIndex="4"
					bg="#252329"
					shadow="md"
				>
					<IconButton
						colorScheme="gray"
						icon={<MdMenu />}
						minWidth="0"
						width="2rem"
						height="2rem"
						marginRight="2rem"
						onClick={() => openDrawer()}
					/>
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
			<SendChat
				chat={sendChat}
				isDisabled={cannotSendChat}
				mainWidth={mainWidth}
			/>
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
