import { useState, useEffect, useRef, useMemo } from "react";
import { onValue, ref } from "firebase/database";
import { useToast } from "@chakra-ui/react";
import { Side, ChatRoomContainer } from "../components";
import { useUser } from "../hooks";
import { db } from "../utility";
import { ChannelType, MessageType } from "../types";

export function ChatRoom() {
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

  useEffect(() => {
    onValue(ref(db, `channel/`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        setChannels(data);
        if (!init) setInit(true);
      }
    });
  }, [init, setChannels]);

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

  const renderContent = useMemo(
    () => (
      <>
        <Side
          stateSide={stateSide}
          stateChannels={stateChannels}
          stateSelectedChannel={stateSelectedChannel}
        />
        <ChatRoomContainer
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
}
