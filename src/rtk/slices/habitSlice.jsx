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

export const fetchHabits = createAsyncThunk(
  "habit/fetchHabits",
  async (uid) => {
    const response = collection(db, "users", uid, "habits");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const addNewHabit = createAsyncThunk(
  "habit/addNewHabit",
  async ({ uid, habit }) => {
    const docRef = await addDoc(collection(db, "users", uid, "habits"), habit);
    const response = collection(db, "users", uid, "habits");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const deleteHabit = createAsyncThunk(
  "habit/deleteHabit",
  async ({ uid, habitId }) => {
    const habitRef = doc(db, "users", uid, "habits", habitId);
    await deleteDoc(habitRef);
    const response = collection(db, "users", uid, "habits");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);
export const updateHabit = createAsyncThunk(
  "habit/updateHabit",
  async ({ uid, habitId, updatedData }) => {
    const habitRef = doc(db, "users", uid, "habits", habitId);
    await updateDoc(habitRef, updatedData);
    const response = collection(db, "users", uid, "habits");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const habitSlice = createSlice({
  name: "habit",
  initialState: {
    habits: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNewHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
      });
  },
});

export const {} = habitSlice.actions;
export default habitSlice.reducer;
