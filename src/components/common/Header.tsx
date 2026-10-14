import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  BookOpen,
  Layers,
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  AlertCircle,
  Flame,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'review' | 'tests' | 'roadmap' | 'notebooks';
  onSelectTab: (tab: 'home' | 'review' | 'tests' | 'roadmap' | 'notebooks') => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenReport: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenReport,
  onOpenOnboarding,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base tracking-tighter">한</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                  KOREAN VOCAB
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[10.5px] font-medium text-stone-500 tracking-wide uppercase">
                Học & Ôn Tập Tiếng Hàn Thông Minh
              </p>
            </div>
          </button>

          {/* Main Navigation Horizontal */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === 'home'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Trang chủ
            </button>

            <button
              onClick={() => onSelectTab('review')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === 'review'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Ôn tập Flashcard
            </button>

            <button
              onClick={() => onSelectTab('tests')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === 'tests'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Thi thử TOPIK
            </button>

            <button
              onClick={() => onSelectTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === 'roadmap'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Tiến độ học tập
            </button>

            <button
              onClick={() => onSelectTab('notebooks')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === 'notebooks'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              Sổ tay tự chọn
            </button>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Error report quick button */}
          <button
            onClick={onOpenReport}
            title="Báo cáo lỗi từ vựng"
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl border border-stone-200 hover:border-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Báo lỗi từ</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-stone-200/60 border border-stone-200/80 transition-colors focus:outline-none"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/40"
                  />
                  {user.streakDays > 0 && (
                    <span className="absolute -bottom-1 -right-1 flex items-center justify-center bg-amber-500 text-white rounded-full w-4 h-4 text-[9px] font-black shadow-xs">
                      🔥
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <p className="text-xs font-bold text-stone-800 leading-none">{user.name}</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">{user.level}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF9] rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{user.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg font-medium">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Chuỗi học: {user.streakDays} ngày
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      Cài đặt tài khoản & Đổi mật khẩu
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-stone-400" />
                      Khảo sát lại trình độ & Mục tiêu
                    </button>

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/80 px-2 py-1.5 bg-[#FAF7F2]">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'home' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Trang chủ
        </button>
        <button
          onClick={() => onSelectTab('review')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'review' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          Ôn tập
        </button>
        <button
          onClick={() => onSelectTab('tests')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'tests' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Thi thử
        </button>
        <button
          onClick={() => onSelectTab('roadmap')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'roadmap' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Lộ trình
        </button>
        <button
          onClick={() => onSelectTab('notebooks')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'notebooks' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          Sổ tay
        </button>
      </div>
    </header>
  );
};
