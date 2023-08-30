import React, { useCallback } from "react";
import { increment, ref, update } from "firebase/database";
import { Box, Text, useToast } from "@chakra-ui/react";
import { BoxedInitials } from "../../Initials";
import { db, fetchData, showErrorToast } from "../../../utility";
import { ChannelType, StateType, UserType } from "../../../types";

interface ChannelProps {
  isDummy?: boolean;
  channel: ChannelType;
  user: UserType;
  stateSelectedChannel: StateType<number>;
  stateFocus: StateType<boolean>;
}

export function SideChannel({
  isDummy,
  channel,
  user,
  stateSelectedChannel,
  stateFocus,
}: ChannelProps) {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const setSelectedChannel = stateSelectedChannel[1];
  const setFocus = stateFocus[1];
  const { id, name } = channel;
  const { id: userId } = user;

  const handlePrepareChannel = useCallback(async () => {
    if (isDummy) return;

    setFocus(true);
    setSelectedChannel(id);

    const data = await fetchData(`channel/${id}`);
    const members = data.member;

    if (!members[userId] === undefined) return;

    const updates: Record<string, any> = {};
    updates[`channel/${id}/countMember`] = increment(1);
    updates[`channel/${id}/member`] = {
      ...members,
      [userId]: true,
    };

    try {
      await update(ref(db), updates);
    } catch (e) {
      showErrorToast(toast, toastIdRef);
    }
  }, [id, isDummy, setFocus, setSelectedChannel, toast, userId]);

  return (
    <Box
      width="384px"
      display="flex"
      flexDirection="row"
      padding="0.25rem 2rem"
      marginBottom="0.5rem"
      fontFamily="Noto Sans"
      userSelect="none"
      cursor="pointer"
      onClick={handlePrepareChannel}
      _hover={{
        backgroundColor: "#3C393F",
      }}
    >
      <BoxedInitials size="2rem" color="#252329" name={name} />
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
}
