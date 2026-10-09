import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Menu,
  X,
  Archive,
  BookOpen,
  Compass,
  User,
  ShieldCheck,
  LogOut,
  Scissors,
  Users,
} from 'lucide-react';
import { AppUser } from '../types/auth';

interface HeaderProps {
  activeTab: 'archive' | 'studio' | 'lookbook' | 'guides';
  setActiveTab: (tab: 'archive' | 'studio' | 'lookbook' | 'guides') => void;
  wardrobeCount: number;
  openWardrobeDrawer: () => void;
  openCmsModal: () => void;
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onOpenAdminModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wardrobeCount,
  openWardrobeDrawer,
  openCmsModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenAdminModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleNavClick = (tab: 'archive' | 'studio' | 'lookbook' | 'guides') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Wordmark */}
          <button
            onClick={() => handleNavClick('archive')}
            className="text-xl md:text-2xl font-bold tracking-tight text-[#1A1918] hover:text-[#9E2A2B] transition-colors font-display cursor-pointer"
          >
            CỔ PHỤC REMIX
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#57534E]">
            <button
              onClick={() => handleNavClick('archive')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer ${
                activeTab === 'archive'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              Kho Di Sản
            </button>

            {/* Sửa phần tên Phòng Phối Đồ thành Xưởng May */}
            <button
              onClick={() => handleNavClick('studio')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'studio'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-[#9E2A2B]" />
              Xưởng May
            </button>

            <button
              onClick={() => handleNavClick('lookbook')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer ${
                activeTab === 'lookbook'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              Lookbook Gen Z
            </button>

            <button
              onClick={() => handleNavClick('guides')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer ${
                activeTab === 'guides'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              Quy Chuẩn Cổ Phục
            </button>
          </nav>

          {/* Zone 3: Actions (Auth + Thêm Trang Phục + Tủ Đồ) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* User Account / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-[#F8F5EE] border border-[#DDD6CA] rounded-md transition-all shadow-2xs cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${
                    currentUser.role === 'admin' ? 'bg-[#9E2A2B]' : 'bg-[#57534E]'
                  }`}>
                    {currentUser.displayName.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline text-[#1A1918]">
                    {currentUser.displayName}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    currentUser.role === 'admin'
                      ? 'bg-[#9E2A2B] text-white'
                      : 'bg-[#EDE8DF] text-[#57534E]'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin' : 'Thành Viên'}
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-60 bg-white border border-[#E7E2D8] rounded-xl shadow-lg p-2 z-50 text-xs animate-in fade-in duration-150">
                    <div className="p-2 border-b border-[#F2EFE9] space-y-0.5">
                      <div className="font-bold text-[#1A1918] truncate">{currentUser.displayName}</div>
                      <div className="text-[11px] text-[#78716C] truncate">{currentUser.email}</div>
                      <div className="pt-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          currentUser.role === 'admin' ? 'bg-[#9E2A2B]/10 text-[#9E2A2B]' : 'bg-[#EDE8DF] text-[#57534E]'
                        }`}>
                          Quyền: {currentUser.role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Thành Viên'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      {currentUser.role === 'admin' && onOpenAdminModal && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            onOpenAdminModal();
                          }}
                          className="w-full text-left px-2.5 py-2 hover:bg-[#FAF8F5] text-[#9E2A2B] rounded-md font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Duyệt & Quản Lý Admin</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout?.();
                        }}
                        className="w-full text-left px-2.5 py-2 hover:bg-[#FDF2F2] text-[#831F20] rounded-md font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A1918] bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-md transition-all shadow-2xs cursor-pointer"
                title="Đăng ký hoặc đăng nhập bằng Gmail cá nhân"
              >
                <User className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span>Đăng Nhập / Đăng Ký</span>
              </button>
            )}

            {/* Thêm trang phục - nút nhanh trên máy tính/tablet */}
            <button
              onClick={openCmsModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A1918] bg-[#F1EDE6] hover:bg-[#E7E2D8] border border-[#DDD6CA] rounded-md transition-all whitespace-nowrap cursor-pointer"
              title="Thêm hoặc tải ảnh trang phục mới"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#9E2A2B]" />
              Thêm Trang Phục
            </button>

            {/* Nút Tủ Đồ */}
            <button
              onClick={openWardrobeDrawer}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-medium text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-md transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              aria-label="Mở tủ đồ của bạn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">Tủ Đồ</span>
              {wardrobeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#E07A5F] text-[10px] font-bold text-white flex items-center justify-center">
                  {wardrobeCount}
                </span>
              )}
            </button>

            {/* Icon 3 dấu gạch (Menu Hamburger) cho điện thoại di động */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1918] hover:text-[#9E2A2B] hover:bg-[#EAE6DF] rounded-md transition-colors border border-[#DDD6CA] bg-[#FAF8F5] cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Đóng bảng điều hướng' : 'Mở bảng điều hướng điện thoại'}
              title="Menu điều hướng"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#9E2A2B]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Bảng điều hướng dạng xổ xuống (Mobile Drawer / Dropdown) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-[#EAE6DF] mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User status in mobile menu */}
            <div className="p-2 mb-2 bg-[#FAF8F5] rounded-lg border border-[#EDE8DF] flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${
                    currentUser.role === 'admin' ? 'bg-[#9E2A2B]' : 'bg-[#57534E]'
                  }`}>
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1918]">{currentUser.displayName}</div>
                    <div className="text-[10px] text-[#9E2A2B] font-semibold">
                      {currentUser.role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Thành Viên'}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal?.();
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-[#9E2A2B] text-center"
                >
                  Đăng Nhập / Đăng Ký Bằng Gmail
                </button>
              )}

              {currentUser && (
                <div className="flex items-center gap-1.5">
                  {currentUser.role === 'admin' && onOpenAdminModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAdminModal();
                      }}
                      className="text-[10px] px-2 py-1 bg-white border border-[#DDD6CA] rounded text-[#9E2A2B] font-semibold"
                    >
                      Duyệt Admin
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="p-1 text-[#831F20]"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('archive')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'archive'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <Archive className="w-4 h-4 shrink-0" />
                <span>Kho Di Sản</span>
              </button>

              <button
                onClick={() => handleNavClick('studio')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'studio'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <Scissors className="w-4 h-4 shrink-0" />
                <span>Xưởng May</span>
              </button>

              <button
                onClick={() => handleNavClick('lookbook')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'lookbook'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Lookbook Gen Z</span>
              </button>

              <button
                onClick={() => handleNavClick('guides')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'guides'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Quy Chuẩn Cổ Phục</span>
              </button>
            </div>

            {/* Mục thao tác nhanh cho điện thoại */}
            <div className="pt-3 mt-2 border-t border-[#EDE8DF] flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCmsModal();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#1A1918] bg-[#F1EDE6] hover:bg-[#E7E2D8] border border-[#DDD6CA] rounded-md transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#9E2A2B]" />
                  <span>Thêm Trang Phục</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWardrobeDrawer();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-md transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Tủ Đồ ({wardrobeCount})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
