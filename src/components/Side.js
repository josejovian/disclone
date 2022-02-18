import {
	Box,
	Text,
	Skeleton,
	HStack,
	SkeletonCircle,
	useToast,
} from "@chakra-ui/react";

import React, { useRef } from "react";
import { mapStateToProps, mapDispatchToProps } from "../Redux";
import { connect } from "react-redux";

import { writeData, fetchData } from "../Firebase";
import firebase from "firebase/compat/app";

import Channel from "./Channel";
import NewChannel from "./NewChannel";
import { showErrorToast } from "./ShowToast";

const SkeletonChannel = () => {
	return (
		<HStack marginLeft="32px" marginBottom="8px" padding="4px unset">
			<SkeletonCircle size="32px" />
			<Skeleton width="272px" height="32px" />
		</HStack>
	);
};

export const ChannelList = ({ channels = [] }) => {
	if (channels === null || channels == undefined) channels = [];

	const entries = Object.entries(channels);

	return entries.map((value) => {
		let key = value[0];
		let val = value[1];
		return <Channel key={`channel-${key}-${val.name}`} {...val} id={key} />;
	});
};

const Side = (props) => {
	const toast = useToast();
	const toastIdRef = React.useRef();

	async function newChannel(data) {
		let id = await fetchData(props.db, "counter/");

		let channel = {
			name: data.name,
			desc: data.desc,
			member: {
				0: "system",
			},
			countMember: 1,
			property: {
				isReadOnly: false,
			},
		};

		let status = true;
		props.database
			.ref("counter/")
			.child("channel")
			.set(firebase.database.ServerValue.increment(1))
			.then(() => {
				writeData(props.db, `channel/${id.channel}/`, channel);
			})
			.catch((e) => {
				showErrorToast(toast, toastIdRef);
			});
	}

	return (
		<>
			<Box
				position="fixed"
				width="384px"
				height="100vh"
				top="0"
				left="0"
				bg="#120F13"
				zIndex="4"
			>
				<Box
					display="flex"
					position="fixed"
					width="calc(384px)"
					height="3.2rem"
					top="0"
					left="0"
					paddingLeft="2rem"
					paddingRight="2rem"
					justifyContent="space-between"
					alignItems="center"
					shadow="md"
					zIndex="4"
				>
					<Text
						lineHeight="1rem"
						fontSize="1.2rem"
						fontWeight="bold"
						fontFamily="Noto Sans"
					>
						Channels
					</Text>
					<NewChannel newChannel={newChannel} />
				</Box>
				<Skeleton height="100vh" isLoaded>
					<Box position="fixed" top="4rem">
						<ChannelList channels={props.channels} />
					</Box>
				</Skeleton>
			</Box>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Side);
