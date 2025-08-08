import {
  CheckCircle,
  Target,
  BookOpen,
  Sparkles,
  ShoppingCart,
  Brain,
  AlarmClock,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-blue-300/15 to-indigo-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-12 text-center max-w-lg w-full border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg hover:rotate-6 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
              مرحبًا بك في
              <br />
              <span className="text-4xl">LifeTrack</span>
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Feature
              icon={<CheckCircle className="text-blue-600" />}
              label="المهام"
              color="text-blue-800"
              bg="from-slate-50 to-blue-100"
            />
            <Feature
              icon={<BookOpen className="text-indigo-600" />}
              label="الملاحظات"
              color="text-indigo-800"
              bg="from-blue-50 to-indigo-100"
            />
            <Feature
              icon={<Target className="text-purple-600" />}
              label="الأهداف"
              color="text-purple-800"
              bg="from-indigo-50 to-purple-100"
            />
            <Feature
              icon={<ShoppingCart className="text-pink-600" />}
              label="المشتريات"
              color="text-pink-800"
              bg="from-pink-50 to-pink-100"
            />
            <Feature
              icon={<Brain className="text-yellow-600" />}
              label="العادات"
              color="text-yellow-800"
              bg="from-yellow-50 to-yellow-100"
            />
            <Feature
              icon={<AlarmClock className="text-red-600" />}
              label="التذكيرات"
              color="text-red-800"
              bg="from-red-50 to-red-100"
            />
            <Feature
              icon={<Wallet className="text-green-600" />}
              label="المصاريف"
              color="text-green-800"
              bg="from-green-50 to-green-100"
            />
          </div>

          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            نظّم مهامك، سجّل ملاحظاتك، وتابع أهدافك اليومية بسهولة
            <br />
            <span className="text-blue-600 font-medium">
              ابدأ رحلتك نحو الإنتاجية اليوم! 🚀
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/login"
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                تسجيل الدخول
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  🔑
                </span>
              </span>
            </Link>
            <Link
              to="/register"
              className="group px-6 py-3 bg-white border-2 border-blue-500 text-blue-700 rounded-2xl font-medium text-base shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                إنشاء حساب
                <span className="group-hover:rotate-12 transition-transform duration-300">
                  ✨
                </span>
              </span>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-200">
            <p className="text-xs text-gray-500">
              انضم إلى آلاف المستخدمين الذين يحققون أهدافهم معنا
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label, color, bg }) {
  return (
    <div
      className={`flex flex-col items-center p-2 bg-gradient-to-br ${bg} rounded-xl hover:scale-105 transition-transform duration-300`}
    >
      <div className="w-6 h-6 mb-1">{icon}</div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
}

export default Home;
