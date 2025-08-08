import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyNotes,
  addNewNote,
  deleteNote,
  updateNote,
} from "../rtk/slices/DailySlice.jsx";
import { useSelector as useAppSelector } from "react-redux";
import { uploadImageToCloudinary } from "../Functions/uploadImageToCloudinary.js";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DailyNotes = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.daily.notes);
  const user = useAppSelector((state) => state.auth);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    images: [],
  });

  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    images: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchDailyNotes(user.uid));
    }
  }, [dispatch, user]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        if (!file.type.match("image.*")) continue;
        if (file.size > 5 * 1024 * 1024) continue;

        const url = await uploadImageToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      setNewNote((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      console.error("فشل رفع الصور:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingEdit(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        if (!file.type.match("image.*")) continue;
        if (file.size > 5 * 1024 * 1024) continue;

        const url = await uploadImageToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      setEditForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      console.error("فشل رفع صور التعديل:", err);
    } finally {
      setUploadingEdit(false);
    }
  };

  const removeNewImage = (indexToRemove) => {
    setNewNote((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeEditImage = (indexToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    const noteData = {
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      images: newNote.images,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNewNote({ uid: user.uid, note: noteData }));
    setNewNote({ title: "", content: "", images: [] });
  };

  const handleDelete = (noteId) => {
    dispatch(deleteNote({ uid: user.uid, noteId }));
  };

  const startEditing = (note) => {
    setEditingNote(note.id);
    setEditForm({
      title: note.title,
      content: note.content || "",
      images: note.images || [],
    });
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditForm({ title: "", content: "", images: [] });
  };

  const handleEditNote = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;

    dispatch(
      updateNote({
        uid: user.uid,
        noteId: editingNote,
        updatedData: {
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          images: editForm.images,
          updatedAt: new Date().toISOString(),
        },
      })
    );
    cancelEditing();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden relative">
        {/* Back button - positioned better for mobile */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium hidden xs:block">العودة</span>
          </Link>
        </div>

        {/* Header - responsive padding and text sizes */}
        <div className="bg-purple-600 p-4 sm:p-6 text-white pt-12 sm:pt-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
            📓 ملاحظاتي اليومية
          </h1>
          <p className="text-center text-purple-100 mt-2 text-sm sm:text-base">
            {notes?.length || 0} ملاحظة
          </p>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Add new note form - responsive layout */}
          <div className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              ✍️ إضافة ملاحظة جديدة
            </h2>
            <form onSubmit={handleAddNote} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="عنوان الملاحظة *"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="محتوى الملاحظة"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  إضافة صور
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm"
                  disabled={isUploading}
                />
                {isUploading && (
                  <p className="text-purple-600 text-xs sm:text-sm mt-1">
                    جاري رفع الصور...
                  </p>
                )}
              </div>

              {newNote.images.length > 0 && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    الصور المرفقة:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                    {newNote.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-purple-400 text-sm sm:text-base"
              >
                {isUploading ? "جاري الرفع..." : "إضافة الملاحظة"}
              </button>
            </form>
          </div>

          {/* Notes display - responsive grid */}
          {!notes || notes.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-3xl sm:text-4xl md:text-5xl mb-4">
                📝
              </div>
              <p className="text-gray-500 text-base sm:text-lg">
                لا توجد ملاحظات حالياً
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                قم بإضافة ملاحظة جديدة لتبدأ
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {editingNote === note.id ? (
                    <form onSubmit={handleEditNote} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              content: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          rows="3"
                          placeholder="محتوى الملاحظة"
                        />
                      </div>

                      <div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="w-full p-2 border border-gray-300 rounded text-xs sm:text-sm"
                          disabled={uploadingEdit}
                        />
                        {uploadingEdit && (
                          <p className="text-purple-600 text-xs sm:text-sm mt-1">
                            جاري رفع الصور...
                          </p>
                        )}
                      </div>

                      {editForm.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {editForm.images.map((imageUrl, index) => (
                            <div key={index} className="relative">
                              <img
                                src={imageUrl}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-12 sm:h-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeEditImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:space-x-2">
                        <button
                          type="submit"
                          disabled={uploadingEdit}
                          className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs sm:text-sm disabled:bg-green-400"
                        >
                          حفظ
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
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 leading-tight">
                          {note.title}
                        </h3>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
                          <button
                            onClick={() => startEditing(note)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors"
                            title="تعديل الملاحظة"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDelete(note.id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="حذف الملاحظة"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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

                      {note.content && (
                        <p className="text-gray-600 mb-3 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                          {note.content}
                        </p>
                      )}

                      {note.images && note.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                          {note.images.map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(imageUrl, "_blank")}
                            />
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-400 border-t pt-2">
                        {new Date(note.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </>
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

export default DailyNotes;
