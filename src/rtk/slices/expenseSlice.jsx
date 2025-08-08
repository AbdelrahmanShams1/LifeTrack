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

export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async (uid) => {
    const expensesCollection = collection(db, "users", uid, "expenses");
    const expenseSnapshot = await getDocs(expensesCollection);
    const expenses = expenseSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return expenses;
  }
);

export const addNewExpense = createAsyncThunk(
  "expense/addNewExpense",
  async ({ uid, expenseData }) => {
    const expensesCollection = collection(db, "users", uid, "expenses");
    const docRef = await addDoc(expensesCollection, expenseData);
    return { id: docRef.id, ...expenseData };
  }
);

export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async ({ uid, expenseId }) => {
    const expenseDoc = doc(db, "users", uid, "expenses", expenseId);
    await deleteDoc(expenseDoc);
    return expenseId;
  }
);

export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async ({ uid, expenseId, expenseData }) => {
    const expenseDoc = doc(db, "users", uid, "expenses", expenseId);
    await updateDoc(expenseDoc, expenseData);
    return { id: expenseId, ...expenseData };
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addNewExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const {} = expenseSlice.actions;

export default expenseSlice.reducer;
