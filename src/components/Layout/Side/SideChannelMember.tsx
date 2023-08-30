import { useCallback, useEffect, useState, useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { BoxedInitials } from "../../Initials";
import { UserType } from "../../../types";
import { useIdentity } from "../../../hooks";

interface SideChannelMemberProps {
  userId: string;
}

export function SideChannelMember({ userId }: SideChannelMemberProps) {
  const [user, setUser] = useState<UserType | null>();
  const [initialize, setInitialize] = useState(false);
  const { getUser } = useIdentity();

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

  const renderContent = useMemo(
    () => (
      <Box
        key={`memberList-${userId}`}
        width="calc(384px)"
        display="flex"
        flexDirection="row"
        marginLeft="-2rem"
        padding="0.25rem 2rem 0.25rem 2rem"
        marginBottom="0.5rem"
        fontFamily="Noto Sans"
        userSelect="none"
        _hover={{
          backgroundColor: "#3C393F",
        }}
      >
        <BoxedInitials size="2rem" name={name} />
        <Text
          color="#BDBDBD"
          lineHeight="2rem"
          marginLeft="1rem"
          letterSpacing="0.2px"
        >
          {name}
        </Text>
      </Box>
    ),
    [name, userId]
  );

  return user ? renderContent : <></>;
}
