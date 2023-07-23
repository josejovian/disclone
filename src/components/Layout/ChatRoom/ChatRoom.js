import { Box, Text, useToast, IconButton } from "@chakra-ui/react";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { connect } from "react-redux";
import { MdMenu } from "react-icons/md";
import firebase from "firebase/compat/app";
import InfiniteScroll from "react-infinite-scroll-component";
import Fragment from "./Fragment";
import SendChat from "./SendChat";
import { ChatContainer } from "./ChatContainer";
import {
  mapStateToProps,
  mapDispatchToProps,
  writeData,
  fetchData,
  showErrorToast,
} from "../utility/Firebase";

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

const Main = ({
  database,
  db,
  chats = [],
  user,
  channel,
  channels,
  uid,
  drawer,
  openDrawer,
  closeDrawer,
}) => {
  const toast = useToast();
  const toastIdRef = useRef();

  const display = useMemo(
    () =>
      channel !== null && channels !== null && channels[channel] !== undefined
        ? channels[channel].name
        : "Unknown Channel",
    [channel, channels]
  );

  const cannotSendChat = useMemo(
    () =>
      channel !== null && channels !== null && channels[channel] !== undefined
        ? channels[channel].property.isReadOnly
        : false,
    [channel, channels]
  );

  const mainWidth = { base: "100vw", lg: "calc(100vw - 384px)" };

  const writeChat = useCallback(
    async (id, message) => {
      writeData(`message/${channel}/${id}`, message);
    },
    [channel]
  );

  const sendChat = useCallback(
    async (text) => {
      let id = await fetchData("counter/");

      if (cannotSendChat) return;

      let message = {
        id: id.message,
        author: uid,
        message: text,
        timestamp: new Date().toLocaleString(),
      };

      database
        .ref("counter/")
        .child("message")
        .set(firebase.database.ServerValue.increment(1))
        .then(() => {
          writeChat(id.message, message);
        })
        .catch((e) => {
          showErrorToast(toast, toastIdRef);
        });
    },
    [cannotSendChat, database, toast, uid, writeChat]
  );

  const renderDrawerMask = useMemo(() => {
    return (
      <Box
        id="mask"
        display={drawer !== "" ? "unset" : "none"}
        position="fixed"
        width="100vw"
        height="100vh"
        top="0"
        left="0"
        zIndex="2"
        background="rgba(0.2, 0.2, 0.2, 0.4)"
        onClick={() => closeDrawer()}
      ></Box>
    );
  }, [closeDrawer, drawer]);

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
      {renderDrawerMask}
      <ChatContainer chats={chats} />
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
            display={{ base: "flex", lg: "none" }}
            colorScheme="gray"
            icon={<MdMenu />}
            minWidth="0"
            width="2rem"
            height="2rem"
            marginRight="2rem"
            onClick={() => openDrawer()}
          />
          <Text
            lineHeight="1rem"
            fontSize="1.2rem"
            fontWeight="bold"
            fontFamily="Noto Sans"
          >
            {display}
          </Text>
        </Box>
      </Box>
      <SendChat
        chat={sendChat}
        isDisabled={cannotSendChat}
        mainWidth={mainWidth}
      />
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
