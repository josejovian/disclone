import { Box, Text, Image, Stack, HStack } from "@chakra-ui/react";

const profileSize = "48px";

const Fragment = ({
	picture,
	name = "Chat User",
	timestamp = "unknown",
	message = "Message",
}) => {
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
					src={picture}
					fallbackSrc="https://via.placeholder.com/150"
				/>
			</Box>
			<Stack marginLeft="2rem">
				<Box display="flex" alignItems="center">
					<Text color="#828282" fontWeight="700">
						{name}
					</Text>
					<Text color="#828282" fontSize="0.8rem" marginLeft="2rem">
						{timestamp}
					</Text>
				</Box>
				<Text>{message}</Text>
			</Stack>
		</Box>
	);
};

export default Fragment;
