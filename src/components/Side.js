import {
	Box,
	Text,
	Skeleton,
	HStack,
	SkeletonCircle,
	useToast,
	IconButton,
} from "@chakra-ui/react";

import React, { useRef } from "react";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";
import { connect } from "react-redux";

import { writeData, fetchData } from "../utility/Firebase";
import firebase from "firebase/compat/app";

import Channel from "./Channel";
import NewChannel from "./NewChannel";
import { showErrorToast, showToast } from "../utility/ShowToast";
import { MdLogout } from "react-icons/md";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import getInitials, { getColor } from "../utility/Initials";

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

const channelSize = "32px";

const LogOut = ({ logout }) => {
	return (
		<IconButton
			colorScheme="red"
			icon={<MdLogout />}
			minWidth="0"
			width="2rem"
			height="2rem"
			onClick={logout}
		/>
	);
};

const Side = (props) => {
	const toast = useToast();
	const toastIdRef = React.useRef();
	const history = useNavigate();

	const barStyle = {
		display: "flex",
		position: "fixed",
		width: "calc(384px)",
		height: "3.2rem",
		top: "0",
		left: "0",
		paddingLeft: "2rem",
		paddingRight: "2rem",
		justifyContent: "space-between",
		alignItems: "center",
		shadow: "md",
		zIndex: "4",
	};

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

	async function logoutAccount() {
		signOut(props.auth)
			.then(() => {
				history("/");
				showToast(
					toast,
					toastIdRef,
					"Logout successful!",
					"See you later.",
					"success",
					2000,
					true
				);
			})
			.catch((error) => {
				showErrorToast();
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
				<Box {...barStyle}>
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
				<Box {...barStyle} top="unset" bottom="0">
					<Box width={channelSize}>
						<Box
							display="flex"
							justifyContent="center"
							minWidth={channelSize}
							width={channelSize}
							height={channelSize}
							borderRadius="md"
							background={getColor(props.user.name)}
						>
							<Text
								color="#BDBDBD"
								fontWeight="700"
								lineHeight="2rem"
							>
								{getInitials(props.user.name)}
							</Text>
						</Box>
					</Box>
					<Text
						lineHeight="1rem"
						fontSize="1rem"
						fontFamily="Noto Sans"
					>
						{props.user.name}
					</Text>
					<LogOut logout={logoutAccount} />
				</Box>
				<Box position="fixed" top="4rem">
					<ChannelList channels={props.channels} />
				</Box>
			</Box>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Side);
