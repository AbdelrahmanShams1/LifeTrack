import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHabits,
  addNewHabit,
  deleteHabit,
  updateHabit,
} from "../rtk/slices/habitSlice.jsx";
import { useSelector as useAppSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  Target,
  X,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";

const HabitTracker = () => {
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habit.habits);
  const user = useAppSelector((state) => state.auth);

  const [newHabit, setNewHabit] = useState({
    name: "",
    frequency: "يومي",
    targetTime: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [editingHabit, setEditingHabit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    frequency: "يومي",
    targetTime: "",
    startDate: "",
  });

  const [filterFrequency, setFilterFrequency] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const frequencies = ["يومي", "أسبوعي", "شهري"];

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchHabits(user.uid));
    }
  }, [dispatch, user]);

  const filteredHabits = habits?.filter((habit) => {
    const matchesSearch = habit.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterFrequency === "all" || habit.frequency === filterFrequency;
    return matchesSearch && matchesFilter;
  });

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;

    const habitData = {
      name: newHabit.name.trim(),
      frequency: newHabit.frequency,
      targetTime: newHabit.targetTime,
      startDate: newHabit.startDate,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewHabit({ uid: user.uid, habit: habitData }));
    setNewHabit({
      name: "",
      frequency: "يومي",
      targetTime: "",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = (habitId) => {
    dispatch(deleteHabit({ uid: user.uid, habitId }));
  };

  const startEditing = (habit) => {
    setEditingHabit(habit.id);
    setEditForm({
      name: habit.name,
      frequency: habit.frequency,
      targetTime: habit.targetTime || "",
      startDate: habit.startDate,
    });
  };

  const cancelEditing = () => {
    setEditingHabit(null);
    setEditForm({
      name: "",
      frequency: "يومي",
      targetTime: "",
      startDate: "",
    });
  };

  const handleEditHabit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    dispatch(
      updateHabit({
        uid: user.uid,
        habitId: editingHabit,
        updatedData: {
          name: editForm.name.trim(),
          frequency: editForm.frequency,
          targetTime: editForm.targetTime,
          startDate: editForm.startDate,
          updatedAt: new Date().toISOString(),
        },
      })
    );
    cancelEditing();
  };

  const toggleHabitCompletion = (habitId, date) => {
    const habit = habits.find((h) => h.id === habitId);
    const completedDates = habit.completedDates || [];
    const dateStr = date.toISOString().split("T")[0];

    let updatedDates;
    if (completedDates.includes(dateStr)) {
      updatedDates = completedDates.filter((d) => d !== dateStr);
    } else {
      updatedDates = [...completedDates, dateStr];
    }

    dispatch(
      updateHabit({
        uid: user.uid,
        habitId,
        updatedData: {
          completedDates: updatedDates,
          lastCompletedAt: new Date().toISOString(),
        },
      })
    );
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getDayName = (date) => {
    const days = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return days[date.getDay()];
  };

  const calculateProgress = (habit) => {
    if (!habit.completedDates) return 0;
    const weekDates = getWeekDates();
    const completedThisWeek = weekDates.filter((date) =>
      habit.completedDates.includes(date.toISOString().split("T")[0])
    ).length;
    return Math.round((completedThisWeek / 7) * 100);
  };

  const getStatsData = () => {
    const total = habits?.length || 0;
    const activeToday =
      habits?.filter((habit) => {
        const today = new Date().toISOString().split("T")[0];
        return habit.completedDates?.includes(today);
      }).length || 0;
    const avgProgress =
      habits?.length > 0
        ? Math.round(
            habits.reduce((sum, habit) => sum + calculateProgress(habit), 0) /
              habits.length
          )
        : 0;

    return { total, activeToday, avgProgress };
  };

  const stats = getStatsData();
  const weekDates = getWeekDates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden relative">
        {/* زر العودة */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              العودة
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-blue-600 p-3 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            متتبع العادات
          </h1>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">
                إجمالي العادات
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-300">
                {stats.activeToday}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">
                مكتملة اليوم
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-300">
                {stats.avgProgress}%
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">
                المعدل الأسبوعي
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {/* البحث والتصفية */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="البحث في العادات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-auto">
              <select
                value={filterFrequency}
                onChange={(e) => setFilterFrequency(e.target.value)}
                className="w-full sm:w-auto p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع العادات</option>
                <option value="يومي">يومي</option>
                <option value="أسبوعي">أسبوعي</option>
                <option value="شهري">شهري</option>
              </select>
            </div>
          </div>

          {/* نموذج إضافة عادة جديدة */}
          <div className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              إضافة عادة جديدة
            </h2>
            <form
              onSubmit={handleAddHabit}
              className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 lg:gap-4"
            >
              <div className="sm:col-span-2 lg:col-span-2">
                <input
                  type="text"
                  placeholder="اسم العادة (مثال: صلاة الفجر) *"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <select
                  value={newHabit.frequency}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, frequency: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="time"
                  value={newHabit.targetTime}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, targetTime: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="الوقت المستهدف"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <input
                  type="date"
                  value={newHabit.startDate}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, startDate: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  إضافة العادة
                </button>
              </div>
            </form>
          </div>

          {/* قائمة العادات */}
          {!filteredHabits || filteredHabits.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                🎯
              </div>
              <p className="text-gray-500 text-base sm:text-lg px-4">
                {searchTerm || filterFrequency !== "all"
                  ? "لا توجد عادات تطابق البحث"
                  : "لا توجد عادات مضافة بعد"}
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base px-4">
                {searchTerm || filterFrequency !== "all"
                  ? "جرب البحث بكلمات أخرى أو غير الفلتر"
                  : "ابدأ بإضافة عادة جديدة لتتبع تقدمك"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                >
                  {editingHabit === habit.id ? (
                    <form
                      onSubmit={handleEditHabit}
                      className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 lg:gap-4"
                    >
                      <div className="sm:col-span-2 lg:col-span-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <select
                          value={editForm.frequency}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              frequency: e.target.value,
                            })
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {frequencies.map((freq) => (
                            <option key={freq} value={freq}>
                              {freq}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="time"
                          value={editForm.targetTime}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              targetTime: e.target.value,
                            })
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-2">
                        <input
                          type="date"
                          value={editForm.startDate}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              startDate: e.target.value,
                            })
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-2">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
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
                      {/* معلومات العادة */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="flex-1 mb-3 lg:mb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                              {habit.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {habit.frequency}
                              </span>
                              {habit.targetTime && (
                                <span className="text-xs sm:text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {habit.targetTime}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* شريط التقدم */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 sm:h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 sm:h-3 rounded-full transition-all duration-300"
                                style={{
                                  width: `${calculateProgress(habit)}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-600">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              {calculateProgress(habit)}%
                            </div>
                          </div>

                          <div className="text-xs sm:text-sm text-gray-500">
                            بدأت في:{" "}
                            {new Date(habit.startDate).toLocaleDateString(
                              "ar-EG"
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => startEditing(habit)}
                            className="p-2 text-gray-500 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(habit.id)}
                            className="p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* تقويم الأسبوع */}
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          هذا الأسبوع
                        </h4>
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                          {weekDates.map((date, index) => {
                            const dateStr = date.toISOString().split("T")[0];
                            const isCompleted =
                              habit.completedDates?.includes(dateStr);
                            const isToday =
                              dateStr ===
                              new Date().toISOString().split("T")[0];

                            return (
                              <div key={index} className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {getDayName(date).slice(0, 3)}
                                </div>
                                <button
                                  onClick={() =>
                                    toggleHabitCompletion(habit.id, date)
                                  }
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                                    isCompleted
                                      ? "bg-green-500 border-green-500 text-white"
                                      : isToday
                                      ? "border-blue-500 text-blue-500 hover:bg-blue-50"
                                      : "border-gray-300 text-gray-400 hover:border-gray-400"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    date.getDate()
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          اضغط على التاريخ لتأشير إكمال العادة
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

export default HabitTracker;
