import React, { useState } from 'react';
import { AppUser, SUPER_ADMIN_EMAIL } from '../types/auth';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  User,
  Mail,
  Calendar,
  Check,
  Search,
} from 'lucide-react';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  registeredUsers: AppUser[];
  onToggleUserRole: (userId: string, newRole: 'admin' | 'user') => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  registeredUsers,
  onToggleUserRole,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const isRootAdmin = currentUser?.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảng Điều Khiển Quản Trị Viên</span>
            </div>
            <h3 className="text-xl font-bold text-[#1A1918] font-display mt-0.5">
              Duyệt & Quản Lý Quyền Admin
            </h3>
            <p className="text-xs text-[#78716C] mt-1">
              Chỉ Quản trị viên gốc (<strong className="text-[#9E2A2B]">{SUPER_ADMIN_EMAIL}</strong>) có quyền duyệt và phân quyền Admin cho người khác.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo email gmail hoặc tên người dùng..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
          />
        </div>

        {/* User list */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#1A1918] flex items-center justify-between">
            <span>Danh sách tài khoản ({filteredUsers.length}):</span>
            <span className="text-[11px] text-[#78716C] font-normal">
              Admin được quyền thêm và xóa hình ảnh, trang phục
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 bg-[#FAF9F6] border border-[#EDE8DF] rounded-xl p-4 text-xs text-[#78716C]">
              Chưa có tài khoản nào khác được đăng ký.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isThisRoot = user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                const isAdmin = user.role === 'admin';

                return (
                  <div
                    key={user.uid}
                    className="flex items-center justify-between p-3.5 bg-[#FAF9F6] border border-[#EDE8DF] rounded-xl hover:border-[#DDD6CA] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          isAdmin
                            ? 'bg-[#9E2A2B] text-white shadow-xs'
                            : 'bg-[#EDE8DF] text-[#57534E]'
                        }`}
                      >
                        {user.displayName.charAt(0).toUpperCase() || 'U'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1A1918]">
                            {user.displayName}
                          </span>
                          {isThisRoot && (
                            <span className="text-[10px] font-semibold text-[#9E2A2B] bg-[#9E2A2B]/10 px-2 py-0.5 rounded">
                              Super Admin Gốc
                            </span>
                          )}
                          {!isThisRoot && isAdmin && (
                            <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#EBF3ED] px-2 py-0.5 rounded">
                              Đã Duyệt Admin
                            </span>
                          )}
                          {!isAdmin && (
                            <span className="text-[10px] text-[#78716C] bg-white border border-[#DDD6CA] px-1.5 py-0.2 rounded">
                              Thành viên
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#78716C] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-[#9E2A2B]" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div>
                      {isThisRoot ? (
                        <span className="text-xs text-[#78716C] italic px-3 py-1">
                          Toàn quyền hệ thống
                        </span>
                      ) : isRootAdmin ? (
                        isAdmin ? (
                          <button
                            type="button"
                            onClick={() => onToggleUserRole(user.uid, 'user')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#831F20] bg-white hover:bg-[#FDF2F2] border border-[#FAD2D2] rounded-md transition-colors cursor-pointer"
                            title="Hủy quyền Admin của tài khoản này"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Hủy Quyền Admin</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleUserRole(user.uid, 'admin')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#20513B] rounded-md transition-colors cursor-pointer shadow-xs"
                            title="Cấp quyền Admin cho tài khoản này"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Duyệt Làm Admin</span>
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-[#78716C] italic px-2">
                          {isAdmin ? 'Quyền Admin' : 'Quyền Thành viên'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
