import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReminders,
  addNewReminder,
  deleteReminder,
  updateReminder,
} from "../rtk/slices/remindersSlice.jsx";
import { useSelector as useAppSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  Bell,
  X,
  Calendar,
  Clock,
  Repeat,
  Search,
  AlertCircle,
} from "lucide-react";

const Reminders = () => {
  const dispatch = useDispatch();
  const reminders = useSelector((state) => state.reminders.items);
  const user = useAppSelector((state) => state.auth);

  const [newReminder, setNewReminder] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    isRecurring: false,
    repeatType: "يومي",
    isCompleted: false,
  });

  const [editingReminder, setEditingReminder] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    time: "",
    isRecurring: false,
    repeatType: "يومي",
    isCompleted: false,
  });

  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const repeatTypes = ["يومي", "أسبوعي", "شهري"];

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchReminders(user.uid));
    }
  }, [dispatch, user]);

  const filteredReminders = reminders?.filter((reminder) => {
    const matchesSearch = reminder.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterType === "completed") {
      matchesFilter = reminder.isCompleted;
    } else if (filterType === "pending") {
      matchesFilter = !reminder.isCompleted;
    } else if (filterType === "recurring") {
      matchesFilter = reminder.isRecurring;
    } else if (filterType === "today") {
      const today = new Date().toISOString().split("T")[0];
      matchesFilter = reminder.date === today;
    }

    return matchesSearch && matchesFilter;
  });

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.title.trim()) return;

    const reminderData = {
      title: newReminder.title.trim(),
      date: newReminder.date,
      time: newReminder.time,
      isRecurring: newReminder.isRecurring,
      repeatType: newReminder.isRecurring ? newReminder.repeatType : "",
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewReminder({ uid: user.uid, reminder: reminderData }));
    setNewReminder({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      isRecurring: false,
      repeatType: "يومي",
      isCompleted: false,
    });
  };

  const handleDelete = (reminderId) => {
    dispatch(deleteReminder({ uid: user.uid, reminderId }));
  };

  const startEditing = (reminder) => {
    setEditingReminder(reminder.id);
    setEditForm({
      title: reminder.title,
      date: reminder.date,
      time: reminder.time || "",
      isRecurring: reminder.isRecurring,
      repeatType: reminder.repeatType || "يومي",
      isCompleted: reminder.isCompleted,
    });
  };

  const cancelEditing = () => {
    setEditingReminder(null);
    setEditForm({
      title: "",
      date: "",
      time: "",
      isRecurring: false,
      repeatType: "يومي",
      isCompleted: false,
    });
  };

  const handleEditReminder = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;

    dispatch(
      updateReminder({
        uid: user.uid,
        reminderId: editingReminder,
        updatedData: {
          title: editForm.title.trim(),
          date: editForm.date,
          time: editForm.time,
          isRecurring: editForm.isRecurring,
          repeatType: editForm.isRecurring ? editForm.repeatType : "",
          isCompleted: editForm.isCompleted,
          updatedAt: new Date().toISOString(),
        },
      })
    );
    cancelEditing();
  };

  const toggleReminderCompletion = (reminderId, currentStatus) => {
    dispatch(
      updateReminder({
        uid: user.uid,
        reminderId,
        updatedData: {
          isCompleted: !currentStatus,
          completedAt: !currentStatus ? new Date().toISOString() : null,
        },
      })
    );
  };

  const getStatsData = () => {
    const total = reminders?.length || 0;
    const completed =
      reminders?.filter((reminder) => reminder.isCompleted).length || 0;
    const pending = total - completed;
    const today = new Date().toISOString().split("T")[0];
    const todayReminders =
      reminders?.filter((reminder) => reminder.date === today).length || 0;

    return { total, completed, pending, todayReminders };
  };

  const isReminderOverdue = (reminder) => {
    if (reminder.isCompleted) return false;
    const now = new Date();
    const reminderDateTime = new Date(
      `${reminder.date}T${reminder.time || "23:59"}`
    );
    return reminderDateTime < now;
  };

  const isReminderToday = (reminder) => {
    const today = new Date().toISOString().split("T")[0];
    return reminder.date === today;
  };

  const isReminderUpcoming = (reminder) => {
    const today = new Date().toISOString().split("T")[0];
    const reminderDate = new Date(reminder.date);
    const todayDate = new Date(today);
    const diffTime = reminderDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("ar-EG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (time) {
      const timeObj = new Date(`2000-01-01T${time}`);
      const formattedTime = timeObj.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} - ${formattedTime}`;
    }
    return formattedDate;
  };

  const stats = getStatsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden relative">
        {/* زر العودة */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              العودة
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-purple-600 p-3 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Bell className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            التذكيرات
          </h1>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-purple-100 text-xs sm:text-sm">
                إجمالي التذكيرات
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-300">
                {stats.completed}
              </div>
              <div className="text-purple-100 text-xs sm:text-sm">مكتملة</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-300">
                {stats.pending}
              </div>
              <div className="text-purple-100 text-xs sm:text-sm">معلقة</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-300">
                {stats.todayReminders}
              </div>
              <div className="text-purple-100 text-xs sm:text-sm">اليوم</div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {/* البحث والتصفية */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في التذكيرات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 sm:p-3 pr-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">جميع التذكيرات</option>
                <option value="today">اليوم</option>
                <option value="pending">معلقة</option>
                <option value="completed">مكتملة</option>
                <option value="recurring">متكررة</option>
              </select>
            </div>
          </div>

          {/* نموذج إضافة تذكير جديد */}
          <div className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              إضافة تذكير جديد
            </h2>
            <form
              onSubmit={handleAddReminder}
              className="space-y-3 sm:space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <input
                    type="text"
                    placeholder="عنوان التذكير (مثال: مكالمة مهمة) *"
                    value={newReminder.title}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, title: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, date: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, time: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="الوقت (اختياري)"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReminder.isRecurring}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        isRecurring: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm sm:text-base text-gray-700">
                    تذكير متكرر
                  </span>
                  <Repeat className="w-4 h-4 text-gray-500" />
                </label>

                {newReminder.isRecurring && (
                  <select
                    value={newReminder.repeatType}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        repeatType: e.target.value,
                      })
                    }
                    className="p-2 sm:p-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {repeatTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-purple-600 text-white py-2.5 sm:py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                إضافة التذكير
              </button>
            </form>
          </div>

          {/* قائمة التذكيرات */}
          {!filteredReminders || filteredReminders.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                🔔
              </div>
              <p className="text-gray-500 text-base sm:text-lg px-4">
                {searchTerm || filterType !== "all"
                  ? "لا توجد تذكيرات تطابق البحث"
                  : "لا توجد تذكيرات مضافة بعد"}
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base px-4">
                {searchTerm || filterType !== "all"
                  ? "جرب البحث بكلمات أخرى أو غير الفلتر"
                  : "ابدأ بإضافة تذكير جديد لتنظيم مهامك"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredReminders
                .sort((a, b) => {
                  // ترتيب حسب التاريخ والوقت
                  const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
                  const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
                  return dateA - dateB;
                })
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`bg-white border-l-4 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all ${
                      reminder.isCompleted
                        ? "border-l-green-500 bg-green-50"
                        : isReminderOverdue(reminder)
                        ? "border-l-red-500 bg-red-50"
                        : isReminderToday(reminder)
                        ? "border-l-orange-500 bg-orange-50"
                        : isReminderUpcoming(reminder)
                        ? "border-l-blue-500 bg-blue-50"
                        : "border-l-gray-300"
                    }`}
                  >
                    {editingReminder === reminder.id ? (
                      <form
                        onSubmit={handleEditReminder}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div className="sm:col-span-2 lg:col-span-1">
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  title: e.target.value,
                                })
                              }
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  date: e.target.value,
                                })
                              }
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="time"
                              value={editForm.time}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  time: e.target.value,
                                })
                              }
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.isRecurring}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  isRecurring: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700">
                              تذكير متكرر
                            </span>
                          </label>

                          {editForm.isRecurring && (
                            <select
                              value={editForm.repeatType}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  repeatType: e.target.value,
                                })
                              }
                              className="p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              {repeatTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          )}

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.isCompleted}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  isCompleted: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-green-600 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700">مكتمل</span>
                          </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            حفظ التعديلات
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="flex-1 sm:flex-none px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        {/* محتوى التذكير */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1 mb-3 lg:mb-0">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-2">
                              <div className="flex items-start gap-2 flex-1">
                                <button
                                  onClick={() =>
                                    toggleReminderCompletion(
                                      reminder.id,
                                      reminder.isCompleted
                                    )
                                  }
                                  className={`mt-1 p-1 rounded-full border-2 transition-all ${
                                    reminder.isCompleted
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-500"
                                  }`}
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <div className="flex-1">
                                  <h3
                                    className={`text-lg sm:text-xl font-bold mb-1 ${
                                      reminder.isCompleted
                                        ? "line-through text-gray-500"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {reminder.title}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Calendar className="w-3 h-3" />
                                      <span>
                                        {formatDateTime(
                                          reminder.date,
                                          reminder.time
                                        )}
                                      </span>
                                    </div>
                                    {reminder.isRecurring && (
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Repeat className="w-3 h-3" />
                                        {reminder.repeatType}
                                      </span>
                                    )}
                                    {isReminderOverdue(reminder) &&
                                      !reminder.isCompleted && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          متأخر
                                        </span>
                                      )}
                                    {isReminderToday(reminder) &&
                                      !reminder.isCompleted && (
                                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          اليوم
                                        </span>
                                      )}
                                    {reminder.isCompleted && (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        مكتمل
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => startEditing(reminder)}
                              className="p-2 text-gray-500 hover:text-purple-500 rounded hover:bg-purple-50 transition-colors"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(reminder.id)}
                              className="p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
