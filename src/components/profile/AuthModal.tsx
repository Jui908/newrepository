import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: name.trim() || email.split('@')[0] || 'Học viên K-Vocab',
      email: email.trim() || 'learner@koreanvocab.vn',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      level: 'Sơ cấp 1',
      targetGoal: 'Học từ đầu (Sơ cấp 1)',
      hasCompletedOnboarding: true,
      dailyGoal: 10,
      streakDays: 1,
      wordsLearned: 12,
      totalTestsTaken: 1,
      averageScore: 90,
      completedLessonIds: ['lesson-1'],
    };
    onLoginSuccess(newUser);
    onClose();
  };

  const handleOAuthLogin = (provider: 'Google' | 'Facebook') => {
    const oauthUser: UserProfile = {
      id: 'oauth-' + Date.now(),
      name: provider === 'Google' ? 'Thắng Nguyễn (Google)' : 'Nguyễn Thắng (Facebook)',
      email: provider === 'Google' ? 'ngthang123123@gmail.com' : 'thang.fb@koreanvocab.vn',
      avatar: provider === 'Google'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      level: 'Sơ cấp 1',
      targetGoal: 'Luyện thi TOPIK I',
      hasCompletedOnboarding: true,
      dailyGoal: 15,
      streakDays: 5,
      wordsLearned: 45,
      totalTestsTaken: 4,
      averageScore: 95,
      completedLessonIds: ['lesson-1', 'lesson-2'],
    };
    onLoginSuccess(oauthUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              KOREAN VOCAB
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-1">
              {tab === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Social Quick Login */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:border-stone-400 bg-white font-medium text-stone-700 text-sm flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Đăng nhập tiện lợi bằng Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('Facebook')}
              className="w-full py-2.5 px-4 rounded-xl border border-blue-600/30 bg-[#1877F2] hover:bg-[#166fe5] font-medium text-white text-sm flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng nhập qua Facebook
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-[#FFFDF9] px-3 text-xs text-stone-400 font-medium">hoặc email</span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Họ và tên của bạn:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Địa chỉ Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs"
            >
              {tab === 'login' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
            </button>
          </form>

          <div className="text-center">
            {tab === 'login' ? (
              <p className="text-xs text-stone-500">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  Đăng ký miễn phí
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Bảo mật thông tin & đồng bộ tiến độ học tập trên mọi thiết bị
        </div>
      </div>
    </div>
  );
};
