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

export const fetchDailyNotes = createAsyncThunk(
  "daily/fetchNotes",
  async (uid) => {
    const response = collection(db, "users", uid, "dailyNotes");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);
export const addNewNote = createAsyncThunk(
  "daily/addNewNote",
  async ({ uid, note }) => {
    const notesRef = collection(db, "users", uid, "dailyNotes");
    await addDoc(notesRef, note);
    const snapshot = await getDocs(notesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const deleteNote = createAsyncThunk(
  "daily/deleteNote",
  async ({ uid, noteId }) => {
    const noteRef = doc(db, "users", uid, "dailyNotes", noteId);
    await deleteDoc(noteRef);
    const response = collection(db, "users", uid, "dailyNotes");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);
export const updateNote = createAsyncThunk(
  "daily/updateNote",
  async ({ uid, noteId, updatedData }) => {
    const noteRef = doc(db, "users", uid, "dailyNotes", noteId);
    await updateDoc(noteRef, updatedData);
    const response = collection(db, "users", uid, "dailyNotes");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const dailySlice = createSlice({
  name: "daily",
  initialState: {
    notes: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(addNewNote.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.notes = action.payload;
      });
  },
});

export const {} = dailySlice.actions;
export default dailySlice.reducer;
