import React, { useState } from 'react';
import { CustomOutfit, getVietnameseColorName } from '../types/vietphuc';
import { Search, FolderOpen, Eye, Scissors, Trash2, ArrowRight, Shirt } from 'lucide-react';

interface ArchiveCatalogProps {
  outfits: CustomOutfit[];
  onSelectOutfitAndShowcase: (outfitId: string) => void;
  onNavigateToWorkshop?: () => void;
  onDeleteOutfit?: (outfitId: string) => void;
}

export const ArchiveCatalog: React.FC<ArchiveCatalogProps> = ({
  outfits,
  onSelectOutfitAndShowcase,
  onNavigateToWorkshop,
  onDeleteOutfit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteClick = (e: React.MouseEvent, outfit: CustomOutfit) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa bộ trang phục "${outfit.name}" khỏi danh sách không?`
      )
    ) {
      if (onDeleteOutfit) {
        onDeleteOutfit(outfit.id);
      }
    }
  };

  // Tìm kiếm theo tên bộ trang phục, tác giả hoặc tên thành phần
  const filteredOutfits = outfits.filter((outfit) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const inName = outfit.name.toLowerCase().includes(q);
    const inCreator = (outfit.creatorName || '').toLowerCase().includes(q);
    const inComponents = outfit.components.some((c) =>
      c.name.toLowerCase().includes(q)
    );
    const inIntro = (outfit.introduction || '').toLowerCase().includes(q);
    return inName || inCreator || inComponents || inIntro;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-300">
      {/* Editorial Title & Concept Statement */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Trang Chủ · Kho Di Sản Việt Phục
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Bộ Sưu Tập
          </h2>
          <p className="text-sm text-[#57534E] mt-1.5 max-w-xl">
            Tất cả các bộ trang phục đã được may đo từ Xưởng May. Nhấp vào bất kỳ bộ nào để chuyển ngay sang trang <strong>Trưng Bày</strong> và ngắm nhìn chi tiết toàn bộ thành phần riêng của nó!
          </p>
        </div>

        {/* Search bar & Link to Workshop */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bộ trang phục, tác giả..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:outline-none focus:border-[#9E2A2B] transition-colors"
            />
          </div>

          {onNavigateToWorkshop && (
            <button
              onClick={onNavigateToWorkshop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1A1918] bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#DDD6CA] rounded-md transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
              title="Đi tới Xưởng May để tạo bộ trang phục mới"
            >
              <Scissors className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Đến Xưởng May</span>
            </button>
          )}
        </div>
      </div>

      {/* Outfits Cards Grid: When clicked, transfers immediately to Trưng Bày */}
      {filteredOutfits.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7E2D8] rounded-2xl p-8 mt-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-center mx-auto text-[#9E2A2B]">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1918]">
            {outfits.length === 0
              ? 'Kho lưu trữ hiện chưa có bộ trang phục nào'
              : 'Không tìm thấy bộ trang phục phù hợp với từ khóa'}
          </h3>
          <p className="text-xs text-[#78716C] max-w-md mx-auto leading-relaxed">
            {outfits.length === 0
              ? 'Bạn hãy vào Xưởng May để may đo và thêm các bộ trang phục đầu tiên nhé. Mỗi lần may đo sẽ tạo thành một bộ riêng lẻ!'
              : 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa ô tìm kiếm để xem tất cả trang phục.'}
          </p>
          {outfits.length === 0 && onNavigateToWorkshop && (
            <div className="pt-2">
              <button
                onClick={onNavigateToWorkshop}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Vào Xưởng May May Đo Ngay</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredOutfits.map((outfit) => {
            const displayImg =
              outfit.imageUrl ||
              (outfit.imageUrls && outfit.imageUrls[0]) ||
              outfit.components.find((c) => c.imageUrl)?.imageUrl;

            const primaryColor = outfit.heroColor || '#9E2A2B';
            const colorName = outfit.colorLabel || getVietnameseColorName(primaryColor);

            return (
              <div
                key={outfit.id}
                onClick={() => onSelectOutfitAndShowcase(outfit.id)}
                className="group bg-white border border-[#E7E2D8] hover:border-[#9E2A2B] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Visual Image Presentation Area - Click to open in Trưng Bày */}
                <div
                  className="relative w-full aspect-3/4 bg-gradient-to-b from-[#FAF8F5] to-[#F1EDE6] overflow-hidden flex items-center justify-center p-4"
                  title={`Bấm để xem chi tiết "${outfit.name}" tại trang Trưng Bày`}
                >
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={outfit.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Shirt className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-semibold text-[#57534E] block">
                        Bộ Cổ Phục {outfit.gender || 'Truyền Thống'}
                      </span>
                    </div>
                  )}

                  {/* Swatch indicator (Chỉ hiển thị tên màu tiếng Việt thuần túy, không có mã hex) */}
                  <div
                    className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                    title={`Màu: ${colorName}`}
                  />

                  {/* Badges top */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                      {outfit.gender || 'Cổ phục'}
                    </span>
                    <span className="px-2 py-0.5 bg-[#9E2A2B] text-white text-[10px] font-bold rounded-md">
                      {outfit.components.length} thành phần
                    </span>
                  </div>

                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                    <span className="px-3.5 py-2 bg-white text-[#1A1918] font-bold text-xs rounded-full shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      <span>Xem Tại Trưng Bày</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Outfit Name */}
                    <h3
                      className="text-base font-bold text-[#1A1918] group-hover:text-[#9E2A2B] transition-colors line-clamp-1"
                      title={outfit.name}
                    >
                      {outfit.name}
                    </h3>

                    {/* Color annotation badge & Creator Name */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span className="text-[11px] font-semibold text-[#1A1918]">
                        Màu: <span className="text-[#9E2A2B]">{colorName}</span>
                      </span>
                      <span className="text-[#A8A29E]">·</span>
                      <span className="text-[11px] text-[#57534E] font-medium">
                        Tác giả: <strong>{outfit.creatorName || 'Người Yêu Di Sản'}</strong>
                      </span>
                    </div>

                    {/* Danh sách các thành phần có trong bộ này */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {outfit.components.slice(0, 3).map((comp) => (
                        <span
                          key={comp.id}
                          className="text-[10px] bg-[#FAF8F5] text-[#57534E] border border-[#DDD6CA] px-1.5 py-0.5 rounded"
                        >
                          {comp.name}
                        </span>
                      ))}
                      {outfit.components.length > 3 && (
                        <span className="text-[10px] text-[#78716C] px-1 py-0.5">
                          +{outfit.components.length - 3} món khác
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
                    {onDeleteOutfit && (
                      <button
                        onClick={(e) => handleDeleteClick(e, outfit)}
                        className="p-1.5 text-[#A8A29E] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title={`Xóa bộ "${outfit.name}"`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#9E2A2B] group-hover:translate-x-0.5 transition-transform">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
