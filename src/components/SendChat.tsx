/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Input, Icon, IconButton } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { MdSend } from "react-icons/md";

/* -------------------------------------------------------------------------- */
/*                      Send chat Input form and Button                       */
/* -------------------------------------------------------------------------- */

interface SendChatProps {
  onSendChat: (chat: string) => void;
  isDisabled?: boolean;
  mainWidth?: number;
}

export function SendChat({ onSendChat, isDisabled, mainWidth }: SendChatProps) {
  const [chat, setChat] = useState("");

  const sendChat = useCallback(() => {
    let spaces = true;
    for (let i = 0; i < chat.length; i++) {
      if (chat[i] !== " ") {
        spaces = false;
      }
    }

    if (spaces === true) return;
    onSendChat(chat);
    setChat("");
  }, [chat, onSendChat]);

  const enter = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        sendChat();
      }
    },
    [sendChat]
  );

  return (
    <Box
      position="fixed"
      width={{
        base: "calc(100vw - 128px)",
        lg: "calc(100vw - 384px - 128px)",
      }}
      bottom="2rem"
    >
      <Box
        display="flex"
        position="relative"
        justifyContent="flex-end"
        alignItems="center"
        height="3.5rem"
      >
        <Input
          position="absolute"
          top="0"
          left="0"
          height="3.5rem"
          bg="#3C393F"
          id="chat"
          type="text"
          placeholder="Type message here"
          autoComplete="off"
          onKeyUp={enter}
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          isDisabled={isDisabled}
        />
        <IconButton
          position="absolute"
          marginRight="0.5rem"
          right="0"
          colorScheme="blue"
          aria-label="Search database"
          icon={<Icon as={MdSend} />}
          zIndex="1"
          onClick={sendChat}
          isDisabled={isDisabled || chat.length === 0}
        />
      </Box>
    </Box>
  );
}

export default SendChat;
