import { Box, Text } from "@chakra-ui/react";
import { SideHeading } from "./SideHeading";
import { SideChannelMember } from "./SideChannelMember";
import { ChannelType } from "@/src/types";

interface SideChannelDescriptionProps {
  channel?: ChannelType;
}

export function SideChannelDescription({
  channel,
}: SideChannelDescriptionProps) {
  return (
    <Box marginLeft="2rem" marginTop="2rem">
      <SideHeading>Channel Description</SideHeading>
      <Text
        fontSize="1rem"
        fontFamily="Noto Sans"
        marginBottom="2rem"
        paddingRight="2rem"
      >
        {channel.desc}
      </Text>
      <SideHeading>Member List</SideHeading>
      {Object.keys(channel.member).map((member) => (
        <SideChannelMember userId={member} key={member} />
      ))}
    </Box>
  );
}
