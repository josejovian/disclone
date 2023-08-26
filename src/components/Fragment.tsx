import { Box, Text, Stack } from "@chakra-ui/react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { BoxedInitials } from "../utility/Initials";
import { MessageType, UserType } from "../types";
import { useIdentity } from "../hooks";

/* -------------------------------------------------------------------------- */
/*           A fragment that represents one, singular chat message.           */
/* -------------------------------------------------------------------------- */

export function Fragment({ data }: { data: MessageType }) {
  const [user, setUser] = useState<UserType>();
  const [initialize, setInitialize] = useState(false);
  const { getUser } = useIdentity();
  const { author: userId } = data;
  const name = useMemo(() => (user ? user.name : ""), [user]);

  const handleInitialize = useCallback(async () => {
    setInitialize(true);

    if (!userId) return;

    const userData = await getUser(userId);

    setUser(userData);
  }, [getUser, userId]);

  useEffect(() => {
    if (!initialize) {
      handleInitialize();
    }
  }, [handleInitialize, initialize]);
  // useEffect(() => {
  //   if (channelUsers === null) return;

  //   const parsedUsers = JSON.parse(channelUsers);
  //   const author = parsedUsers[data.author];

  //   if (author === undefined) return;

  //   setDisplay(author.name);
  // }, [channelUsers, data.author]);

  // if (channelUsers === null) return <Skeleton height="32px" width="32px" />;

  return (
    <Box
      display="flex"
      flexDirection="row"
      marginTop="2rem"
      fontFamily="Noto Sans"
    >
      <BoxedInitials size="3rem" name={name} />
      <Stack marginLeft="2rem">
        <Box display="flex" alignItems="center">
          <Text color="#828282" fontWeight="700">
            {name}
          </Text>
          <Text color="#828282" fontSize="0.8rem" marginLeft="2rem">
            {data.timestamp}
          </Text>
        </Box>
        <Text>{data.message}</Text>
      </Stack>
    </Box>
  );
}
