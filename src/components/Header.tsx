import React, { useState } from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Menu,
  X,
  Archive,
  BookOpen,
  Compass,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'archive' | 'studio' | 'lookbook' | 'guides';
  setActiveTab: (tab: 'archive' | 'studio' | 'lookbook' | 'guides') => void;
  wardrobeCount: number;
  openWardrobeDrawer: () => void;
  openCmsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wardrobeCount,
  openWardrobeDrawer,
  openCmsModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              Trang Chủ
            </button>

            <button
              onClick={() => handleNavClick('studio')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer ${
                activeTab === 'studio'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
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

          {/* Zone 3: Actions (Thêm Trang Phục + Tủ Đồ) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Thêm trang phục - nút nhanh trên máy tính/tablet */}
            <button
              onClick={openCmsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A1918] bg-[#F1EDE6] hover:bg-[#E7E2D8] border border-[#DDD6CA] rounded-md transition-all whitespace-nowrap cursor-pointer shadow-2xs"
              title="Thêm hoặc tải ảnh trang phục mới"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Thêm Trang Phục</span>
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
                <span>Trang Chủ</span>
              </button>

              <button
                onClick={() => handleNavClick('studio')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'studio'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
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
