import React, { useState } from 'react';
import { AppUser, SUPER_ADMIN_EMAIL } from '../types/auth';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onLogin: (user: AppUser) => void;
  registeredUsers: AppUser[];
  onRegister: (newUser: AppUser, password?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  registeredUsers,
  onRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickAdminLogin = () => {
    // Quick login as Super Admin
    const adminUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    ) || {
      uid: 'admin_super_root',
      email: SUPER_ADMIN_EMAIL,
      displayName: 'Quản Trị Viên (Root)',
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
    };

    onLogin(adminUser);
    setSuccessMessage(`Đã đăng nhập thành công với quyền Admin: ${SUPER_ADMIN_EMAIL}`);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email/gmail!');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setErrorMessage('Địa chỉ email không đúng định dạng!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự!');
      return;
    }

    if (activeTab === 'register') {
      // Check if user already exists
      const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setErrorMessage('Tài khoản với email này đã tồn tại, vui lòng chuyển qua Đăng nhập!');
        return;
      }

      // Role check: Only bqutrhieu1602@gmail.com is initialized as admin, others as user
      const isSuperAdmin = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const newUser: AppUser = {
        uid: `user_${Date.now()}`,
        email: cleanEmail,
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        role: isSuperAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      };

      onRegister(newUser, password);
      onLogin(newUser);
      setSuccessMessage(
        `Đăng ký thành công! Bạn đang đăng nhập với quyền: ${
          newUser.role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Thành Viên (Người Dùng)'
        }`
      );
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      // Login mode
      const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        onLogin(existing);
        setSuccessMessage(`Đăng nhập thành công! Quyền: ${existing.role === 'admin' ? 'Admin' : 'Thành Viên'}`);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // If logging in as SUPER_ADMIN_EMAIL for the first time
        if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
          const rootAdmin: AppUser = {
            uid: `admin_${Date.now()}`,
            email: SUPER_ADMIN_EMAIL,
            displayName: displayName.trim() || 'Quản Trị Viên',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          onRegister(rootAdmin, password);
          onLogin(rootAdmin);
          setSuccessMessage('Đăng nhập thành công với tư cách Quản Trị Viên (Admin)!');
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setErrorMessage('Tài khoản chưa được đăng ký trong hệ thống. Vui lòng bấm tab "Đăng Ký Tài Khoản" để tạo tài khoản mới!');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
              <ShieldCheck className="w-4 h-4" />
              <span>Hệ Thống Xác Thực & Phân Quyền</span>
            </div>
            <h3 className="text-xl font-bold text-[#1A1918] font-display mt-0.5">
              {activeTab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-[#FAF9F6] p-1 border border-[#DDD6CA]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#9E2A2B] shadow-xs'
                : 'text-[#78716C] hover:text-[#1A1918]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-[#9E2A2B] shadow-xs'
                : 'text-[#78716C] hover:text-[#1A1918]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký Bằng Gmail</span>
          </button>
        </div>

        {/* Informative Rule Box */}
        <div className="bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-3 text-xs space-y-1.5 leading-relaxed text-[#57534E]">
          <div className="font-semibold text-[#1A1918] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9E2A2B]" />
            <span>Phân quyền tài khoản hệ thống:</span>
          </div>
          <p className="text-[11px]">
            • Tài khoản duy nhất <strong className="text-[#9E2A2B]">{SUPER_ADMIN_EMAIL}</strong> có quyền Admin mặc định và có thể duyệt cấp quyền Admin cho các tài khoản khác.
          </p>
          <p className="text-[11px]">
            • <strong>Quyền Admin:</strong> Được phép thêm hình ảnh, tải lên trang phục và xóa trang phục.
          </p>
          <p className="text-[11px]">
            • <strong>Người dùng thông thường:</strong> Tự do trải nghiệm Xưởng may, phối đồ và xuất Lookbook.
          </p>
        </div>

        {/* Error / Success Notices */}
        {errorMessage && (
          <div className="p-3 bg-[#FDF2F2] border border-[#FAD2D2] text-[#831F20] text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-[#F2F8F5] border border-[#D5EADB] text-[#2D6A4F] text-xs rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1918]">Họ và Tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nhập tên hiển thị của bạn"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1918]">
              Địa Chỉ Gmail Cá Nhân <span className="text-[#9E2A2B]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="vidu@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1918]">
              Mật Khẩu <span className="text-[#9E2A2B]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {activeTab === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Ngay</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký Tài Khoản</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Admin Login button for direct access */}
        <div className="pt-2 border-t border-[#F2EFE9] space-y-2">
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="w-full py-2 text-xs font-medium text-[#1A1918] bg-[#FAF8F5] hover:bg-[#F1EDE6] border border-[#DDD6CA] rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Đăng nhập trực tiếp với quyền Quản trị viên"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#9E2A2B]" />
            <span>Đăng nhập nhanh với Admin ({SUPER_ADMIN_EMAIL})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
