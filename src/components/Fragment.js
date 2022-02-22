/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, Stack,Skeleton } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
	mapStateToProps,
	mapDispatchToProps,
} from "../utility/Redux";

import getInitials, { getColor } from "../utility/Initials";
import { BoxedInitials } from "../utility/Initials";

/* -------------------------------------------------------------------------- */
/*           A fragment that represents one, singular chat message.           */
/* -------------------------------------------------------------------------- */

const Fragment = ({ channelUsers, data }) => {
	const [display, setDisplay] = useState("Unknown User");

	useEffect(() => {
		// Prevent errors when trying to read channelUsers[data.author]
		if (channelUsers === null) return;

		const parsedUsers = JSON.parse(channelUsers);
		const author = parsedUsers[data.author];
		
		if(author === undefined) return;

		setDisplay(author.name);
	}, [channelUsers, data.author]);

	if (channelUsers === null) return <Skeleton height="32px" width="32px" />;

	// "System" doesn't get a special initials profile picture.
	let _initials = null,
		_color = "gray";
	if (display !== "Unknown User" && data.author !== "system") {
		_initials = getInitials(display);
		_color = getColor(display);
	}

	return (
		<Box
			display="flex"
			flexDirection="row"
			marginTop="2rem"
			fontFamily="Noto Sans"
		>
			<BoxedInitials size="3rem" color={_color} initials={_initials} />
			<Stack marginLeft="2rem">
				<Box display="flex" alignItems="center">
					<Text color="#828282" fontWeight="700">
						{display}
					</Text>
					<Text color="#828282" fontSize="0.8rem" marginLeft="2rem">
						{data.timestamp}
					</Text>
				</Box>
				<Text>{data.message}</Text>
			</Stack>
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Fragment);
