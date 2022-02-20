import {
	Box,
	Text,
	Skeleton,
	HStack,
	SkeletonCircle,
	useToast,
	IconButton,
	Button,
	Image
} from "@chakra-ui/react";

import React, { useRef, useState, useEffect } from "react";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";
import { connect } from "react-redux";

import { writeData, fetchData } from "../utility/Firebase";
import firebase from "firebase/compat/app";

import Channel from "./Channel";
import NewChannel from "./NewChannel";
import { showErrorToast, showToast } from "../utility/ShowToast";
import { MdLogout, MdKeyboardBackspace } from "react-icons/md";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import getInitials, { BoxedInitials, getColor } from "../utility/Initials";

const SkeletonChannel = () => {
	return (
		<HStack marginLeft="32px" marginBottom="8px" padding="4px unset">
			<SkeletonCircle size="32px" />
			<Skeleton width="272px" height="32px" />
		</HStack>
	);
};

const channelSize = "32px";

const LogOut = ({ logout }) => {
	return (
		<IconButton
			colorScheme="red"
			icon={<MdLogout />}
			variant='outline'
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
				system: true,
			},
			countMember: 1,
			property: {
				isReadOnly: false,
			},
		};

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
				props.logout();
				window.location.reload();

			})
			.catch((error) => {
				showErrorToast();
			});
	}

	const ChannelList = () => {
		let channels = props.channels;
		if (channels === null || channels == undefined) channels = [];

		const entries = Object.entries(channels);

		return entries.map((value) => {
			let key = value[0];
			let val = value[1];
			return (
				<Channel key={`channel-${key}-${val.name}`} {...val} id={key} />
			);
		});
	};

	const SideHeader = () => {
		
		if(props.focus !== null) {
			return (
				<Box {...barStyle} justifyContent="flex-start">
					<IconButton
						colorScheme="black"
						icon={<MdKeyboardBackspace />}
						variant='ghost'
						minWidth="0"
						width="2rem"
						height="2rem"
						marginRight="1rem"
						onClick={() => props.removeFocus()}
					/>
					<Text
						lineHeight="1rem"
						fontSize="1.2rem"
						fontWeight="bold"
						fontFamily="Noto Sans"
					>
						All Channels
					</Text>
				</Box>
			);
		} else {
			return (
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
			);
		}
	}

	const SideFooter = () => {
		if(props.user === null) {
			return (
				<>
				</>
			);
		}
		return (
			<>
				<Box {...barStyle} top="unset" bottom="0">
					<BoxedInitials size="2rem" color={getColor(props.user.name)} initials={getInitials(props.user.name)} ignoreFallback={true}/>
					{/* <Box width={channelSize}>
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
					</Box> */}
					<Text
						lineHeight="1rem"
						fontSize="1rem"
						fontFamily="Noto Sans"
					>
						{props.user.name}
					</Text>
					<LogOut logout={logoutAccount} />
				</Box>
			</>
		);
	};

	const SideContentHeader = ({ text }) => {
		return (
			<Text
				lineHeight="1rem"
				fontWeight="600"
				fontFamily="Noto Sans"
				textTransform="uppercase"
				marginBottom="1rem"
			>
				{text}
			</Text>
		);
	};

	const SideContent = () => {
		if (props.channels !== undefined && props.focus === null) {
			return <ChannelList channels={props.channels} />;
		} else if (
			props.channels !== null &&
			props.channels[props.focus] !== undefined &&
			props.channelUsers !== null
		) {
			let ch = JSON.parse(props.channelUsers);
			
			if (ch === null || ch === undefined) ch = {};
			ch = Object.entries(ch);
			const memberList = ch.map((user) => {
				
				const [_userId, _userData] = [user[0], user[1]];

				let _initials = null, _color = 'gray';
				if(_userId !== 'system') {
					_initials = getInitials(_userData.name);
					_color = getColor(_userData.name);
				}

				return (
					<Box
						key={`memberList-${_userId}`}
						width="calc(384px)"
						display="flex"
						flexDirection="row"
						marginLeft="-2rem"
						padding="0.25rem 2rem 0.25rem 2rem"
						marginBottom="0.5rem"
						fontFamily="Noto Sans"
						userSelect="none"
						_hover={{
							backgroundColor: "#3C393F",
						}}
					>
						<BoxedInitials size="2rem" color={_color} initials={_initials} />
						<Text
							color="#BDBDBD"
							lineHeight="2rem"
							marginLeft="1rem"
							letterSpacing="0.2px"
						>
							{_userData.name}
						</Text>
					</Box>
				);
			});

			return (
				<Box marginLeft="2rem" marginTop="2rem">
					<SideContentHeader text="Channel Description" />
					<Text
						fontSize="1rem"
						fontFamily="Noto Sans"
						marginBottom="2rem"
						paddingRight="2rem"
					>
						{props.channels[props.focus].desc}
					</Text>
					<SideContentHeader text="Member List" />
					{memberList}
				</Box>
			);
		} else {
			return <></>;
		}
	};

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
				<SideHeader />
				<Box position="fixed" width="384px" top="4rem" overflowY="auto">
					<SideContent />
				</Box>
				<SideFooter />
			</Box>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Side);
