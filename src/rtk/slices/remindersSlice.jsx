import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

export const fetchReminders = createAsyncThunk(
  "reminders/fetchReminders",
  async (uid) => {
    const response = collection(db, "users", uid, "reminders");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const addNewReminder = createAsyncThunk(
  "reminders/addNewReminder",
  async ({ uid, reminder }) => {
    const remindersRef = collection(db, "users", uid, "reminders");
    await addDoc(remindersRef, reminder);
    const snapshot = await getDocs(remindersRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const deleteReminder = createAsyncThunk(
  "reminders/deleteReminder",
  async ({ uid, reminderId }) => {
    const reminderRef = doc(db, "users", uid, "reminders", reminderId);
    await deleteDoc(reminderRef);
    const response = collection(db, "users", uid, "reminders");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const updateReminder = createAsyncThunk(
  "reminders/updateReminder",
  async ({ uid, reminderId, updatedData }) => {
    const reminderRef = doc(db, "users", uid, "reminders", reminderId);
    await updateDoc(reminderRef, updatedData);
    const response = collection(db, "users", uid, "reminders");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const remindersSlice = createSlice({
  name: "reminders",
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addNewReminder.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const {} = remindersSlice.actions;
export default remindersSlice.reducer;
