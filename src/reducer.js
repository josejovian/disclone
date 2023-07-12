import { createSlice } from "@reduxjs/toolkit";

/*
export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "DRAWER_OPEN":
			return {
				...state,
				drawer: "drawer-open",
			};
		case "DRAWER_CLOSE":
			return {
				...state,
				drawer: "",
			};
		case "CONFIG_INITIALIZE":
			return {
				...state,
				db: action.db,
				database: action.database,
				auth: action.auth,
			};
		case "FOCUS_REMOVE":
			return {
				...state,
				focus: null,
			};
		case "CHANNEL_SWITCH":
			return {
				...state,
				channel: action.channel,
				focus: action.focus,
			};
		case "CHANNEL_ALL":
			return {
				...state,
				channels: action.channels,
			};
		case "CHANNEL_CHAT":
			return {
				...state,
				chats: action.chats,
			};
		case "CHANNEL_USERS":
			return {
				...state,
				channelUsers: action.channelUsers,
			};
		case "USER_LOGIN":
			return {
				...state,
				user: action.user,
				uid: action.uid,
			};
		case "USER_LOGOUT":
			return {
				channels: null,
				channel: null,
				user: null,
			};
		default:
			return state;
	}
};
*/

const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      });
    },
    todoToggled(state, action) {
      const todo = state.find((todo) => todo.id === action.payload);
      todo.completed = !todo.completed;
    },
  },
});

export const { todoAdded, todoToggled } = todosSlice.actions;
export default todosSlice.reducer;
