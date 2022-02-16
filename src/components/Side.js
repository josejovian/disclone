import { Box, Text, Skeleton, HStack, SkeletonCircle } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Channel from "./Channel";
import { mapStateToProps, mapDispatchToProps } from "../Redux";
import { connect } from "react-redux";

const SkeletonChannel = () => {
	return (
		<HStack marginLeft="32px" marginBottom="8px" padding="4px unset">
			<SkeletonCircle size="32px" />
			<Skeleton width="272px" height="32px" />
		</HStack>
	);
};

export const ChannelList = (props) => {
	const [loaded, setLoaded] = useState(false);
	const [Channels, setChannels] = useState(null);
	const channels = props.channels;

	console.log(props);
	let entries = [];
	useEffect(() => {
		console.log(channels);
		if(channels !== null && channels !== undefined && loaded === false) {
			entries = Object.entries(channels);
			const displayChannel = entries.map((value) => {
				console.log(value);
				let key = value[0];
				let val = value[1];
				return (<Channel key={`channel-${key}-${val.name}`} {...val} id={key} />);
			});
			setChannels(displayChannel);
			setLoaded(true);
		}
	});
	
	// const 
	// console.log(displayChannel);

	if (loaded === false)
		return (
			<>
				<SkeletonChannel key="dummy-channel-1" />
				<SkeletonChannel key="dummy-channel-2" />
				<SkeletonChannel key="dummy-channel-3" />
			</>
		);

	return <>{Channels}</>;
};

const Side = (props) => {
	console.log(props);
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
			<Skeleton height="100vh" isLoaded>
				<Box position="fixed" top="4rem">
					<ChannelList {...props}/>
				</Box>
			</Skeleton>
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Side);
