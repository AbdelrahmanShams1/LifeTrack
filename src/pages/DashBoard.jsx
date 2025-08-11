import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { clearAuth } from "../rtk/slices/authSlice";
import { useEffect } from "react";
import { fetchToDos } from "../rtk/slices/ToDoSlice";
import { fetchDailyNotes } from "../rtk/slices/DailySlice";
import { fetchShoppingItems } from "../rtk/slices/shoppingSlice";
import { fetchHabits } from "../rtk/slices/habitSlice";
import { fetchReminders } from "../rtk/slices/remindersSlice";
import { fetchExpenses } from "../rtk/slices/expenseSlice";

const features = [
  { icon: "✅", title: "قائمة المهام", path: "/todo" },
  { icon: "📆", title: "الملاحظات اليومية", path: "/dailyNotes" },
  { icon: "🛒", title: "قائمة المشتريات", path: "/shopping" },
  { icon: "🧠", title: "متابع العادات", path: "/habit" },
  { icon: "⏰", title: "التذكيرات", path: "/reminders" },
  { icon: "🧾", title: "متابع المصاريف", path: "/expenses" },
  { icon: "📅", title: "جدولة الاسبوع", path: "/weekly" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const todos = useSelector((state) => state.todo.todos);
  const dailyNotes = useSelector((state) => state.daily.notes);
  const shoppingItems = useSelector((state) => state.shopping.items);
  const habitItems = useSelector((state) => state.habit.habits);
  const reminders = useSelector((state) => state.reminders.items);
  const expenses = useSelector((state) => state.expense.items);
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("dailyNotes", JSON.stringify(dailyNotes));
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
  localStorage.setItem("habitItems", JSON.stringify(habitItems));
  localStorage.setItem("reminders", JSON.stringify(reminders));
  localStorage.setItem("expenses", JSON.stringify(expenses));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchToDos(user.uid));
    dispatch(fetchDailyNotes(user.uid));
    dispatch(fetchShoppingItems(user.uid));
    dispatch(fetchHabits(user.uid));
    dispatch(fetchReminders(user.uid));
    dispatch(fetchExpenses(user.uid));
  }, [user.uid, navigate]);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements - Responsive positioning */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-tr from-slate-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 md:top-20 md:left-20 w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br from-indigo-300/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br from-blue-300/15 to-indigo-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-6 md:mb-10">
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-4 border-blue-500 shadow-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <User className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                  </div>
                )}
                <div className="text-center sm:text-right">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    أهلاً، {user.displayName || "مستخدم"}
                    <span className="text-yellow-600 ml-1">👋</span>
                  </h1>
                  <p className="text-blue-600 font-medium mt-1 md:mt-2 text-sm sm:text-base">
                    اختر القسم اللي عايز تدخله 👇
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <button
                  onClick={handleLogout}
                  className="group flex items-center justify-center gap-2 px-4 py-2 md:px-4 md:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base min-w-[120px] sm:min-w-0"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link
              to={feature.path}
              key={index}
              className="group bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex items-center gap-3 sm:gap-4 active:scale-95"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl md:text-3xl">
                    {feature.icon}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-right min-w-0">
                <span className="text-base sm:text-lg md:text-lg font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block leading-tight">
                  {feature.title}
                </span>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="max-w-6xl mx-auto mt-6 md:mt-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 text-center border border-white/20">
            <p className="text-blue-700 font-medium text-base sm:text-lg md:text-lg">
              🚀 استمر في تحقيق أهدافك وتنظيم حياتك معنا
            </p>
            <p className="text-gray-600 text-xs sm:text-sm md:text-sm mt-1 md:mt-2">
              كل خطوة صغيرة تقربك من هدفك الكبير
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
