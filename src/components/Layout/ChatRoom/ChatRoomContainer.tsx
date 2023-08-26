import { useCallback, useMemo, useRef } from "react";
import { Box, Text, useToast, IconButton } from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";
import { increment, ref, update } from "firebase/database";
import { ChatRoomMessages } from "./ChatRoomMessages";
import SendChat from "./ChatRoomSendChat";
import { writeData, fetchData, db, showErrorToast } from "../../../utility";
import { ChannelType, MessageType, StateType, UserType } from "../../../types";

interface ChatRoomContainerProps {
  channel?: ChannelType;
  user: UserType;
  stateChats: StateType<MessageType[]>;
  stateSide: StateType<boolean>;
}

export function ChatRoomContainer({
  user,
  channel,
  stateChats,
  stateSide,
}: ChatRoomContainerProps) {
  const toast = useToast();
  const toastIdRef = useRef();

  const [side, setSide] = stateSide;
  const [chats, setChats] = stateChats;
  const cannotSendChat = channel?.property.isReadOnly;
  const { id: userId } = user;

  const handleSendChat = useCallback(
    async (text) => {
      let newId = await fetchData("counter/");

      if (cannotSendChat) return;

      let message = {
        id: newId.message,
        author: userId,
        message: text,
        timestamp: new Date().toLocaleString(),
      };

      console.log("ID!!");

      const updates: any = {};
      updates[`counter/message`] = increment(1);
      try {
        await update(ref(db), updates);
        writeData(`message/${channel.id}/${message.id}`, message);
      } catch (e) {
        showErrorToast(toast, toastIdRef);
      }

      // database
      //   .ref("counter/")
      //   .child("message")
      //   .set(firebase.database.ServerValue.increment(1))
      //   .then(() => {
      //     writeChat(id.message, message);
      //   })
      //   .catch((e) => {
      //     showErrorToast(toast, toastIdRef);
      //   });
    },
    [cannotSendChat, channel.id, toast, userId]
  );

  const renderMask = useMemo(() => {
    return (
      <Box
        id="mask"
        display={side ? "unset" : "none"}
        position="fixed"
        width="100vw"
        height="100vh"
        top="0"
        left="0"
        zIndex="2"
        background="rgba(0.2, 0.2, 0.2, 0.4)"
        onClick={() => setSide((prev) => !prev)}
      ></Box>
    );
  }, [setSide, side]);

  const renderChat = useMemo(
    () => <ChatRoomMessages channel={channel} chats={chats} />,
    [channel, chats]
  );

  const renderInputChat = useMemo(
    () => (
      <Box
        display="flex"
        position="fixed"
        height="3.2rem"
        top="0"
        right="0"
        paddingLeft="4rem"
        alignItems="center"
      >
        <Box
          display="flex"
          width={mainWidth}
          position="relative"
          justifyContent="flex-start"
          paddingLeft="4rem"
          alignItems="center"
          height="3.2rem"
          zIndex="4"
          bg="#252329"
          shadow="md"
        >
          <IconButton
            aria-label="Toggle Drawer"
            display={{ base: "flex", lg: "none" }}
            colorScheme="gray"
            icon={<MdMenu />}
            minWidth="0"
            width="2rem"
            height="2rem"
            marginRight="2rem"
            onClick={() => setSide((prev) => !prev)}
          />
          <Text
            lineHeight="1rem"
            fontSize="1.2rem"
            fontWeight="bold"
            fontFamily="Noto Sans"
          >
            {channel?.name ?? "Unknown Channel"}
          </Text>
        </Box>
      </Box>
    ),
    [channel?.name, setSide]
  );

  return (
    <Box
      display="flex"
      flexDirection="column-reverse"
      position="fixed"
      width={mainWidth}
      height="100vh"
      top="0"
      right="0"
      paddingLeft="4rem"
      paddingRight="4rem"
      bg="#252329"
      overflowY="auto"
      id="scrollable"
    >
      {renderMask}
      {renderChat}
      {renderInputChat}
      <SendChat
        onSendChat={handleSendChat}
        isDisabled={cannotSendChat}
        // mainWidth={mainWidth}
      />
    </Box>
  );
}

const mainWidth = { base: "100vw", lg: "calc(100vw - 384px)" };
