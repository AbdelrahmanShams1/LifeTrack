import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.jsx";
import todo from "./slices/ToDoSlice.jsx";
import daily from "./slices/DailySlice.jsx";
import shopping from "./slices/shoppingSlice.jsx";
import habit from "./slices/habitSlice.jsx";
import reminders from "./slices/remindersSlice.jsx";
import expenses from "./slices/expenseSlice.jsx";

const store = configureStore({
    reducer: {
        auth: auth,
        todo: todo,
        daily: daily,
        shopping: shopping,
        habit: habit,
        reminders: reminders,
        expense: expenses,
    },
    devTools: process.env.NODE_ENV !== "production"
})
export default store;