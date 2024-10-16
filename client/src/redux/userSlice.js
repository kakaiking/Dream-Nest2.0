// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userList: [], // All users fetched from the backend
  },
  reducers: {
    setUsers: (state, action) => {
      state.userList = action.payload;
    },
    updateUserVerifiedState: (state, action) => {
      const { userId, newVerifiedState } = action.payload;
      const user = state.userList.find(user => user._id === userId);
      if (user) {
        user.verified = newVerifiedState;
      }
    },
  },
});

export const { setUsers, updateUserVerifiedState } = userSlice.actions;
export default userSlice.reducer;
