import { createSlice } from "@reduxjs/toolkit";

const userUidFromStorage = localStorage.getItem("uid");
const userEmailfromStorage = localStorage.getItem("email");
const userDisplayNameFromStorage = localStorage.getItem("displayName");
const userPhotoURLFromStorage = localStorage.getItem("photoURL");
const user = {
  uid: userUidFromStorage,
  email: userEmailfromStorage,
  displayName: userDisplayNameFromStorage,
  photoURL: userPhotoURLFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState: user
    ? user
    : {
        uid: "",
        email: "",
        displayName: "",
        photoURL: "",
      },
  reducers: {
    setAuth: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;

      localStorage.setItem("uid", action.payload.uid);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("displayName", action.payload.displayName);
      localStorage.setItem("photoURL", action.payload.photoURL);
    },
    clearAuth: (state) => {
      state.uid = "";
      state.email = "";
      state.displayName = "";
      state.photoURL = "";
      localStorage.clear();
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
