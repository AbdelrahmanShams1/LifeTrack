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

export const fetchWeeklySchedule = createAsyncThunk(
  "weeklySchedule/fetch",
  async (userId) => {
    const response = collection(db, "users", userId, "weeklySchedule");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);
export const addNewScheduleItem = createAsyncThunk(
  "weeklySchedule/add",
  async ({ userId, item }) => {
    const itemsRef = collection(db, "users", userId, "weeklySchedule");
    await addDoc(itemsRef, item);
    const snapshot = await getDocs(itemsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const deleteScheduleItem = createAsyncThunk(
  "weeklySchedule/delete",
  async ({ userId, itemId }) => {
    const itemRef = doc(db, "users", userId, "weeklySchedule", itemId);
    await deleteDoc(itemRef);
    const response = collection(db, "users", userId, "weeklySchedule");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const updateScheduleItem = createAsyncThunk(
  "weeklySchedule/update",
  async ({ userId, itemId, updatedData }) => {
    const itemRef = doc(db, "users", userId, "weeklySchedule", itemId);
    await updateDoc(itemRef, updatedData);
    const response = collection(db, "users", userId, "weeklySchedule");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const weeklyScheduleSlice = createSlice({
  name: "weeklySchedule",
  initialState: {
    schedule: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchWeeklySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      })

      .addCase(addNewScheduleItem.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      })

      .addCase(deleteScheduleItem.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      })

      .addCase(updateScheduleItem.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      });
  },
});

export const {} = weeklyScheduleSlice.actions;
export default weeklyScheduleSlice.reducer;
