import React, { useState } from 'react';
import { CostumeItem } from '../types/vietphuc';
import { Search, Plus, Sparkles, Check, Trash2, FolderOpen, Scissors, ShieldAlert } from 'lucide-react';
import { CostumeIllustration } from './CostumeIllustration';

interface ArchiveCatalogProps {
  costumes: CostumeItem[];
  onSelectItem?: (item: CostumeItem) => void;
  onSendToStudio: (item: CostumeItem) => void;
  onAddToWardrobe: (item: CostumeItem) => void;
  onDeleteCostume: (id: string) => void;
  wardrobeIds: string[];
  openCmsModal: () => void;
  isAdmin?: boolean;
  onOpenAuthModal?: () => void;
}

export const ArchiveCatalog: React.FC<ArchiveCatalogProps> = ({
  costumes,
  onSendToStudio,
  onAddToWardrobe,
  onDeleteCostume,
  wardrobeIds,
  openCmsModal,
  isAdmin = false,
  onOpenAuthModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const showAdminRequired = (action: string) => {
    setAdminNotice(`Chỉ tài khoản Admin (Quản trị viên) mới có quyền ${action}. Vui lòng đăng nhập với tài khoản Admin!`);
    setTimeout(() => setAdminNotice(null), 4000);
  };

  const handleAddCostumeClick = () => {
    if (!isAdmin) {
      showAdminRequired('thêm trang phục hoặc tải ảnh mới');
      return;
    }
    openCmsModal();
  };

  const handleDeleteCostumeClick = (item: CostumeItem) => {
    if (!isAdmin) {
      showAdminRequired('xóa trang phục');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi danh sách trang phục không?`)) {
      onDeleteCostume(item.id);
    }
  };

  // Filtering solely by search keyword
  const filteredCostumes = costumes.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.material && item.material.toLowerCase().includes(q)) ||
      (item.originStory && item.originStory.toLowerCase().includes(q)) ||
      (item.culturalMeaning && item.culturalMeaning.toLowerCase().includes(q))
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Admin Notice Bar */}
      {adminNotice && (
        <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#FAD2D2] rounded-xl text-xs text-[#831F20] flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#9E2A2B] shrink-0" />
            <span className="font-medium">{adminNotice}</span>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1 bg-[#9E2A2B] text-white rounded-md text-[11px] font-semibold hover:bg-[#831F20] transition-colors shrink-0 ml-3 cursor-pointer"
            >
              Đăng Nhập Admin
            </button>
          )}
        </div>
      )}

      {/* Editorial Title & Concept Statement */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Kho Lưu Trữ Việt Phục
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Danh Sách Trang Phục
          </h2>
          <p className="text-sm text-[#57534E] mt-1.5 max-w-xl">
            Tất cả hình ảnh và trang phục đã được tải lên trong hệ thống. Bạn có thể lưu vào tủ đồ hoặc đưa vào Xưởng may để phối đồ.
          </p>
        </div>

        {/* Search bar & Add Costume Button */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trang phục..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:outline-none focus:border-[#9E2A2B] transition-colors"
            />
          </div>

          <button
            onClick={handleAddCostumeClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            title={isAdmin ? 'Thêm trang phục hoặc tải ảnh trang phục mới' : 'Yêu cầu quyền Admin để thêm trang phục'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm / Tải Ảnh Mới</span>
          </button>
        </div>
      </div>

      {/* Product Cards Grid: Bỏ chú thích tự thêm, địa danh, địa điểm và chi tiết */}
      {filteredCostumes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7E2D8] rounded-2xl p-8 mt-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-center mx-auto text-[#9E2A2B]">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1918]">
            {costumes.length === 0
              ? 'Kho lưu trữ hiện chưa có trang phục nào'
              : 'Không tìm thấy trang phục phù hợp với từ khóa'}
          </h3>
          <p className="text-xs text-[#78716C] max-w-md mx-auto leading-relaxed">
            {costumes.length === 0
              ? 'Hãy tải thẳng hình ảnh hoặc thêm các món trang phục của riêng bạn nhé!'
              : 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa ô tìm kiếm để xem tất cả trang phục.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handleAddCostumeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tải Lên / Thêm Trang Phục Mới</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {filteredCostumes.map((item) => {
            const isSaved = wardrobeIds.includes(item.id);
            const displayImg =
              item.imageUrl || (item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : undefined);

            return (
              <div
                key={item.id}
                className="group bg-white border border-[#E7E2D8] hover:border-[#C4BDB0] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-2xs"
              >
                {/* Visual Area (Không có nhãn địa danh hay chú thích tự thêm) */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#FAF8F5] to-[#F1EDE6] flex items-center justify-center p-4 overflow-hidden border-b border-[#EAE6DF]">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <CostumeIllustration
                      outerwear={item.category === 'ao_ngoai' || item.category === 'ao_trong' ? item : undefined}
                      bottom={item.category === 'quan_vay' ? item : undefined}
                      accessory={item.category === 'phu_kien' ? item : undefined}
                      outerColor={item.heroColor}
                      size="md"
                      showMannequin={false}
                    />
                  )}

                  {/* Swatch indicator */}
                  <div
                    className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: item.heroColor }}
                    title={`Màu: ${item.heroColor}`}
                  />
                </div>

                {/* Card Content (Tối giản: Tên món đồ & Lời giới thiệu, không có địa danh/địa điểm/thời kì) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Product Name */}
                    <h3
                      onClick={() => onSendToStudio(item)}
                      className="text-lg font-bold text-[#1A1918] group-hover:text-[#9E2A2B] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>

                    {/* Cultural Meaning / Description */}
                    <p className="text-xs text-[#57534E] line-clamp-2 mt-2 leading-relaxed">
                      {item.culturalMeaning || item.originStory || 'Trang phục di sản văn hóa Việt Nam.'}
                    </p>
                  </div>

                  {/* Card Actions Footer (Bỏ nút Chi Tiết, đổi Thử Phối thành Đến Xưởng May, nút Xóa cho Admin) */}
                  <div className="pt-5 mt-4 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Nút Xóa (bảo vệ quyền Admin) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteCostumeClick(item)}
                          className="inline-flex items-center p-2 text-xs text-[#A8A29E] hover:text-[#9E2A2B] hover:bg-[#FDF2F2] rounded transition-colors cursor-pointer"
                          title={`Xóa ${item.name}`}
                          aria-label={`Xóa ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddToWardrobe(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-[#EBF3ED] text-[#2D6A4F]'
                            : 'bg-[#F5F2EB] text-[#57534E] hover:text-[#1A1918] hover:bg-[#EAE5DA]'
                        }`}
                        title={isSaved ? 'Đã có trong Tủ Đồ' : 'Lưu vào Tủ Đồ Của Bạn'}
                      >
                        {isSaved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã Lưu</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Lưu Tủ Đồ</span>
                          </>
                        )}
                      </button>

                      {/* Đổi thành Đến Xưởng May */}
                      <button
                        onClick={() => onSendToStudio(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded transition-colors shadow-2xs cursor-pointer"
                        title="Đưa vào Xưởng may để phối đồ"
                      >
                        <Scissors className="w-3.5 h-3.5 text-[#F4A261]" />
                        <span>Đến Xưởng May</span>
                      </button>
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
