import React, { useState } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  Archive,
  BookOpen,
  Compass,
  Scissors,
  Eye,
} from 'lucide-react';

export type NavigationTab = 'archive' | 'studio' | 'showcase' | 'lookbook' | 'guides';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  wardrobeCount: number;
  openWardrobeDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wardrobeCount,
  openWardrobeDrawer,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavigationTab) => {
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
            className="text-2xl md:text-3xl font-bold tracking-wider text-[#9E2A2B] hover:text-[#7D2223] transition-colors font-display cursor-pointer"
          >
            CHẠM
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
              onClick={() => handleNavClick('showcase')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer ${
                activeTab === 'showcase'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              Trưng Bày
            </button>

            <button
              onClick={() => handleNavClick('lookbook')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer capitalize ${
                activeTab === 'lookbook'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              lookbook
            </button>

            <button
              onClick={() => handleNavClick('guides')}
              className={`whitespace-nowrap transition-colors hover:text-[#1A1918] cursor-pointer ${
                activeTab === 'guides'
                  ? 'text-[#9E2A2B] font-semibold border-b-2 border-[#9E2A2B] pb-1'
                  : 'pb-1'
              }`}
            >
              Quy Chuẩn
            </button>
          </nav>

          {/* Zone 3: Actions (Chỉ còn Tủ Đồ - Không còn nút Thêm Trang Phục ở ngoài) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
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
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'archive'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>Trang Chủ</span>
              </button>

              <button
                onClick={() => handleNavClick('studio')}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'studio'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>Xưởng May</span>
              </button>

              <button
                onClick={() => handleNavClick('showcase')}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'showcase'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>Trưng Bày</span>
              </button>

              <button
                onClick={() => handleNavClick('lookbook')}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'lookbook'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>lookbook</span>
              </button>

              <button
                onClick={() => handleNavClick('guides')}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'guides'
                    ? 'bg-[#9E2A2B] text-white font-semibold shadow-2xs'
                    : 'text-[#1A1918] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>Quy Chuẩn</span>
              </button>
            </div>

            {/* Mục thao tác nhanh cho điện thoại */}
            <div className="pt-3 mt-2 border-t border-[#EDE8DF]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWardrobeDrawer();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-md transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{wardrobeCount > 0 ? `Tủ Đồ · ${wardrobeCount}` : 'Tủ Đồ'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
