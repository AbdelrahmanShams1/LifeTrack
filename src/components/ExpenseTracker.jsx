import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  addNewExpense,
  deleteExpense,
  updateExpense,
} from "../rtk/slices/expenseSlice.jsx";
import { useSelector as useAppSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  DollarSign,
  X,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Receipt,
  PieChart,
} from "lucide-react";

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expense.items);
  const user = useAppSelector((state) => state.auth);

  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "أكل",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    amount: "",
    category: "أكل",
    date: "",
    notes: "",
  });

  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "أكل",
    "مواصلات",
    "تسوق",
    "فواتير",
    "ترفيه",
    "صحة",
    "تعليم",
    "ملابس",
    "هدايا",
    "أخرى",
  ];

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchExpenses(user.uid));
    }
  }, [dispatch, user]);

  const filteredExpenses = expenses?.filter((expense) => {
    const matchesSearch =
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterType === "today") {
      const today = new Date().toISOString().split("T")[0];
      matchesFilter = expense.date === today;
    } else if (filterType === "week") {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const expenseDate = new Date(expense.date);
      matchesFilter = expenseDate >= weekAgo && expenseDate <= today;
    } else if (filterType === "month") {
      const today = new Date();
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      const expenseDate = new Date(expense.date);
      matchesFilter = expenseDate >= monthAgo && expenseDate <= today;
    } else if (filterType !== "all") {
      matchesFilter = expense.category === filterType;
    }

    return matchesSearch && matchesFilter;
  });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.name.trim() || !newExpense.amount) return;

    const expenseData = {
      name: newExpense.name.trim(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      notes: newExpense.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewExpense({ uid: user.uid, expenseData }));
    setNewExpense({
      name: "",
      amount: "",
      category: "أكل",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const handleDelete = (expenseId) => {
    dispatch(deleteExpense({ uid: user.uid, expenseId }));
  };

  const startEditing = (expense) => {
    setEditingExpense(expense.id);
    setEditForm({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes || "",
    });
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setEditForm({
      name: "",
      amount: "",
      category: "أكل",
      date: "",
      notes: "",
    });
  };

  const handleEditExpense = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.amount) return;

    dispatch(
      updateExpense({
        uid: user.uid,
        expenseId: editingExpense,
        expenseData: {
          name: editForm.name.trim(),
          amount: parseFloat(editForm.amount),
          category: editForm.category,
          date: editForm.date,
          notes: editForm.notes.trim(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
    cancelEditing();
  };

  const getStatsData = () => {
    const total = expenses?.length || 0;
    const totalAmount =
      expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

    const today = new Date().toISOString().split("T")[0];
    const todayExpenses =
      expenses?.filter((expense) => expense.date === today) || [];
    const todayAmount = todayExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses =
      expenses?.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      }) || [];
    const monthlyAmount = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return { total, totalAmount, todayAmount, monthlyAmount };
  };

  const getCategoryStats = () => {
    const categoryTotals = {};
    expenses?.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });
    return categoryTotals;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("ar-EG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const stats = getStatsData();
  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden relative">
        {/* زر العودة */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              العودة
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-green-600 p-3 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            متتبع المصاريف
          </h1>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-green-100 text-xs sm:text-sm">
                إجمالي المعاملات
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-300">
                {formatCurrency(stats.totalAmount)}
              </div>
              <div className="text-green-100 text-xs sm:text-sm">
                إجمالي المصاريف
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-300">
                {formatCurrency(stats.todayAmount)}
              </div>
              <div className="text-green-100 text-xs sm:text-sm">اليوم</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-300">
                {formatCurrency(stats.monthlyAmount)}
              </div>
              <div className="text-green-100 text-xs sm:text-sm">هذا الشهر</div>
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
                placeholder="البحث في المصاريف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 sm:p-3 pr-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">جميع المصاريف</option>
                <option value="today">اليوم</option>
                <option value="week">الأسبوع الماضي</option>
                <option value="month">الشهر الماضي</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* نموذج إضافة مصروف جديد */}
          <div className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              إضافة مصروف جديد
            </h2>
            <form
              onSubmit={handleAddExpense}
              className="space-y-3 sm:space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="اسم المصروف (مثال: مطعم) *"
                    value={newExpense.name}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="المبلغ *"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <textarea
                  placeholder="ملاحظات (اختياري)"
                  value={newExpense.notes}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, notes: e.target.value })
                  }
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-green-600 text-white py-2.5 sm:py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                إضافة المصروف
              </button>
            </form>
          </div>

          {/* إحصائيات التصنيفات */}
          {Object.keys(categoryStats).length > 0 && (
            <div className="mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 sm:p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                ملخص المصاريف حسب التصنيف
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(categoryStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div
                      key={category}
                      className="bg-white rounded-lg p-3 text-center shadow-sm"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {category}
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((amount / stats.totalAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* قائمة المصاريف */}
          {!filteredExpenses || filteredExpenses.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                💰
              </div>
              <p className="text-gray-500 text-base sm:text-lg px-4">
                {searchTerm || filterType !== "all"
                  ? "لا توجد مصاريف تطابق البحث"
                  : "لا توجد مصاريف مضافة بعد"}
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base px-4">
                {searchTerm || filterType !== "all"
                  ? "جرب البحث بكلمات أخرى أو غير الفلتر"
                  : "ابدأ بإضافة مصروف جديد لتتبع نفقاتك"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredExpenses
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white border-l-4 border-l-green-500 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    {editingExpense === expense.id ? (
                      <form
                        onSubmit={handleEditExpense}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                          <div>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  amount: e.target.value,
                                })
                              }
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <select
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  category: e.target.value,
                                })
                              }
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
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
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <textarea
                            value={editForm.notes}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                notes: e.target.value,
                              })
                            }
                            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows="2"
                            placeholder="ملاحظات (اختياري)"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
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
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1 mb-3 lg:mb-0">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-2">
                              <div className="flex items-start gap-2 flex-1">
                                <Receipt className="w-5 h-5 text-green-600 mt-1" />
                                <div className="flex-1">
                                  <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-800">
                                    {expense.name}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Calendar className="w-3 h-3" />
                                      <span>{formatDate(expense.date)}</span>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      {expense.category}
                                    </span>
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
                                      {formatCurrency(expense.amount)}
                                    </span>
                                  </div>
                                  {expense.notes && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {expense.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => startEditing(expense)}
                              className="p-2 text-gray-500 hover:text-green-500 rounded hover:bg-green-50 transition-colors"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
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

export default ExpenseTracker;
