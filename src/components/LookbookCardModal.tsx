import React, { useRef, useState } from 'react';
import { OutfitComposition } from '../types/vietphuc';
import { CostumeIllustration } from './CostumeIllustration';
import { X, Download, Copy, Check, Share2, Sparkles, QrCode } from 'lucide-react';

interface LookbookCardModalProps {
  outfit: OutfitComposition;
  onClose: () => void;
}

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({ outfit, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintOrSave = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E2A2B]">
              Thẻ Lookbook Việt Phục
            </span>
            <h3 className="text-xl font-bold text-[#1A1918] font-display">
              Xuất Bản Phối Thời Trang
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable / Sharable Poster Card */}
        <div
          ref={cardRef}
          className="bg-[#FAF8F5] border-2 border-[#E7E2D8] rounded-xl p-6 space-y-6 shadow-sm print:m-0 print:border-none"
        >
          {/* Top Bar of the Card */}
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3 text-xs">
            <span className="font-bold tracking-widest uppercase font-display text-sm text-[#1A1918]">
              CỔ PHỤC REMIX
            </span>
            <span className="text-[#78716C] tabular-nums font-mono text-[11px]">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Outfit Title & Creator */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-normal text-[#1A1918] font-display">
              {outfit.lookbookTitle || 'Bản Phối Cổ Phục Remix'}
            </h2>
            <p className="text-xs text-[#57534E]">
              Người Phối: <span className="font-semibold text-[#1A1918]">{outfit.creatorName || 'Người Yêu Di Sản'}</span>
              <span className="mx-2">·</span>
              Dịp: <span className="italic font-display text-[#9E2A2B]">{outfit.targetOccasion}</span>
            </p>
          </div>

          {/* Visual Centerpiece */}
          <div className="relative rounded-lg border border-[#EDE8DF] p-6 flex flex-col items-center justify-center shadow-2xs overflow-hidden bg-gradient-to-b from-[#FBFBFA] to-[#F5F2EB]">
            <div className="relative z-10 w-full max-w-sm flex items-center justify-center py-2">
              {outfit.customImage || outfit.fullOutfit?.imageUrl ? (
                <img
                  src={outfit.customImage || outfit.fullOutfit?.imageUrl}
                  alt={outfit.lookbookTitle}
                  className="max-h-64 w-auto object-contain rounded-lg shadow-sm"
                />
              ) : (
                <CostumeIllustration
                  outerwear={outfit.outerwear}
                  innerwear={outfit.innerwear}
                  bottom={outfit.bottom}
                  accessory={outfit.accessory}
                  footwear={outfit.footwear}
                  outerColor={outfit.customColorOuter}
                  innerColor={outfit.customColorInner || outfit.innerwear?.heroColor}
                  bottomColor={outfit.customColorBottom}
                  accessoryColor={outfit.customColorAccessory}
                  footwearColor={outfit.customColorFootwear || outfit.footwear?.heroColor}
                  size="md"
                  showMannequin={false}
                  gender={outfit.gender || 'Nam'}
                />
              )}
            </div>

            {/* Color Palette Swatches on Card */}
            <div className="relative z-10 flex items-center gap-2 mt-4 pt-3 border-t border-[#F2EFE9] bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-2xs">
              <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono">Bảng Màu:</span>
              <div
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: outfit.customColorOuter }}
                title="Áo chính"
              />
              <div
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: outfit.customColorBottom }}
                title="Quần/váy"
              />
              <div
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: outfit.customColorAccessory }}
                title="Phụ kiện"
              />
            </div>
          </div>

          {/* Lời Giới Thiệu Của Người Gửi (nếu có) */}
          {outfit.introduction && (
            <div className="bg-white p-3.5 rounded-lg border border-[#EDE8DF] text-xs text-[#1A1918] italic font-serif leading-relaxed shadow-2xs">
              <span className="font-semibold text-[#9E2A2B] not-italic block mb-1 text-[11px] uppercase tracking-wider">
                Lời Giới Thiệu Của Người Gửi:
              </span>
              “{outfit.introduction}”
            </div>
          )}

          {/* Spec details grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-lg border border-[#EDE8DF]">
            {outfit.fullOutfit && (
              <div className="col-span-2 pb-2 border-b border-[#F2EFE9]">
                <span className="text-[10px] text-[#9E2A2B] uppercase font-bold block">Bộ Trang Phục</span>
                <span className="font-semibold text-[#1A1918]">{outfit.fullOutfit.name}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] text-[#78716C] uppercase block">Áo Đầu Tiên / Thân Trên</span>
              <span className="font-semibold text-[#1A1918]">{outfit.innerwear?.name || 'Tự do'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#78716C] uppercase block">Áo Ngoài</span>
              <span className="font-semibold text-[#1A1918]">{outfit.outerwear?.name || 'Tự do'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#78716C] uppercase block">Lớp Dưới</span>
              <span className="font-semibold text-[#1A1918]">{outfit.bottom?.name || 'Quần lụa'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#78716C] uppercase block">Giày Dép</span>
              <span className="font-semibold text-[#1A1918]">{outfit.footwear?.name || 'Sneaker'}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-[#F2EFE9]">
              <span className="text-[10px] text-[#78716C] uppercase block">Phụ Kiện</span>
              <span className="font-semibold text-[#1A1918]">{outfit.accessory?.name || 'Không dùng'}</span>
            </div>
          </div>

          {/* Cultural Heritage Stamp Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D5] text-[11px] text-[#78716C]">
            <div className="flex items-center gap-1.5 text-[#9E2A2B] font-serif italic">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bảo tồn nguyên bản · Cách tân văn minh</span>
            </div>
            <div className="flex items-center gap-1 text-[#1A1918] font-mono text-[10px]">
              <QrCode className="w-4 h-4" />
              <span>LOOKBOOK #VN2026</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#1A1918] bg-[#F1EDE6] hover:bg-[#EAE5DA] rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span className="text-[#2D6A4F]">Đã Sao Chép Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao Chép Link Chia Sẻ</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrintOrSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-[#F4A261]" />
            <span>Lưu / In Thẻ Lookbook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
