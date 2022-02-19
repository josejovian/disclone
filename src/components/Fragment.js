import { Box, Text, Image, Stack, HStack, Skeleton } from "@chakra-ui/react";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import getInitials, { getColor } from "../utility/Initials";
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

	let letterIcon = <></>;

	if (data.author === uid) {
		letterIcon = (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				position="absolute"
				top="0"
				left="0"
				minWidth={profileSize}
				width={profileSize}
				height={profileSize}
				borderRadius="md"
				background={getColor(display)}
			>
				<Text
					color="#BDBDBD"
					fontWeight="700"
					lineHeight="1.6rem"
					fontSize="1.6rem"
					fontFamily="Segoe UI"
				>
					{getInitials(display)}
				</Text>
			</Box>
		);
	}

	return (
		<Box
			display="flex"
			flexDirection="row"
			marginTop="2rem"
			fontFamily="Noto Sans"
		>
			<Box width={profileSize} position="relative">
				<Image
					position="absolute"
					top="0"
					left="0"
					minWidth={profileSize}
					width={profileSize}
					height={profileSize}
					borderRadius="lg"
					src={data.picture}
					fallbackSrc="https://via.placeholder.com/150"
				/>
				{letterIcon}
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
