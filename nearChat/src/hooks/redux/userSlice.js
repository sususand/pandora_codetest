import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    nearLists: [],
    chatLists: [],
    token: "",
  },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },

    setNearLists(state, action) {
      return {
        ...state,
        nearLists: action.payload, // Set nearLists to the payload data
      };
    },
    setChatLists(state, action) {
      return {
        ...state,
        chatLists: action.payload, // Set nearLists to the payload data
      };
    },
  },
});

export const { setUserData, setNearLists, setChatLists } = userSlice.actions;

export default userSlice.reducer;
