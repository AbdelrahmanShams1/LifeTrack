import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchToDos,
  addNewToDo,
  deleteToDoItem,
  updateToDoItem,
} from "../rtk/slices/ToDoSlice";
import { useSelector as useAppSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ToDoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos);

  const user = useAppSelector((state) => state.auth);

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });

  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchToDos(user.uid));
    }
  }, [dispatch, user]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    const todoData = {
      title: newTodo.title.trim(),
      description: newTodo.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewToDo({ uid: user.uid, todo: todoData }));
    setNewTodo({ title: "", description: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteToDoItem({ uid: user.uid, id }));
  };

  const toggleComplete = (todo) => {
    dispatch(
      updateToDoItem({
        uid: user.uid,
        id: todo.id,
        data: { completed: !todo.completed },
      })
    );
  };

  // بدء التعديل
  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditForm({
      title: todo.title,
      description: todo.description || "",
    });
  };

  // إلغاء التعديل
  const cancelEditing = () => {
    setEditingTodo(null);
    setEditForm({ title: "", description: "" });
  };

  // حفظ التعديل
  const handleEditTodo = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;

    dispatch(
      updateToDoItem({
        uid: user.uid,
        id: editingTodo,
        data: {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
    cancelEditing();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg md:rounded-xl overflow-hidden relative">
        {/* Back Button - Responsive positioning */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium hidden sm:inline">العودة</span>
            <span className="font-medium sm:hidden">عودة</span>
          </Link>
        </div>

        {/* Header Section - Responsive */}
        <div className="bg-indigo-600 p-4 sm:p-5 md:p-6 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
            📝 قائمة المهام
          </h1>
          <p className="text-center text-indigo-100 mt-2 text-sm sm:text-base">
            {todos?.length || 0} مهمة (
            {todos?.filter((t) => t.completed).length} مكتملة)
          </p>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Add New Todo Form - Responsive */}
          <div className="mb-6 md:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              ➕ إضافة مهمة جديدة
            </h2>
            <form onSubmit={handleAddTodo} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="عنوان المهمة *"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="وصف المهمة (اختياري)"
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base resize-none"
                  rows="2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base active:scale-95"
              >
                إضافة المهمة
              </button>
            </form>
          </div>

          {/* Todo List - Responsive */}
          {!todos || todos.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-4xl sm:text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-base sm:text-lg">
                لا توجد مهام حالياً
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                قم بإضافة مهمة جديدة لتبدأ
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`py-3 sm:py-4 px-2 sm:px-3 hover:bg-gray-50 transition-colors duration-200 ${
                    todo.completed ? "opacity-75" : ""
                  }`}
                >
                  {editingTodo === todo.id ? (
                    // Edit Form - Responsive
                    <form
                      onSubmit={handleEditTodo}
                      className="space-y-2 sm:space-y-3"
                    >
                      <div>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base resize-none"
                          rows="2"
                          placeholder="وصف المهمة"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                        <button
                          type="submit"
                          className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm order-2 sm:order-1 active:scale-95"
                        >
                          حفظ
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm order-1 sm:order-2 active:scale-95"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Todo - Responsive
                    <>
                      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleComplete(todo)}
                            className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 sm:mt-0 ${
                              todo.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-indigo-500"
                            }`}
                          >
                            {todo.completed && (
                              <span className="text-xs sm:text-sm">✓</span>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <span
                              className={`block text-sm sm:text-base md:text-lg break-words ${
                                todo.completed
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              {todo.title}
                            </span>
                            {todo.description && (
                              <p className="mt-1 text-gray-500 text-xs sm:text-sm break-words">
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                          {/* Edit Button */}
                          <button
                            onClick={() => startEditing(todo)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors active:scale-95"
                            title="تعديل المهمة"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors active:scale-95"
                            title="حذف المهمة"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
