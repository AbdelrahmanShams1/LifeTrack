import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShoppingItems,
  addNewShoppingItem,
  deleteShoppingItem,
  updateShoppingItem,
} from "../rtk/slices/shoppingSlice.jsx";
import { useSelector as useAppSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  ShoppingCart,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { uploadImageToCloudinary } from "../Functions/uploadImageToCloudinary.js";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shopping.items);
  const user = useAppSelector((state) => state.auth);
  const [newImage, setNewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [editImage, setEditImage] = useState("");
  const [uploadingEdit, setUploadingEdit] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    category: "عام",
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    quantity: 1,
    category: "عام",
  });

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "عام",
    "خضروات وفواكه",
    "لحوم ودجاج",
    "ألبان ومخبوزات",
    "مشروبات",
    "تنظيف",
    "أدوية وصحة",
    "مستلزمات شخصية",
  ];

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchShoppingItems(user.uid));
    }
  }, [dispatch, user]);

  const filteredItems = items?.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "bought" && item.bought) ||
      (filterStatus === "pending" && !item.bought);
    return matchesSearch && matchesFilter;
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)
      return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setNewImage(url);
    } catch (err) {
      console.error("فشل رفع الصورة:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)
      return;

    setUploadingEdit(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setEditImage(url);
    } catch (err) {
      console.error("فشل رفع صورة التعديل:", err);
    } finally {
      setUploadingEdit(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const itemData = {
      name: newItem.name.trim(),
      quantity: parseInt(newItem.quantity) || 1,
      category: newItem.category,
      bought: false,
      image: newImage,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewShoppingItem({ uid: user.uid, item: itemData }));
    setNewItem({ name: "", quantity: 1, category: "عام" });
    setNewImage("");
  };

  const handleDelete = (itemId) => {
    dispatch(deleteShoppingItem({ uid: user.uid, itemId }));
  };

  const handleToggleBought = (itemId, currentBoughtStatus) => {
    dispatch(
      updateShoppingItem({
        uid: user.uid,
        itemId,
        updatedData: {
          bought: !currentBoughtStatus,
          boughtAt: !currentBoughtStatus ? new Date().toISOString() : null,
        },
      })
    );
  };

  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
    });
    setEditImage(item.image || "");
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditForm({ name: "", quantity: 1, category: "عام" });
    setEditImage("");
  };

  const handleEditItem = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    dispatch(
      updateShoppingItem({
        uid: user.uid,
        itemId: editingItem,
        updatedData: {
          name: editForm.name.trim(),
          quantity: parseInt(editForm.quantity) || 1,
          category: editForm.category,
          updatedAt: new Date().toISOString(),
          image: editImage,
        },
      })
    );
    cancelEditing();
  };

  const getStatsData = () => {
    const total = items?.length || 0;
    const bought = items?.filter((item) => item.bought).length || 0;
    const pending = total - bought;
    return { total, bought, pending };
  };

  const stats = getStatsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden relative">
        {/* زر العودة - responsive */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium hidden xs:block">العودة</span>
          </Link>
        </div>

        {/* Header - responsive */}
        <div className="bg-green-600 p-4 sm:p-6 text-white pt-12 sm:pt-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
            قائمة المشتريات
          </h1>
          <div className="flex justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-green-100">المجموع</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">
                {stats.pending}
              </div>
              <div className="text-green-100">متبقي</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-300">
                {stats.bought}
              </div>
              <div className="text-green-100">تم الشراء</div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* البحث والتصفية - responsive */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="البحث في المشتريات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">جميع العناصر</option>
                <option value="pending">لم يتم الشراء</option>
                <option value="bought">تم الشراء</option>
              </select>
            </div>
          </div>

          {/* نموذج إضافة عنصر جديد - responsive */}
          <div className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              إضافة عنصر جديد
            </h2>
            <form onSubmit={handleAddItem} className="space-y-3 sm:space-y-4">
              {/* الحقول الأساسية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <input
                    type="text"
                    placeholder="اسم المنتج *"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="الكمية"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* رفع صورة */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  صورة المنتج (اختياري)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
                      {isUploading ? (
                        <span className="text-green-600 text-sm">
                          جاري الرفع...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                          <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          اختر صورة
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>
                  </label>
                </div>

                {newImage && (
                  <div className="mt-3 relative">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 border rounded-lg overflow-hidden">
                      <img
                        src={newImage}
                        alt="صورة المنتج المرفوعة"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setNewImage("")}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-green-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  {isUploading ? "جاري الإضافة..." : "إضافة للقائمة"}
                </button>
              </div>
            </form>
          </div>

          {/* قائمة العناصر - responsive */}
          {!filteredItems || filteredItems.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-3xl sm:text-4xl md:text-5xl mb-4">
                🛒
              </div>
              <p className="text-gray-500 text-base sm:text-lg">
                {searchTerm || filterStatus !== "all"
                  ? "لا توجد عناصر تطابق البحث"
                  : "قائمة المشتريات فارغة"}
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                {searchTerm || filterStatus !== "all"
                  ? "جرب البحث بكلمات أخرى أو غير الفلتر"
                  : "أضف عناصر جديدة لتبدأ التسوق"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all ${
                    item.bought
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {editingItem === item.id ? (
                    <form onSubmit={handleEditItem} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="sm:col-span-2 lg:col-span-2">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            min="1"
                            value={editForm.quantity}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                quantity: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
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
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* رفع صورة التعديل */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          صورة المنتج
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1">
                            <div className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
                              {uploadingEdit ? (
                                <span className="text-green-600 text-sm">
                                  جاري الرفع...
                                </span>
                              ) : (
                                <span className="flex items-center justify-center gap-2 text-sm">
                                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {editImage ? "تغيير الصورة" : "اختر صورة"}
                                </span>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageUpload}
                                className="hidden"
                                disabled={uploadingEdit}
                              />
                            </div>
                          </label>
                        </div>

                        {editImage && (
                          <div className="mt-3 relative">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 border rounded-lg overflow-hidden">
                              <img
                                src={editImage}
                                alt="صورة التعديل"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setEditImage("")}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <X className="w-2 h-2 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="submit"
                          disabled={uploadingEdit}
                          className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1 disabled:opacity-70"
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
                    <div className="flex flex-col gap-3">
                      {/* الجزء الرئيسي */}
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() =>
                            handleToggleBought(item.id, item.bought)
                          }
                          className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.bought
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-green-500"
                          }`}
                        >
                          {item.bought && (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>

                        <div
                          className={`flex-1 min-w-0 ${
                            item.bought ? "opacity-75" : ""
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <h3
                              className={`text-sm sm:text-base md:text-lg font-medium ${
                                item.bought
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                              title={item.name}
                            >
                              {item.name}
                            </h3>
                            <span className="text-xs sm:text-sm bg-gray-100 px-1.5 sm:px-2 py-1 rounded-full whitespace-nowrap">
                              {item.quantity} قطعة
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-1 rounded-full whitespace-nowrap">
                              {item.category}
                            </span>
                          </div>

                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(item.createdAt).toLocaleDateString(
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
                            onClick={() => startEditing(item)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      {/* الصورة */}
                      {item.image && (
                        <div className="mt-2">
                          <a
                            href={item.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full sm:w-32 sm:h-32 h-48 relative group"
                          >
                            <img
                              src={item.image}
                              alt="صورة المنتج"
                              className="w-full h-full object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"></div>
                          </a>
                        </div>
                      )}
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

export default ShoppingList;
