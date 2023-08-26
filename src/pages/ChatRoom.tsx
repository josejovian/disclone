import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Side } from "../components/Side";
import { Main } from "../components/Main";
import { onValue, ref } from "firebase/database";
import { db } from "../utility";
import { ChannelType, MessageType } from "../types";
import { useToast } from "@chakra-ui/react";
import { useUser } from "../hooks";

const ChatRoom = () => {
  const stateSide = useState(false);
  const stateChannels = useState<Record<number, ChannelType>>({});
  const [channels, setChannels] = stateChannels;

  const stateSelectedChannel = useState<number>(0);
  const [selectedChannel, setSelectedChannel] = stateSelectedChannel;

  const stateMessages = useState<MessageType[]>([]);
  const [messages, setMessages] = stateMessages;

  const [init, setInit] = useState(false);

  const channel = useMemo<ChannelType>(
    () =>
      init
        ? channels[selectedChannel]
        : {
            id: 0,
            name: "Unknown Channel",
            desc: "XXX",
            member: {},
            property: {},
          },
    [channels, init, selectedChannel]
  );

  const [user, setUser] = useUser();

  const toast = useToast();
  const toastIdRef = useRef();
  // const history = useNavigate();

  // Force dark mode, I can't figure out the Chakra UI method to do this.
  // if (localStorage.getItem("chakra-ui-color-mode") !== "dark") {
  //   localStorage.setItem("chakra-ui-color-mode", "dark");
  //   history("/");
  // }

  // const getChannels = useCallback(() => {
  //   onValue(ref(db, `channel/`), (snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.val();
  //       console.log("Get Channels:");
  //       console.log(data);
  //       downloadChannel(data);
  //     }
  //   });
  //   setInit(true);
  // }, [downloadChannel]);

  useEffect(() => {
    onValue(ref(db, `channel/`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        setChannels(data);
        if (!init) setInit(true);
      }
    });
  }, [init, setChannels]);

  // const initialize = useCallback(async () => {
  //   if (init || user === null) return;

  //   let rawData = await fetchData(`channel/`);
  //   console.log(rawData);
  //   downloadChannel(rawData);
  //   setChannel(0);

  //   getChannels();
  // }, [downloadChannel, getChannels, init, setChannel, user]);

  // const handleSwitchChannelData = useCallback(async () => {
  //   let members = channels[channel].member;
  //   let memberOfChannel = {};

  //   for await (const [memberId, status] of Object.entries(members)) {
  //     let rawData = await fetchData(`user/${memberId}/`);
  //     if (rawData !== null) {
  //       memberOfChannel = {
  //         ...memberOfChannel,
  //         [memberId]: rawData,
  //       };
  //       memberOfChannel[memberId] = rawData;
  //     }
  //   }

  //   const stringified = JSON.stringify(memberOfChannel);
  //   usersChannel(stringified);
  // }, [channel, channels, usersChannel]);

  // useEffect(() => {
  //   if (!channel || !channels || !channels[channel]) {
  //     return;
  //   }

  //   handleSwitchChannelData();
  // }, [channel, channels, chatChannel, handleSwitchChannelData]);

  useEffect(() => {
    onValue(ref(db, `message/${selectedChannel}/`), (snapshot) => {
      if (snapshot.exists()) {
        console.log("On Value");
        const data = snapshot.val();
        console.log(data);
        setMessages(Object.values(data));
      }
    });
  }, [selectedChannel, setMessages]);

  // useEffect(() => {
  //   initialize();
  // }, [initialize]);

  const renderContent = useMemo(
    () => (
      <>
        <Side
          stateSide={stateSide}
          stateChannels={stateChannels}
          stateSelectedChannel={stateSelectedChannel}
        />
        <Main
          stateChats={stateMessages}
          stateSide={stateSide}
          user={user}
          channel={channel}
        />
      </>
    ),
    [
      channel,
      stateChannels,
      stateMessages,
      stateSelectedChannel,
      stateSide,
      user,
    ]
  );

  return <div>{init && renderContent}</div>;
};

export default ChatRoom;
