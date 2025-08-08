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

export const fetchToDos = createAsyncThunk("toDo/fetchToDos", async (uid) => {
  const toDosRef = collection(db, "users", uid, "todos");
  const snapshot = await getDocs(toDosRef);
  const todos = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return todos;
});

export const addNewToDo = createAsyncThunk(
  "toDo/addNewToDo",
  async ({ uid, todo }) => {
    const toDosRef = collection(db, "users", uid, "todos");
    await addDoc(toDosRef, todo);
    const snapshot = await getDocs(toDosRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
  }
);

export const deleteToDoItem = createAsyncThunk(
  "toDo/deleteToDoItem",
  async ({ uid, id }) => {
    const toDoRef = doc(db, "users", uid, "todos", id);
    await deleteDoc(toDoRef);
    const toDosRef = collection(db, "users", uid, "todos");
    const snapshot = await getDocs(toDosRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const updateToDoItem = createAsyncThunk(
  "toDo/updateToDoItem",
  async ({ uid, id, data }) => {
    const toDoRef = doc(db, "users", uid, "todos", id);
    await updateDoc(toDoRef, data);
    const toDosRef = collection(db, "users", uid, "todos");
    const snapshot = await getDocs(toDosRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const toDoSlice = createSlice({
  name: "toDo",
  initialState: {
    todos: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchToDos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(addNewToDo.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(deleteToDoItem.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(updateToDoItem.fulfilled, (state, action) => {
        state.todos = action.payload;
      });
  },
});

export default toDoSlice.reducer;
