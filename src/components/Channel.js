import { Box, Text, Image, Stack, HStack, useToast } from "@chakra-ui/react";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";
import { connect } from "react-redux";
import getInitials from "../utility/Initials";
import { fetchData, writeData } from "../utility/Firebase";
import { getDatabase, ref, set, child, get } from "firebase/database";
import firebase from "firebase/compat/app";
import React, { useState, useRef } from "react";
import { showErrorToast } from "../utility/ShowToast";
const channelSize = "32px";

const Channel = ({
	isDummy,
	channels,
	database,
	uid,
	db,
	name = "",
	property,
	id,
	setChannel,
}) => {
	const toast = useToast();
	const toastIdRef = React.useRef();

	async function prepareChannel() {
		if (isDummy) return;

		setChannel(id);

		let data = await fetchData(db, `channel/${id}`);
		let members = data.member;
		let exists = false;

		if (exists) return;

		database
			.ref(`channel/${id}`)
			.child(`countMember`)
			.set(firebase.database.ServerValue.increment(1))
			.then(() => {
				writeData(db, `channel/${id}/member/`, {
					...members,
					uid: true,
				});
			})
			.catch((e) => {
				showErrorToast(toast, toastIdRef);
			});
	}

	return (
		<Box
			width="384px"
			display="flex"
			flexDirection="row"
			padding="0.25rem 2rem"
			marginBottom="0.5rem"
			fontFamily="Noto Sans"
			userSelect="none"
			cursor="pointer"
			onClick={() => prepareChannel()}
			_hover={{
				backgroundColor: "#3C393F",
			}}
		>
			<Box width={channelSize}>
				<Box
					display="flex"
					justifyContent="center"
					minWidth={channelSize}
					width={channelSize}
					height={channelSize}
					borderRadius="md"
					background="#252329"
				>
					<Text color="#BDBDBD" fontWeight="700" lineHeight="2rem">
						{getInitials(name)}
					</Text>
				</Box>
			</Box>
			<Text
				color="#BDBDBD"
				fontWeight="700"
				lineHeight="2rem"
				marginLeft="1rem"
				letterSpacing="0.2px"
			>
				{name}
			</Text>
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
