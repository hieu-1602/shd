import React from 'react';

interface FooterProps {
  onNavigate: (tab: 'archive' | 'studio' | 'lookbook' | 'guides') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#EAE6DF] bg-[#FAF8F5] text-[#57534E] text-xs py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#EDE8DF]">
        {/* Col 1: Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-xl font-bold tracking-tight text-[#1A1918] font-display">
            CỔ PHỤC REMIX
          </span>
          <p className="text-xs text-[#78716C] leading-relaxed max-w-sm">
            Nền tảng số phi thương mại giúp cộng đồng khám phá, nghiên cứu và phối trang
            phục truyền thống Việt Nam theo phong cách đương đại. Tôn trọng lịch sử · Khơi nguồn sáng tạo.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2">
          <span className="font-semibold text-[#1A1918] uppercase tracking-wider text-[11px] block">
            Điều Hướng
          </span>
          <div className="space-y-1.5 flex flex-col">
            <button
              onClick={() => onNavigate('archive')}
              className="text-left text-[#57534E] hover:text-[#1A1918] transition-colors"
            >
              Kho Di Sản Việt Phục
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="text-left text-[#57534E] hover:text-[#1A1918] transition-colors"
            >
              Xưởng May Tương Tác
            </button>
            <button
              onClick={() => onNavigate('lookbook')}
              className="text-left text-[#57534E] hover:text-[#1A1918] transition-colors"
            >
              Lookbook Gen Z
            </button>
            <button
              onClick={() => onNavigate('guides')}
              className="text-left text-[#57534E] hover:text-[#1A1918] transition-colors"
            >
              Cẩm Nang Quy Chuẩn Văn Hóa
            </button>
          </div>
        </div>

        {/* Col 3: Cultural Sources & Dedication */}
        <div className="space-y-2">
          <span className="font-semibold text-[#1A1918] uppercase tracking-wider text-[11px] block">
            Tài Liệu Tham Khảo
          </span>
          <p className="text-[11px] text-[#78716C] leading-relaxed">
            Dữ liệu khảo cứu dựa trên các nghiên cứu về trang phục triều Nguyễn, tư liệu Đại Nam
            Thực Lục và các dự án phục dựng cổ phục Việt của các nhóm nghiên cứu trẻ.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#78716C]">
        <span>Dự Án: Cổ Phục Remix · Di Sản Trong Nhịp Sống Đương Đại</span>
        <div className="flex items-center gap-4">
          <span>Phiên bản thử nghiệm 2026</span>
          <span aria-hidden="true">·</span>
          <span>Dành cho cộng đồng yêu văn hóa Việt Nam</span>
        </div>
      </div>
    </footer>
  );
};
