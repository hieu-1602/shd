import React, { useState } from 'react';
import { CostumeItem, getVietnameseColorName } from '../types/vietphuc';
import { X, Plus, Check, AlertTriangle, ShieldCheck, Bookmark, Trash2 } from 'lucide-react';
import { CostumeIllustration } from './CostumeIllustration';

interface ProductDetailModalProps {
  item: CostumeItem | null;
  onClose: () => void;
  onSendToStudio: (item: CostumeItem) => void;
  onAddToWardrobe: (item: CostumeItem) => void;
  onDeleteCostume: (id: string) => void;
  isSaved: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onSendToStudio,
  onAddToWardrobe,
  onDeleteCostume,
  isSaved,
}) => {
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  if (!item) return null;

  const allImages = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : []);
  const activeImage = allImages[photoIndex] || item.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#E7E2D8] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#78716C] hover:text-[#1A1918] bg-white/80 rounded-full hover:bg-white transition-all shadow-xs"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Visual Presentation Area */}
        <div className="w-full md:w-5/12 bg-transparent p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#EAE6DF]">
          {activeImage ? (
            <div className="flex flex-col items-center w-full">
              <img
                src={activeImage}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="max-h-[340px] w-auto object-contain rounded-lg drop-shadow-sm"
              />
              {allImages.length > 1 && (
                <div className="mt-3 flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      className={`w-12 h-14 rounded-md overflow-hidden border transition-all cursor-pointer bg-transparent flex items-center justify-center ${
                        photoIndex === i ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/20 scale-105' : 'border-[#DDD6CA] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-0.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <CostumeIllustration
              outerwear={item.category === 'ao_ngoai' || item.category === 'ao_trong' ? item : undefined}
              bottom={item.category === 'quan_vay' ? item : undefined}
              accessory={item.category === 'phu_kien' ? item : undefined}
              outerColor={item.heroColor}
              size="lg"
              showMannequin={true}
            />
          )}

          <div className="mt-4 flex items-center gap-3 text-xs text-[#57534E]">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: item.heroColor }}
              />
              <span>Sắc Độ Chuẩn</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{item.region}</span>
          </div>
        </div>

        {/* Right: Cultural Story & Contiguous Spec Area */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B] mb-1 flex items-center gap-1.5 flex-wrap">
                {item.era && (
                  <>
                    <span>{item.era}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>{item.region || 'Việt Nam'}</span>
                {item.gender && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#2A9D8F] lowercase first-letter:uppercase font-medium">Giới tính: {item.gender}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1918] font-display">
                {item.name}
              </h2>
              <p className="text-xs text-[#78716C] mt-1">Chất liệu: {item.material}</p>
              {item.creatorName && (
                <p className="text-xs text-[#57534E] mt-1">Tác giả: <strong className="text-[#1A1918]">{item.creatorName}</strong></p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#78716C]">Màu sắc:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#DDD6CA] text-xs font-semibold text-[#1A1918]">
                  <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: item.heroColor }} />
                  <span>{item.colorLabel || getVietnameseColorName(item.heroColor)}</span>
                </span>
              </div>
            </div>

            {/* Cultural Philosophy & Structure */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span>Ý Nghĩa Cấu Trúc & Triết Lý Văn Hóa</span>
              </h4>
              <p className="text-sm text-[#57534E] leading-relaxed bg-[#FAF9F6] p-3.5 rounded-lg border border-[#EDE8DF]">
                {item.culturalMeaning}
              </p>
            </div>

            {/* Origin & History */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1918]">
                Nguồn Gốc Lịch Sử
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                {item.originStory}
              </p>
            </div>

            {/* Gen Z Remix Tips */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] text-[#2A9D8F]">
                <span>Gợi Ý Phối Trang Phục Cho Gen Z</span>
              </h4>
              <p className="text-xs text-[#2D6A4F] bg-[#F2F8F5] p-3 rounded-md border border-[#D5EADB]">
                {item.remixTips}
              </p>
            </div>

            {/* Cultural Advisory / Warnings */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Lưu Ý Chuẩn Mực Văn Hóa (Cần Tránh)</span>
              </h4>
              <p className="text-xs text-[#831F20] bg-[#FDF2F2] p-3 rounded-md border border-[#FAD2D2] leading-relaxed">
                {item.culturalAdvisory}
              </p>
            </div>
          </div>

          {/* Action CTAs Bottom */}
          <div className="pt-6 mt-6 border-t border-[#EAE6DF] flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onSendToStudio(item);
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs"
            >
              <span>Đưa Vào Phòng Thử Đồ</span>
            </button>

            <button
              onClick={() => onAddToWardrobe(item)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-md border transition-all ${
                isSaved
                  ? 'bg-[#EBF3ED] text-[#2D6A4F] border-[#C3DEC9]'
                  : 'bg-white text-[#1A1918] border-[#DDD6CA] hover:bg-[#F5F2EB]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã Lưu Tủ Đồ</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Thêm Vào Tủ Đồ</span>
                </>
              )}
            </button>

            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2.5 py-2 text-xs font-semibold text-[#57534E] hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCostume(item.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xác Nhận Xóa</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-[#9E2A2B] hover:bg-[#FDF2F2] border border-[#FAD2D2] rounded-md transition-colors cursor-pointer"
                title="Xóa trang phục khỏi thư viện"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa Món Này</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
