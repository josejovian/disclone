import {
  createSlice,
  configureStore,
  ValidateSliceCaseReducers,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useMemo } from "react";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    update_user: (state, action) => {
      state.user = action.payload;
    },
    reset_user(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.user = null;
    },
  },
});

export const { update_user, reset_user } = userSlice.actions as any;

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: {},
  },
  reducers: {
    update_users: (state, action) => {
      const value = {
        ...(state.users ?? {}),
        ...action.payload,
      };
      state.users = value;
    },
    reset_users(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.users = {};
    },
  },
});

export const { update_users, reset_users } = userSlice.actions as any;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    users: usersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type ReducerType<T> = ValidateSliceCaseReducers<
  T | null,
  SliceCaseReducers<T | null>
>;

export function useAppSelector<X extends keyof RootState>(key: X) {
  const value = useSelector<RootState>((state) => state[key]) as RootState[X];

  return useMemo(() => value, [value]);
}
