import { Box, Text, Image } from "@chakra-ui/react";
import React from "react";

export function BoxedInitials({
	color,
	size,
	initials,
	ignoreFallback = false,
}) {
	let letterWrapperStyle = {
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
		background: color,
		userSelect: "none",
	};

	let letterStyle = {
		color: "#FFFFFF",
		fontSize: `calc(${size} - 1rem)`,
		fontWeight: "700",
		lineHeight: "2rem",
		userSelect: "none",
	};

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
			fallbackSrc="https://via.placeholder.com/150"
		/>
	);

	if (ignoreFallback) {
		fallback = <></>;

		letterWrapperStyle = {
			...letterWrapperStyle,
			position: undefined,
			top: undefined,
			left: undefined,
		};
	}

	let letterIcon = (
		<Box {...letterWrapperStyle}>
			<Text {...letterStyle}>{initials}</Text>
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

	let _min = 1000,
		_max = -1,
		_sum = 0,
		_avg = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		if (_min > char) _min = char;

		if (char > _max) _max = char;

		_sum += char;
	}
	_avg = Math.floor(_sum / str.length);

	/* Reference:
	 * https://flatuicolors.com/palette/defo
	 */
	let palette = [
		"#16a085",
		"#2980b9",
		"#8e44ad",
		"#f39c12",
		"#d35400",
		"#c0392b",
		"#2c3e50",
	];

	const _num =
		Math.floor((str.length * (_avg + _sum)) / (_max - _min)) %
		palette.length;
	// console.log(_num);

	return palette[_num];
}

export function getInitials(str) {
	if (str === undefined || str === null) return;

	let initials = "";

	str = str.toUpperCase();

	initials += str[0];

	let space = false;
	for (let i = 1; i < str.length && initials.length < 2; i++) {
		if (str[i] === " ") space = true;
		else if (space === true) {
			initials += str[i];
			space = false;
		}
	}

	return initials;
}
