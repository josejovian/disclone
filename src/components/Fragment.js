import { Box, Text, Image, Stack, HStack, Skeleton } from "@chakra-ui/react";
import { mapStateToProps, mapDispatchToProps } from "../Redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

const profileSize = "48px";

const Fragment = ({ channelUsers, data }) => {
	const [display, setDisplay] = useState("Unknown User");

	useEffect(() => {
		// console.log(Object.values(channelUsers));
		if (channelUsers === null) return;
		// channelUsers = Object.values(channelUsers);
		console.log(channelUsers);
		channelUsers = JSON.parse(channelUsers);
		const author = channelUsers[`'${data.author}'`];
		console.log(channelUsers[data.author]);
		setDisplay(channelUsers[data.author].name);
	}, [channelUsers]);

	if (channelUsers === null) return <Skeleton height="32px" width="32px" />;

	return (
		<Box
			display="flex"
			flexDirection="row"
			marginTop="2rem"
			fontFamily="Noto Sans"
		>
			<Box width={profileSize}>
				<Image
					minWidth={profileSize}
					width={profileSize}
					height={profileSize}
					borderRadius="lg"
					src={data.picture}
					fallbackSrc="https://via.placeholder.com/150"
				/>
			</Box>
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
