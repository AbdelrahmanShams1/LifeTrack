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

export const fetchShoppingItems = createAsyncThunk(
  "shopping/fetchItems",
  async (uid) => {
    const response = collection(db, "users", uid, "shoppingItems");
    const data = await getDocs(response);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const addNewShoppingItem = createAsyncThunk(
  "shopping/addNewItem",
  async ({ uid, item }) => {
    const itemsRef = collection(db, "users", uid, "shoppingItems");
    await addDoc(itemsRef, item);
    const snapshot = await getDocs(itemsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const deleteShoppingItem = createAsyncThunk(
  "shopping/deleteItem",
  async ({ uid, itemId }) => {
    const itemRef = doc(db, "users", uid, "shoppingItems", itemId);
    await deleteDoc(itemRef);
    const response = collection(db, "users", uid, "shoppingItems");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const updateShoppingItem = createAsyncThunk(
  "shopping/updateItem",
  async ({ uid, itemId, updatedData }) => {
    const itemRef = doc(db, "users", uid, "shoppingItems", itemId);
    await updateDoc(itemRef, updatedData);
    const response = collection(db, "users", uid, "shoppingItems");
    const snapshot = await getDocs(response);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const shoppingSlice = createSlice({
  name: "shopping",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchShoppingItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchShoppingItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add new item
      .addCase(addNewShoppingItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewShoppingItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addNewShoppingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete item
      .addCase(deleteShoppingItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(deleteShoppingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update item
      .addCase(updateShoppingItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShoppingItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateShoppingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearItems } = shoppingSlice.actions;
export default shoppingSlice.reducer;
