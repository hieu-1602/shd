import React from 'react';
import { NavigationTab } from './Header';

interface FooterProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="border-t border-[#EAE6DF] bg-[#FAF8F5] text-[#57534E] text-xs py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto pb-6 border-b border-[#EDE8DF]">
        {/* Brand & Mission */}
        <div className="space-y-2 max-w-xl">
          <span className="text-2xl font-bold tracking-wider text-[#9E2A2B] font-display block">
            CHẠM
          </span>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Nền tảng số phi thương mại giúp cộng đồng khám phá, nghiên cứu và phối trang
            phục truyền thống Việt Nam theo phong cách đương đại. Tôn trọng lịch sử · Khơi nguồn sáng tạo.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#78716C]">
        <span>Dự Án: <strong className="text-[#9E2A2B]">CHẠM</strong> · Di Sản Trong Nhịp Sống Đương Đại</span>
        <div className="flex items-center gap-4">
          <span>Dành cho cộng đồng yêu văn hóa Việt Nam</span>
        </div>
      </div>
    </footer>
  );
};
