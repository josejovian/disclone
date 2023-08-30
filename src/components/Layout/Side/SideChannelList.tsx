import { ChannelType, StateType, UserType } from "@/src/types";
import { SideChannel } from "./SideChannel";

interface SideChannelListProps {
  channels: Record<string, ChannelType>;
  stateFocus: StateType<boolean>;
  stateSelectedChannel: StateType<number>;
  user: UserType;
}

export function SideChannelList({
  channels,
  stateFocus,
  stateSelectedChannel,
  user,
}: SideChannelListProps) {
  return Object.entries(channels).map(([id, channel]) => (
    <SideChannel
      key={`channel-${id}`}
      stateFocus={stateFocus}
      stateSelectedChannel={stateSelectedChannel}
      channel={{
        ...channel,
        id: Number(id),
      }}
      user={user}
    />
  ));
}
