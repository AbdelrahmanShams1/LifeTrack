import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeeklySchedule,
  addNewScheduleItem,
  deleteScheduleItem,
  updateScheduleItem,
} from "../rtk/slices/weeklyScheduleSlice";
import { useSelector as useAppSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  Calendar,
  X,
  Clock,
  Target,
} from "lucide-react";

const WeeklyHabits = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.weekly.schedule);
  const user = useAppSelector((state) => state.auth);

  const [newTask, setNewTask] = useState({
    task: "",
    day: "",
    timeSlot: "",
  });

  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    task: "",
    day: "",
    timeSlot: "",
  });

  const [filterDay, setFilterDay] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const days = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  // نظام أوقات محدث لـ 24 ساعة بوضوح
  const timeSlots = [
    "12:00 ص - 1:00 ص", // منتصف الليل
    "1:00 ص - 2:00 ص",
    "2:00 ص - 3:00 ص",
    "3:00 ص - 4:00 ص",
    "4:00 ص - 5:00 ص",
    "5:00 ص - 6:00 ص", // الفجر
    "6:00 ص - 7:00 ص",
    "7:00 ص - 8:00 ص",
    "8:00 ص - 9:00 ص",
    "9:00 ص - 10:00 ص",
    "10:00 ص - 11:00 ص",
    "11:00 ص - 12:00 م", // الضهر
    "12:00 م - 1:00 م",
    "1:00 م - 2:00 م",
    "2:00 م - 3:00 م",
    "3:00 م - 4:00 م",
    "4:00 م - 5:00 م",
    "5:00 م - 6:00 م",
    "6:00 م - 7:00 م",
    "7:00 م - 8:00 م",
    "8:00 م - 9:00 م",
    "9:00 م - 10:00 م",
    "10:00 م - 11:00 م",
    "11:00 م - 12:00 ص", // قبل منتصف الليل
  ];

  // دالة لتحويل الأوقات القديمة إلى النظام الجديد
  const convertOldTimeSlot = (oldSlot) => {
    const timeMapping = {
      "8\\9": "8:00 ص - 9:00 ص",
      "9\\10": "9:00 ص - 10:00 ص",
      "10\\11": "10:00 ص - 11:00 ص",
      "11\\12": "11:00 ص - 12:00 م",
      "12\\1": "12:00 م - 1:00 م",
      "1\\2": "1:00 م - 2:00 م",
      "2\\3": "2:00 م - 3:00 م",
      "3\\4": "3:00 م - 4:00 م",
      "4\\5": "4:00 م - 5:00 م",
      "5\\6": "5:00 م - 6:00 م",
      "6\\7": "6:00 م - 7:00 م",
      "7\\8": "7:00 م - 8:00 م",
    };

    return timeMapping[oldSlot] || oldSlot;
  };

  // دالة للحصول على وقت مختصر للعرض في الجدول
  const getShortTimeSlot = (timeSlot) => {
    if (!timeSlot) return "";

    // إذا كان الوقت بالتنسيق الجديد
    if (timeSlot.includes(" - ")) {
      const startTime = timeSlot.split(" - ")[0];
      return startTime;
    }

    // إذا كان الوقت بالتنسيق القديم، نحوله
    return getShortTimeSlot(convertOldTimeSlot(timeSlot));
  };

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchWeeklySchedule(user.uid));
    }
  }, [dispatch, user]);

  // تحديث القيم الافتراضية للمهام الجديدة
  useEffect(() => {
    if (newTask.day === "" && days.length > 0) {
      setNewTask((prev) => ({ ...prev, day: days[0] }));
    }
    if (newTask.timeSlot === "" && timeSlots.length > 0) {
      setNewTask((prev) => ({ ...prev, timeSlot: timeSlots[8] })); // 8:00 ص كافتراضي
    }
  }, []);

  const filteredSchedule = schedule?.filter((item) => {
    const term = searchTerm?.toLowerCase() || "";
    const matchesSearch = item.task?.toLowerCase().includes(term) || false;
    const matchesFilter = filterDay === "all" || item.day === filterDay;
    return matchesSearch && matchesFilter;
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;

    // التحقق من أن الخانة غير محجوزة بالفعل
    const existingTask = schedule?.find(
      (item) => item.day === newTask.day && item.timeSlot === newTask.timeSlot
    );

    if (existingTask) {
      alert("هذا الوقت محجوز بالفعل في هذا اليوم!");
      return;
    }

    const taskData = {
      task: newTask.task.trim(),
      day: newTask.day,
      timeSlot: newTask.timeSlot,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewScheduleItem({ userId: user.uid, item: taskData }));
    setNewTask({ task: "", day: newTask.day, timeSlot: timeSlots[8] }); // الاحتفاظ باليوم والعودة للوقت الافتراضي
  };

  const handleDeleteTask = (itemId) => {
    dispatch(deleteScheduleItem({ userId: user.uid, itemId }));
  };

  const handleToggleCompleted = (itemId, currentStatus) => {
    dispatch(
      updateScheduleItem({
        userId: user.uid,
        itemId,
        updatedData: {
          completed: !currentStatus,
          completedAt: !currentStatus ? new Date().toISOString() : null,
        },
      })
    );
  };

  const startEditing = (item) => {
    setEditingTask(item.id);
    setEditForm({
      task: item.task,
      day: item.day,
      timeSlot: item.timeSlot,
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditForm({ task: "", day: days[0], timeSlot: timeSlots[8] });
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    if (!editForm.task.trim()) return;

    // التحقق من أن الوقت الجديد غير محجوز بواسطة مهمة أخرى
    const existingTask = schedule?.find(
      (item) =>
        item.id !== editingTask &&
        item.day === editForm.day &&
        item.timeSlot === editForm.timeSlot
    );

    if (existingTask) {
      alert("هذا الوقت محجوز بالفعل في هذا اليوم!");
      return;
    }

    dispatch(
      updateScheduleItem({
        userId: user.uid,
        itemId: editingTask,
        updatedData: {
          task: editForm.task.trim(),
          day: editForm.day,
          timeSlot: editForm.timeSlot,
          updatedAt: new Date().toISOString(),
        },
      })
    );
    cancelEditing();
  };

  const getStatsData = () => {
    const total = schedule?.length || 0;
    const completed = schedule?.filter((item) => item.completed).length || 0;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const createScheduleGrid = () => {
    const grid = {};

    // تهيئة الجدول
    days.forEach((day) => {
      grid[day] = {};
      timeSlots.forEach((slot) => {
        grid[day][slot] = null;
      });
    });

    // ملء الجدول بالمهام (مع معالجة الأوقات القديمة)
    schedule?.forEach((task) => {
      let timeSlot = task.timeSlot;

      // تحويل الأوقات القديمة إلى النظام الجديد
      if (!timeSlots.includes(timeSlot)) {
        timeSlot = convertOldTimeSlot(timeSlot);
      }

      if (grid[task.day] && grid[task.day][timeSlot] !== undefined) {
        grid[task.day][timeSlot] = { ...task, timeSlot };
      }
    });

    return grid;
  };

  const scheduleGrid = createScheduleGrid();
  const stats = getStatsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden relative">
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium hidden xs:block">العودة</span>
          </Link>
        </div>

        <div className="bg-blue-600 p-4 sm:p-6 text-white pt-12 sm:pt-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
            جدول المهام الأسبوعي
          </h1>
          <div className="flex justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-blue-100">المجموع</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">
                {stats.pending}
              </div>
              <div className="text-blue-100">متبقي</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-300">
                {stats.completed}
              </div>
              <div className="text-blue-100">مكتمل</div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="البحث في المهام..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="w-full sm:w-auto p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">جميع الأيام</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              إضافة مهمة جديدة
            </h2>
            <form onSubmit={handleAddTask} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="اسم المهمة *"
                    value={newTask.task}
                    onChange={(e) =>
                      setNewTask({ ...newTask, task: e.target.value })
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <select
                    value={newTask.day}
                    onChange={(e) =>
                      setNewTask({ ...newTask, day: e.target.value })
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {days.map((day, i) => (
                      <option key={i} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={newTask.timeSlot}
                    onChange={(e) =>
                      setNewTask({ ...newTask, timeSlot: e.target.value })
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {timeSlots.map((slot, i) => (
                      <option key={i} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  إضافة للجدول
                </button>
              </div>
            </form>
          </div>

          {/* Schedule Grid View */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              الجدول الأسبوعي
            </h2>
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden text-xs sm:text-sm">
                  <thead className="sticky top-0 bg-blue-600 text-white z-10">
                    <tr>
                      <th className="border border-gray-300 p-2 font-medium min-w-24">
                        التوقيت
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className="border border-gray-300 p-2 font-medium min-w-32"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot) => (
                      <tr key={slot} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2 font-medium bg-gray-100 text-center text-xs whitespace-nowrap">
                          {getShortTimeSlot(slot)}
                        </td>
                        {days.map((day) => {
                          const task = scheduleGrid[day]?.[slot];
                          return (
                            <td
                              key={`${day}-${slot}`}
                              className="border border-gray-300 p-1 relative min-h-12"
                            >
                              {task ? (
                                <div
                                  className={`p-1 rounded text-xs ${
                                    task.completed
                                      ? "bg-green-100 border border-green-200"
                                      : "bg-blue-100 border border-blue-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className={`flex-1 truncate ${
                                        task.completed
                                          ? "line-through text-gray-500"
                                          : "text-gray-800"
                                      }`}
                                      title={task.task}
                                    >
                                      {task.task}
                                    </span>
                                    <div className="flex gap-1 flex-shrink-0">
                                      <button
                                        onClick={() =>
                                          handleToggleCompleted(
                                            task.id,
                                            task.completed
                                          )
                                        }
                                        className={`p-0.5 rounded ${
                                          task.completed
                                            ? "text-green-600 hover:text-green-800"
                                            : "text-gray-500 hover:text-green-600"
                                        }`}
                                        title={
                                          task.completed
                                            ? "إلغاء الإكمال"
                                            : "تم"
                                        }
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => startEditing(task)}
                                        className="p-0.5 text-blue-500 hover:text-blue-700 rounded"
                                        title="تعديل"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteTask(task.id)
                                        }
                                        className="p-0.5 text-red-500 hover:text-red-700 rounded"
                                        title="حذف"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-8 flex items-center justify-center text-gray-400">
                                  -
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Task List View */}
          {!filteredSchedule || filteredSchedule.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-3xl sm:text-4xl md:text-5xl mb-4">
                📅
              </div>
              <p className="text-gray-500 text-base sm:text-lg">
                {searchTerm || filterDay !== "all"
                  ? "لا توجد مهام تطابق البحث"
                  : "لا توجد مهام محددة"}
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                {searchTerm || filterDay !== "all"
                  ? "جرب البحث بكلمات أخرى أو غير الفلتر"
                  : "أضف مهام جديدة لتنظيم أسبوعك"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                قائمة المهام ({filteredSchedule.length})
              </h2>
              {filteredSchedule.map((task) => {
                // تحويل الوقت القديم إلى النظام الجديد للعرض
                const displayTimeSlot = timeSlots.includes(task.timeSlot)
                  ? task.timeSlot
                  : convertOldTimeSlot(task.timeSlot);

                return (
                  <div
                    key={task.id}
                    className={`bg-white border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all ${
                      task.completed
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    {editingTask === task.id ? (
                      <form onSubmit={handleEditTask} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <input
                              type="text"
                              value={editForm.task}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  task: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <select
                              value={editForm.day}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  day: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            >
                              {days.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <select
                              value={editForm.timeSlot}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  timeSlot: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            >
                              {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            حفظ التعديلات
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="flex-1 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleCompleted(task.id, task.completed)
                          }
                          className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-green-500"
                          }`}
                        >
                          {task.completed && (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>

                        <div
                          className={`flex-1 min-w-0 ${
                            task.completed ? "opacity-75" : ""
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <h3
                              className={`text-sm sm:text-base md:text-lg font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                              title={task.task}
                            >
                              {task.task}
                            </h3>
                            <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-1 rounded-full whitespace-nowrap">
                              {task.day}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-1.5 sm:px-2 py-1 rounded-full whitespace-nowrap">
                              {getShortTimeSlot(displayTimeSlot)}
                            </span>
                          </div>

                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(task.createdAt).toLocaleDateString(
                              "ar-EG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => startEditing(task)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyHabits;
