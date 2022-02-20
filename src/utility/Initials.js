import { Box, Text, Image, Stack, HStack, useToast } from "@chakra-ui/react";

export function BoxedInitials({
	color,
	size,
	initials,
	ignoreFallback = false,
}) {

	let letterStyle = {
		position: "absolute",
		top: "0",
		left: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: size,
		width: size,
		height: size,
		borderRadius: "md",
		background: color
	}

	let fallback = (
		<Image
			position="absolute"
			top="0"
			left="0"
			minWidth={size}
			width={size}
			height={size}
			borderRadius="lg"
			src="https://via.placeholder.com/150"
		/>
	);

	if (ignoreFallback) {
		fallback = (
			<>
			</>
		);

		letterStyle = {
			...letterStyle,
			position: undefined,
			top: undefined,
			left: undefined
		}
	}

	let letterIcon = (
		<Box
			{...letterStyle}
		>
			<Text
				color="#BDBDBD"
				fontSize={`calc(${size} - 1rem)`}
				fontWeight="700"
				lineHeight="2rem"
			>
				{initials}
			</Text>
		</Box>
	);

	if (initials === null) {
		letterIcon = <></>;
	}

	return (
		<Box position="relative" width={size}>
			{fallback}
			{letterIcon}
		</Box>
	);
}

export function getColor(str) {
	if (str === undefined || str === null) return;

	while (str.length < 6) {
		str += str;
	}

	let res = [50, 50, 50];

	for (let i = 0; i < 3; i++) {
		const idx = 2 * i + 1;
		let sign = (i + str.length) % 2 === 0 ? -1 : 1;
		
		res[i] += (sign * (str.charCodeAt(idx - 1) + str.charCodeAt(idx))) % 130;
		if(str.length % 3 === i) {
			res[i] = 50;
		}
	}

	return `rgb(${res[0]},${res[1]},${res[2]})`;
}

export default function getInitials(str) {
	if (str === undefined || str === null) return;

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
