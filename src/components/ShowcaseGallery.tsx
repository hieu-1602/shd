import React, { useState } from 'react';
import {
  CostumeItem,
  CostumeCategory,
  CustomOutfit,
  getVietnameseColorName,
  getCategoryOrderIndex,
} from '../types/vietphuc';
import {
  Shirt,
  Scissors,
  Trash2,
  User,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  FolderOpen,
  Edit3,
  Check,
  X,
  BookOpen,
} from 'lucide-react';

interface ShowcaseGalleryProps {
  outfits: CustomOutfit[];
  selectedOutfitId?: string;
  onSelectOutfit: (id: string) => void;
  onDeleteOutfit: (id: string) => void;
  onUpdateOutfit?: (outfit: CustomOutfit) => void;
  onNavigateToWorkshop: () => void;
  onOpenItemDetailModal?: (item: CostumeItem) => void;
}

interface CategoryMeta {
  key: CostumeCategory;
  label: string;
  shortLabel: string;
}

// Thứ tự hiển thị chuẩn xác từ trên xuống dưới theo yêu cầu:
// bộ trang phục -> áo ngoài (mặt trước) -> áo ngoài (mặt sau) -> áo trong -> thân dưới -> giày dép -> phụ kiện
const CATEGORY_META_LIST: CategoryMeta[] = [
  { key: 'bo_trang_phuc', label: 'BỘ TRANG PHỤC', shortLabel: 'Bộ Trang Phục' },
  { key: 'ao_ngoai', label: 'ÁO NGOÀI (MẶT TRƯỚC)', shortLabel: 'Áo Ngoài (Mặt Trước)' },
  { key: 'ao_ngoai_sau', label: 'ÁO NGOÀI (MẶT SAU)', shortLabel: 'Áo Ngoài (Mặt Sau)' },
  { key: 'ao_trong', label: 'ÁO TRONG', shortLabel: 'Áo Trong' },
  { key: 'quan_vay', label: 'THÂN DƯỚI', shortLabel: 'Thân Dưới' },
  { key: 'giay_dep', label: 'GIÀY DÉP', shortLabel: 'Giày Dép' },
  { key: 'phu_kien', label: 'PHỤ KIỆN', shortLabel: 'Phụ Kiện' },
];


export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  outfits,
  selectedOutfitId,
  onSelectOutfit,
  onDeleteOutfit,
  onUpdateOutfit,
  onNavigateToWorkshop,
  onOpenItemDetailModal,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [editIntroText, setEditIntroText] = useState('');

  // Bộ trang phục hiện đang được chọn xem
  const activeOutfit =
    outfits.find((o) => o.id === selectedOutfitId) || outfits[0] || null;

  const handleDeleteActiveOutfit = (outfit: CustomOutfit) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa bộ trang phục "${outfit.name}" khỏi phòng trưng bày không?`
      )
    ) {
      onDeleteOutfit(outfit.id);
    }
  };

  // NẾU CHƯA CÓ BỘ TRANG PHỤC NÀO ĐƯỢC THÊM TỪ XƯỞNG MAY:
  // Hiển thị màn hình trống thân thiện, không có trang phục mẫu trộn lẫn
  if (!activeOutfit || outfits.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 animate-in fade-in duration-300">
        <div className="text-center py-20 bg-white border border-[#DDD6CA] rounded-3xl p-8 max-w-2xl mx-auto shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#DDD6CA] flex items-center justify-center mx-auto text-[#9E2A2B]">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
              Phòng Trưng Bày Di Sản
            </span>
            <h2 className="text-2xl md:text-3xl font-normal text-[#1A1918] font-display">
              Chưa Có Bộ Trang Phục Nào Được Thêm
            </h2>
            <p className="text-xs md:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
              Phòng Trưng Bày chỉ hiển thị những bộ trang phục bạn đã tạo từ <strong>Xưởng May</strong>. Mỗi bộ trang phục sẽ được trưng bày hoàn toàn riêng biệt với các thành phần của riêng nó!
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onNavigateToWorkshop}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#9E2A2B] hover:bg-[#7D2223] rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              <span>Đến Xưởng May May Đo Bộ Trang Phục Đầu Tiên</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Danh sách các thành phần của RIÊNG BỘ TRANG PHỤC ĐANG XEM
  const components = activeOutfit.components || [];

  // Lọc chỉ những danh mục NÀO THỰC SỰ CÓ MÓN ĐỒ trong bộ trang phục này:
  // "ở phần trưng bày, chỉ hiển thị những mục mà có những món đồ đã được thêm từ phần xưởng may, nếu không không trang phục ở mục thành phần đó thì sẽ không hiển thị mục đó."
  const availableCategories = CATEGORY_META_LIST.filter((cat) =>
    components.some((item) => {
      if (cat.key === 'ao_ngoai') return item.category === 'ao_ngoai' || item.category === 'ao_ngoai_truoc';
      return item.category === cat.key;
    })
  );

  // Gom các hình ảnh của riêng bộ này
  const outfitImages: string[] = [];
  if (activeOutfit.imageUrl) outfitImages.push(activeOutfit.imageUrl);
  if (activeOutfit.imageUrls) {
    activeOutfit.imageUrls.forEach((url) => {
      if (!outfitImages.includes(url)) outfitImages.push(url);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300 space-y-8">
      {/* Top Banner & Outfit Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            <span>Phòng Trưng Bày Cổ Phục · Từng Bộ Trang Phục Riêng Lẻ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Trưng Bày Trang Phục
          </h2>
          <p className="text-sm text-[#57534E] mt-1 max-w-xl">
            Mỗi bộ trang phục được trưng bày riêng biệt với các thành phần của riêng bộ đó. Bạn có thể bấm chọn từng bộ bên dưới để xem chi tiết!
          </p>
        </div>

        <button
          onClick={onNavigateToWorkshop}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1A1918] bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
        >
          <Scissors className="w-3.5 h-3.5 text-[#9E2A2B]" />
          <span>Thêm Bộ Trang Phục Mới Ở Xưởng May</span>
        </button>
      </div>

      {/* THANH CHỌN BỘ TRANG PHỤC: HIỂN THỊ TỪNG BỘ TRANG PHỤC RIÊNG LẺ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#1A1918] uppercase tracking-wider">
            Các Bộ Trang Phục Đã Thêm ({outfits.length} bộ)
          </span>
          <span className="text-xs text-[#78716C]">
            Bấm vào từng bộ để xem chi tiết riêng lẻ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {outfits.map((outfit) => {
            const isSelected = outfit.id === activeOutfit.id;
            const primaryImg =
              outfit.imageUrl ||
              outfit.components.find((c) => c.imageUrl)?.imageUrl;

            return (
              <button
                key={outfit.id}
                type="button"
                onClick={() => {
                  onSelectOutfit(outfit.id);
                  setSelectedPhotoIndex(0);
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#9E2A2B] bg-[#FAF8F5] ring-2 ring-[#9E2A2B]/10 shadow-sm'
                    : 'border-[#DDD6CA] bg-white hover:border-[#1A1918] hover:bg-[#FAF8F5]'
                }`}
              >
                {/* Thumbnail */}
                {primaryImg ? (
                  <img
                    src={primaryImg}
                    alt={outfit.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#DDD6CA] shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl border border-black/10 shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: outfit.heroColor || '#9E2A2B' }}
                  >
                    <Shirt className="w-5 h-5 opacity-90" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1A1918] truncate">
                    {outfit.name}
                  </h4>
                  <p className="text-[11px] text-[#78716C] truncate mt-0.5">
                    Tác giả: {outfit.creatorName || 'Người Yêu Di Sản'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#9E2A2B] font-semibold mt-1">
                    <span>{outfit.components.length} thành phần</span>
                    <span>·</span>
                    <span>{outfit.gender || 'Cổ phục'}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#9E2A2B] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHI TIẾT BỘ TRANG PHỤC ĐANG ĐƯỢC CHỌN (HOÀN TOÀN TÁCH BIỆT) */}
      <div className="bg-white border border-[#DDD6CA] rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
        {/* Header của Bộ đang chọn */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#F2EFE9]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B] bg-[#FAF8F5] border border-[#DDD6CA] px-2.5 py-1 rounded-full">
                {activeOutfit.gender || 'Cổ phục'} · {activeOutfit.components.length} Thành Phần
              </span>
              <span className="text-xs text-[#78716C]">
                Mã: #{activeOutfit.id.slice(-6)}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-normal text-[#1A1918] font-display">
              {activeOutfit.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[#57534E] flex-wrap">
              <span>
                Tác giả: <strong className="text-[#1A1918]">{activeOutfit.creatorName || 'Người Yêu Di Sản'}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: activeOutfit.heroColor || '#9E2A2B' }}
                />
                <span>Tông màu: {activeOutfit.colorLabel || getVietnameseColorName(activeOutfit.heroColor)}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDeleteActiveOutfit(activeOutfit)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
              title="Xóa bộ trang phục này"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Bộ Trang Phục Này</span>
            </button>
          </div>
        </div>

        {/* Khu vực Trực Quan Hóa & Giới Thiệu Của Bộ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Ảnh chụp bộ hoặc minh họa ma-nơ-canh ảo */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#DDD6CA] flex items-center justify-center shadow-2xs">
              {outfitImages.length > 0 ? (
                <img
                  src={outfitImages[selectedPhotoIndex] || outfitImages[0]}
                  alt={activeOutfit.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: activeOutfit.heroColor || '#9E2A2B' }}
                  >
                    <Shirt className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-[#1A1918]">
                      Bộ Trang Phục {activeOutfit.name}
                    </h5>
                    <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                      Bộ trang phục được phối từ {activeOutfit.components.length} thành phần riêng biệt.
                    </p>
                  </div>
                </div>
              )}

              {/* Tag màu sắc tiếng Việt (không có mã hex) */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-bold text-[#1A1918] shadow-xs flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-black/20"
                  style={{ backgroundColor: activeOutfit.heroColor || '#9E2A2B' }}
                />
                <span>{activeOutfit.colorLabel || getVietnameseColorName(activeOutfit.heroColor)}</span>
              </div>
            </div>

            {/* Thư viện ảnh thu nhỏ nếu có nhiều ảnh */}
            {outfitImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {outfitImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedPhotoIndex === idx
                        ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/20'
                        : 'border-[#DDD6CA] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Góc chụp ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cột phải: Lời giới thiệu & Tóm tắt thành phần của bộ này */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Cảm Hứng Sáng Tạo & Nét Đẹp Di Sản</span>
                </span>
                {onUpdateOutfit && !isEditingIntro && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditIntroText(activeOutfit.introduction || '');
                      setIsEditingIntro(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#9E2A2B] hover:text-[#7D2223] bg-red-50 hover:bg-red-100/80 rounded-md transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Chỉnh Sửa Văn Bản</span>
                  </button>
                )}
              </div>

              {isEditingIntro ? (
                <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                    <span>Ô đoạn văn lớn · Dễ dàng xem toàn bộ & hỗ trợ phím TAB để thụt đầu dòng</span>
                  </div>
                  <textarea
                    rows={6}
                    value={editIntroText}
                    onChange={(e) => setEditIntroText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const target = e.currentTarget;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        const val = target.value;
                        const tabStr = '    ';
                        const nextVal = val.substring(0, start) + tabStr + val.substring(end);
                        setEditIntroText(nextVal);
                        setTimeout(() => {
                          target.selectionStart = target.selectionEnd = start + tabStr.length;
                        }, 0);
                      }
                    }}
                    placeholder="Nhập toàn bộ nội dung cảm hứng sáng tạo và nét đẹp di sản..."
                    className="w-full p-3.5 text-xs md:text-sm text-[#1A1918] bg-white border border-[#9E2A2B]/40 rounded-xl focus:outline-none focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B]/20 leading-relaxed font-sans resize-y min-h-[150px]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingIntro(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#57534E] hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-lg transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdateOutfit) {
                          onUpdateOutfit({
                            ...activeOutfit,
                            introduction: editIntroText.trim() || undefined,
                          });
                        }
                        setIsEditingIntro(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#9E2A2B] hover:bg-[#7D2223] rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu Lại</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#3E3C3A] leading-relaxed whitespace-pre-wrap font-sans">
                  {activeOutfit.introduction ||
                    `Bộ trang phục "${activeOutfit.name}" được may đo tỉ mỉ bởi ${activeOutfit.creatorName || 'người yêu di sản'}, kết hợp hài hòa các tầng lớp trang phục truyền thống Việt Nam mang đậm khí chất đoan trang, tôn kính cội nguồn.`}
                </p>
              )}
            </div>

            {/* Bảng tóm tắt các lớp thành phần sắp xếp chuẩn xác từ trên xuống dưới */}
            <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-[#1A1918] uppercase tracking-wider">
                Cấu Trúc Tầng Lớp Của Bộ Này · {activeOutfit.components.length} món
              </span>
              <div className="divide-y divide-[#EAE6DF]">
                {[...activeOutfit.components]
                  .sort((a, b) => getCategoryOrderIndex(a.category) - getCategoryOrderIndex(b.category))
                  .map((c) => {
                    const catInfo = CATEGORY_META_LIST.find((m) => {
                      if (m.key === 'ao_ngoai') return c.category === 'ao_ngoai' || c.category === 'ao_ngoai_truoc';
                      return m.key === c.category;
                    });
                    return (
                      <div key={c.id} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#9E2A2B] w-36 shrink-0 truncate">
                          {catInfo?.label || c.category}
                        </span>
                        <span className="font-medium text-[#1A1918] truncate flex-1 text-left px-2">
                          {c.name}
                        </span>
                        <span className="text-[#57534E] flex items-center gap-1 shrink-0">
                          <span
                            className="w-2 h-2 rounded-full border border-black/20"
                            style={{ backgroundColor: c.heroColor }}
                          />
                          <span>{c.colorLabel || getVietnameseColorName(c.heroColor)}</span>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* KHU VỰC CÁC THÀNH PHẦN RIÊNG CỦA BỘ NÀY */}
        {/* HIỂN THỊ THEO CHIỀU TỪ TRÊN XUỐNG DƯỚI: bộ trang phục -> áo ngoài (mặt trước) -> áo ngoài (mặt sau) -> áo trong -> thân dưới -> giày dép -> phụ kiện */}
        <div className="pt-6 border-t border-[#F2EFE9] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-[#1A1918] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9E2A2B]" />
                <span>Chi Tiết Các Thành Phần Của Bộ Trang Phục Này</span>
              </h4>
              <p className="text-xs text-[#78716C] mt-0.5">
                Hiển thị theo thứ tự từ trên xuống dưới của riêng bộ &quot;{activeOutfit.name}&quot;
              </p>
            </div>
          </div>

          {availableCategories.length === 0 ? (
            <p className="text-xs text-[#78716C] py-4">Chưa có thành phần cụ thể nào.</p>
          ) : (
            <div className="space-y-6">
              {availableCategories.map((categoryMeta) => {
                const itemsInCat = components.filter((item) => {
                  if (categoryMeta.key === 'ao_ngoai') return item.category === 'ao_ngoai' || item.category === 'ao_ngoai_truoc';
                  return item.category === categoryMeta.key;
                });

                return (
                  <div
                    key={categoryMeta.key}
                    className="p-5 rounded-2xl border border-[#DDD6CA] bg-[#FAF8F5]/60 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#9E2A2B] uppercase tracking-wider bg-white border border-[#DDD6CA] px-2.5 py-1 rounded-md">
                          {categoryMeta.label}
                        </span>
                        <span className="text-xs text-[#78716C]">
                          · {itemsInCat.length} món
                        </span>
                      </div>
                    </div>

                    {/* Danh sách các món trong danh mục này của riêng bộ trang phục này */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {itemsInCat.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-[#DDD6CA] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            {/* Hình ảnh của món đồ */}
                            <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-4 space-y-1.5">
                                  <div
                                    className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white"
                                    style={{ backgroundColor: item.heroColor }}
                                  >
                                    <Shirt className="w-5 h-5" />
                                  </div>
                                  <span className="text-[11px] text-[#78716C] block">
                                    Minh họa {categoryMeta.shortLabel}
                                  </span>
                                </div>
                              )}

                              {/* Chú thích màu sắc tiếng Việt thuần túy */}
                              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-[#1A1918] shadow-xs flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                                  style={{ backgroundColor: item.heroColor }}
                                />
                                <span>{item.colorLabel || getVietnameseColorName(item.heroColor)}</span>
                              </div>
                            </div>

                            {/* Tên và thông tin món */}
                            <div>
                              <h5 className="text-sm font-bold text-[#1A1918]">
                                {item.name}
                              </h5>
                              <p className="text-xs text-[#57534E] mt-0.5">
                                Tác giả: <strong className="text-[#1A1918]">{item.creatorName || activeOutfit.creatorName || 'Người Yêu Di Sản'}</strong>
                              </p>
                              {item.material && (
                                <p className="text-xs text-[#78716C] mt-1">
                                  Chất liệu: {item.material}
                                </p>
                              )}
                              {item.culturalAdvisory && !item.culturalAdvisory.toLowerCase().includes('cài vạt') && (
                                <p className="text-[11px] text-[#9E2A2B] mt-1 bg-red-50/70 px-2 py-1 rounded">
                                  Quy chuẩn: {item.culturalAdvisory}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Nút xem chi tiết modal nếu có */}
                          {onOpenItemDetailModal && (
                            <button
                              type="button"
                              onClick={() => onOpenItemDetailModal(item)}
                              className="w-full py-2 px-3 text-xs font-semibold text-[#1A1918] bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#DDD6CA] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#9E2A2B]" />
                              <span>Xem Chi Tiết Món Đồ</span>
                            </button>
                          )}
                        </div>
                      ))}
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
