import { createContext, ReactNode } from "react";
import { StateType, UserType } from "../types";

export const USER_CONTEXT_DEFAULT: UserType = {
  id: "unknown",
  name: "Unknown User",
};

export const UserContext = createContext<StateType<UserType>>([
  USER_CONTEXT_DEFAULT,
  () => USER_CONTEXT_DEFAULT,
]);

export interface ContextWrapperProps {
  stateUser: StateType<UserType>;
  children: ReactNode;
}

export function ContextWrapper({ stateUser, children }: ContextWrapperProps) {
  return (
    <UserContext.Provider value={stateUser}>{children}</UserContext.Provider>
  );
}
