/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Box, Text, useToast, IconButton } from "@chakra-ui/react";
import { MdLogout, MdKeyboardBackspace } from "react-icons/md";

import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../utility/Redux";
import { useNavigate } from "react-router";

import { writeData, fetchData, db, auth } from "../utility/Firebase";
import firebase from "firebase/compat/app";
import { signOut } from "firebase/auth";

import { Channel } from "./Channel";
import NewChannel from "./NewChannel";

import { showErrorToast, showToast } from "../utility/ShowToast";
import { getInitials, BoxedInitials, getColor } from "../utility/Initials";
import { increment, ref, update } from "firebase/database";
import { useUser } from "../hooks";
import { ChannelType, StateType } from "../types";
import { MemberList } from "./MemberList";

export interface SideProps {
  stateChannels: StateType<Record<number, ChannelType>>;
  stateSide: StateType<boolean>;
  stateSelectedChannel: StateType<number>;
}

export function Side({
  stateChannels,
  stateSide,
  stateSelectedChannel,
}: SideProps) {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const stateFocus = useState(false);
  const [focus, setFocus] = stateFocus;

  const history = useNavigate();
  const stateUser = useUser();
  const user = stateUser[0];
  const [side, setSide] = stateSide;
  const channels = stateChannels[0];
  console.log(channels);
  const [selectedChannel, setSelectedChannel] = stateSelectedChannel;
  console.log(selectedChannel);
  const channel = useMemo(
    () => channels[selectedChannel],
    [channels, selectedChannel]
  );

  const barStyle = useMemo<any>(
    () => ({
      display: "flex",
      position: "fixed",
      width: "calc(384px)",
      height: "3.2rem",
      top: "0",
      left: { base: "-384px", lg: "0" },
      paddingLeft: "2rem",
      paddingRight: "2rem",
      justifyContent: "space-between",
      alignItems: "center",
      shadow: "md",
      zIndex: "4",
    }),
    []
  );

  const handleCreateNewChannel = useCallback(
    async (data: any) => {
      let id = await fetchData("counter/");

      let channel = {
        id: id.channel,
        name: data.name,
        desc: data.desc,
        member: {
          system: true,
        },
        countMember: 1,
        property: {
          isReadOnly: false,
        },
      };

      const updates: any = {};
      updates[`counter/channel`] = increment(1);
      updates[`channel/${id.channel}/`] = channel;

      try {
        await update(ref(db), updates);
      } catch (e) {
        showErrorToast(toast, toastIdRef);
      }

      // database
      //   .ref("counter/")
      //   .child("channel")
      //   .set(firebase.database.ServerValue.increment(1))
      //   .then(() => {
      //     writeData(`channel/${id.channel}/`, channel);
      //   })
      //   .catch((e) => {
      //     showErrorToast(toast, toastIdRef);
      //   });
    },
    [toast]
  );

  const handleLogoutAccount = useCallback(() => {
    signOut(auth)
      .then(() => {
        history("/");
        showToast(
          toast,
          toastIdRef,
          "Logout successful!",
          "See you later.",
          "success",
          2000,
          true
        );
        // props.logout();
        // window.location.reload();
      })
      .catch((error) => {
        showErrorToast(toast, toastIdRef);
      });
  }, [history, toast]);

  const renderLogout = useMemo(() => {
    return (
      <IconButton
        aria-label="logout"
        colorScheme="red"
        icon={<MdLogout />}
        variant="outline"
        minWidth="0"
        width="2rem"
        height="2rem"
        onClick={handleLogoutAccount}
      />
    );
  }, [handleLogoutAccount]);

  const renderChannelList = useMemo(
    () =>
      Object.entries(channels).map(([id, channel]) => (
        <Channel
          key={`channel-${id}`}
          stateFocus={stateFocus}
          stateSelectedChannel={stateSelectedChannel}
          channel={{
            ...channel,
            id: Number(id),
          }}
          user={user}
        />
      )),
    [channels, stateFocus, stateSelectedChannel, user]
  );

  /* ------------------------- The top-part of sidebar ------------------------ */

  const renderSideHeader = useMemo(
    () =>
      focus ? (
        <Box {...barStyle} justifyContent="flex-start">
          <IconButton
            aria-label="toggle drawer"
            colorScheme="black"
            icon={<MdKeyboardBackspace />}
            variant="ghost"
            minWidth="0"
            width="2rem"
            height="2rem"
            marginRight="1rem"
            onClick={() => setFocus((prev) => !prev)}
          />
          <Text
            lineHeight="1rem"
            fontSize="1.2rem"
            fontWeight="bold"
            fontFamily="Noto Sans"
          >
            All Channels
          </Text>
        </Box>
      ) : (
        <Box {...barStyle}>
          <Text
            lineHeight="1rem"
            fontSize="1.2rem"
            fontWeight="bold"
            fontFamily="Noto Sans"
          >
            Channels
          </Text>
          <NewChannel newChannel={handleCreateNewChannel} />
        </Box>
      ),
    [focus, barStyle, setFocus, handleCreateNewChannel]
  );

  /* ----------------------- The bottom-part of sidebar ----------------------- */

  const renderSideFooter = useMemo(() => {
    if (!user) {
      return <></>;
    }

    return (
      <>
        <Box {...barStyle} top="unset" bottom="0">
          <BoxedInitials size="2rem" name={user.name} />
          <Text lineHeight="1rem" fontSize="1rem" fontFamily="Noto Sans">
            {user.name}
          </Text>
          {renderLogout}
        </Box>
      </>
    );
  }, [barStyle, renderLogout, user]);

  const renderSideContentHeader = useCallback(({ text }: { text: string }) => {
    return (
      <Text
        lineHeight="1rem"
        fontWeight="600"
        fontFamily="Noto Sans"
        textTransform="uppercase"
        marginBottom="1rem"
      >
        {text}
      </Text>
    );
  }, []);

  const renderChannelDescription = useMemo(
    () =>
      channel && (
        <Box marginLeft="2rem" marginTop="2rem">
          {renderSideContentHeader({
            text: "Channel Description",
          })}
          <Text
            fontSize="1rem"
            fontFamily="Noto Sans"
            marginBottom="2rem"
            paddingRight="2rem"
          >
            {channel.desc}
          </Text>
          {renderSideContentHeader({
            text: "Member List",
          })}
          {Object.keys(channel.member).map((member) => (
            <MemberList userId={member} key={member} />
          ))}
        </Box>
      ),
    [channel, renderSideContentHeader]
  );

  const renderSideContent = useMemo(
    () => (focus ? renderChannelDescription : renderChannelList),
    [focus, renderChannelDescription, renderChannelList]
  );

  return (
    <>
      <Box
        position="fixed"
        width="384px"
        height="100vh"
        top="0"
        left={{ base: "-384px", lg: "0" }}
        bg="#120F13"
        zIndex="4"
        className={side ? "drawer-open" : ""}
        transition="all 0.5s ease-in-out"
      >
        {renderSideHeader}
        <Box position="fixed" width="384px" top="4rem" overflowY="auto">
          {renderSideContent}
        </Box>
        {renderSideFooter}
      </Box>
    </>
  );
}
