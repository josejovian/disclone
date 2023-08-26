import { Box, Text } from "@chakra-ui/react";

export const AuthLayout = ({ children }) => {
	return (
		<Box
			position="fixed"
			top="0"
			left="0"
			width="100vw"
			height="100vh"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box
				padding="2rem"
				width="24rem"
				bg="#120F13"
				borderRadius="lg"
				shadow="lg"
			>
				{children}
			</Box>
			<Text fontSize="0.8rem" marginTop="0.5rem">
				Created by&nbsp;
				<a href="https://github.com/josejovian" title="Jose Jovian">
					josejovian
				</a>
				&nbsp;-&nbsp;
				<a href="https://devchallenges.io/" title="Dev Challenges">
					devChallenges.io
				</a>
			</Text>
		</Box>
	);
};
