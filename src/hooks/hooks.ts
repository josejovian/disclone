import { useCallback, useContext, useMemo } from "react";
import { UserContext } from "../components/ContextWrapper";
import { useDispatch } from "react-redux";
import { UserType, UsersType } from "../types";
import { update_users, useAppSelector, userSlice, usersSlice } from "../redux";
import { fetchData } from "../utility/index";

export function useUser() {
  const stateUser = useContext(UserContext);
  return useMemo(() => stateUser, [stateUser]);
}

export function useIdentity() {
  const dispatch = useDispatch();

  const users = useAppSelector("users");

  const updateUsers = useCallback(
    (newUsers: Record<string, UserType>) => {
      // console.log(usersSlice);
      dispatch(usersSlice.actions.update_users(newUsers));
    },
    [dispatch]
  );

  const getUser = useCallback(
    async (userId: string, usersObject?: Record<string, UserType>) => {
      const known = {
        ...users,
        ...usersObject,
      };

      if (known[userId]) {
        console.log("Recycle Existing Data");
        return known[userId];
      } else {
        console.log("Fetch New Data");
        const rawData = await fetchData(`user/${userId}`);

        if (rawData) {
          const userData = {
            ...rawData,
            id: userId,
          } as UserType;

          updateUsers({
            [userId]: userData,
          });

          return userData;
        }

        return null;
      }
    },
    [updateUsers, users]
  );

  return useMemo(
    () => ({
      updateUsers,
      getUser,
    }),
    [getUser, updateUsers]
  );
}
