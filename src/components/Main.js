import { Box, Text, useToast } from "@chakra-ui/react";

import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
	mapStateToProps,
	setChannel,
	mapDispatchToProps,
} from "../utility/Redux";
import InfiniteScroll from "react-infinite-scroll-component";

import Fragment from "./Fragment";
import SendChat from "./SendChat";

import { writeData, fetchData } from "../utility/Firebase";

import { getDatabase, ref, set, child, get } from "firebase/database";
import firebase from "firebase/compat/app";
import { showErrorToast } from "../utility/ShowToast";
import { store } from "../index";

const ChatFragments = ({ chats=[] }) => {
	/* Reference:
	 * https://blog.logrocket.com/4-ways-to-render-large-lists-in-react/
	 *********/

	const threshold = 10;
	const [count, setCount] = useState({
		prev: Math.max(chats.length - threshold, 0),
		next: chats.length,
	});
	const [hasMore, setHasMore] = useState(true);
	const [current, setCurrent] = useState(chats.slice(count.prev, count.next));
	const [loading, setLoading] = useState(false);
	const [init, setInit] = useState(false);

	const getMoreData = () => {
		const floor = Math.max(count.prev - threshold, 0);

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
	});

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

const Main = ({
	database,
	db,
	chats = [],
	usersChannel,
	channel,
	channels,
	uid,
}) => {
	// const Fragments = chats.map((value, idx) => <Fragment key={`chat-${value.id}`} data={value} />);

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
		channel !== null && channels !== null
			? channels[channel].name
			: "Unknown Channel";

	let cannotSendChat =
		(channel !== null && channels !== null) ? (channels[channel].property.isReadOnly) : false;

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
			id="scrollable"
		>
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
			<SendChat chat={sendChat} isDisabled={cannotSendChat} />
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
