import { Dispatch, SetStateAction } from "react";

export type UserType = {
  id: string;
  name: string;
};

export type UsersType = Record<string, UserType>;

export type ChannelType = {
  id: number;
  name: string;
  desc: string;
  member: Record<string, boolean>;
  property: any;
};

export type StateType<X> = [X, Dispatch<SetStateAction<X>>];

export type MessageType = {
  id: string;
  author: string;
  message: string;
  timestamp: string;
};
