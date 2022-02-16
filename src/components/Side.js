import { Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import Channel from "./Channel";

const Side = ({ channels }) => {
	useEffect(() => {}, []);

	let Channels = [];
	for (const [key, value] of Object.entries(channels)) {
		Channels.push(
			<Channel key={`channel-${key}-${value.name}`} name={value.name} />
		);
	}
	
	return (
		<Box
			position="fixed"
			width="384px"
			height="100vh"
			top="0"
			left="0"
			bg="#120F13"
		>
			<Box
				display="flex"
				position="fixed"
				width="calc(384px)"
				height="3.2rem"
				top="0"
				left="0"
				paddingLeft="2rem"
				alignItems="center"
				shadow="md"
			>
				<Text
					lineHeight="1rem"
					fontSize="1.2rem"
					fontWeight="bold"
					fontFamily="Noto Sans"
				>
					Channels
				</Text>
			</Box>
			<Box position="fixed" top="4rem">
				{Channels}
			</Box>
		</Box>
	);
};

export default Side;
