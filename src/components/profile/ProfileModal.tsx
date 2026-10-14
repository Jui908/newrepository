import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { User, KeyRound, Flame, Award, BookOpen, Check, X, Shield } from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'stats'>('info');
  const [name, setName] = useState(user.name);
  const [targetGoal, setTargetGoal] = useState(user.targetGoal);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen) return null;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      targetGoal,
      dailyGoal,
    };
    onUpdate(updated);
    onClose();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <h3 className="font-bold text-stone-900 text-lg leading-tight">{user.name}</h3>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-stone-100 bg-stone-50/30 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <User className="w-4 h-4" />
            Hồ sơ cá nhân
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'stats'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Flame className="w-4 h-4" />
            Thống kê học tập
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'password'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Đổi mật khẩu
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Họ và tên hiển thị:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mục tiêu học tập chính:
                </label>
                <select
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="Học từ đầu (Sơ cấp 1)">Học từ đầu (Sơ cấp 1)</option>
                  <option value="Luyện thi TOPIK I">Luyện thi TOPIK I</option>
                  <option value="Luyện thi TOPIK II">Luyện thi TOPIK II</option>
                  <option value="Giao tiếp hàng ngày">Giao tiếp hàng ngày</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Chỉ tiêu số từ ôn luyện mỗi ngày:
                </label>
                <div className="flex items-center gap-3">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDailyGoal(num)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors ${
                        dailyGoal === num
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {num} từ
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Đăng xuất tài khoản
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Flame className="w-5 h-5" />
                    <span className="text-xs font-bold">Chuỗi học tập</span>
                  </div>
                  <p className="text-2xl font-black text-amber-900 mt-1">
                    {user.streakDays} <span className="text-xs font-medium">ngày liên tiếp</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs font-bold">Từ đã ghi nhớ</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    {user.wordsLearned} <span className="text-xs font-medium">từ vựng</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="flex items-center gap-2 text-sky-800">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-bold">Bài thi đã làm</span>
                  </div>
                  <p className="text-2xl font-black text-sky-900 mt-1">
                    {user.totalTestsTaken} <span className="text-xs font-medium">đề kiểm tra</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-800">
                    <Shield className="w-5 h-5" />
                    <span className="text-xs font-bold">Điểm trung bình</span>
                  </div>
                  <p className="text-2xl font-black text-purple-900 mt-1">
                    {user.averageScore}% <span className="text-xs font-medium">độ chính xác</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">Tiến độ lộ trình học:</p>
                <p>
                  Đã hoàn thành {user.completedLessonIds.length} bài học và các bài tập củng cố tương ứng.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Mật khẩu của bạn đã được cập nhật thành công!
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mật khẩu hiện tại:
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Xác nhận đổi mật khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
