import { Box, Text, Image, Stack, HStack } from "@chakra-ui/react";

const channelSize = "32px";

const Channel = ({ name }) => {
	function getInitials(str) {
		let initials = "";

		str = str.toUpperCase();

		initials += str[0];

		let space = false;
		for (let i = 1; i < str.length && initials.length < 2; i++) {
			if (str[i] == " ") space = true;
			else if (space == true) {
				initials += str[i];
				space = false;
			}
		}

		return initials;
	}

	return (
		<Box
			width="calc(384px)"
			display="flex"
			flexDirection="row"
			padding="0.25rem 2rem"
			marginBottom="0.5rem"
			fontFamily="Noto Sans"
			userSelect="none"
			cursor="pointer"
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

export default Channel;
