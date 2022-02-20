import { Box, Text, Image, Stack, HStack, Skeleton } from "@chakra-ui/react";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import getInitials, { getColor } from "../utility/Initials";
import { BoxedInitials } from "../utility/Initials";
const profileSize = "48px";

const Fragment = ({ key, channelUsers, data, uid }) => {
	const [display, setDisplay] = useState("Unknown User");

	useEffect(() => {
		if (channelUsers === null) return;

		channelUsers = JSON.parse(channelUsers);
		const author = channelUsers[`'${data.author}'`];

		setDisplay(channelUsers[data.author].name);
	}, [channelUsers]);

	if (channelUsers === null) return <Skeleton height="32px" width="32px" />;

	let _initials = null, _color = 'gray';
	if(display !== "Unknown User" && data.author !== "system") {
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
