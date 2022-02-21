/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, Image, Stack, HStack, useToast } from "@chakra-ui/react";

import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";

import { fetchData, writeData } from "../utility/Firebase";
import { getDatabase, ref, set, child, get } from "firebase/database";
import firebase from "firebase/compat/app";

import getInitials, { BoxedInitials } from "../utility/Initials";
import { showErrorToast } from "../utility/ShowToast";

/* -------------------------------------------------------------------------- */
/*             A component for a channel button on the right side.            */
/* -------------------------------------------------------------------------- */

/* TODO:
 * Add a placeholder channel that appears before the actual channels load.
 * At some point it worked, but some changes will have to be done to make it work again.
 */

const Channel = ({ isDummy, database, uid, db, name = "", id, setChannel }) => {
	const toast = useToast();
	const toastIdRef = React.useRef();

	async function prepareChannel() {
		if (isDummy || id === null) return;

		setChannel(id);
		let data = await fetchData(db, `channel/${id}`);
		let members = data.member;
		let exists = members[uid] === undefined ? false : true;
		if (exists) return;

		database
			.ref(`channel/${id}`)
			.child(`countMember`)
			.set(firebase.database.ServerValue.increment(1))
			.then(() => {
				writeData(db, `channel/${id}/member/`, {
					...members,
					[uid]: true,
				});
			})
			.catch((e) => {
				showErrorToast(toast, toastIdRef);
			});
	}

	// This is so that the user is automatically added to Welcome channel
	// if they haven't since everyone arrives at the Welcome channel upon sign up or login.
	// if (id === 0) prepareChannel();

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
			<BoxedInitials
				size="2rem"
				color="#252329"
				initials={getInitials(name)}
			/>
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
