import React, { useState } from 'react';
import { CostumeItem, EventOccasion, LookbookItem, OutfitComposition } from '../types/vietphuc';
import { CostumeIllustration } from './CostumeIllustration';
import {
  ArrowRight,
  Plus,
  Trash2,
  X,
  RotateCcw,
  Check,
  CheckCircle2,
  User,
  Layers,
} from 'lucide-react';

interface LookbookGalleryProps {
  lookbooks: LookbookItem[];
  costumes: CostumeItem[];
  currentStudioOutfit?: OutfitComposition;
  onAddLookbook: (item: LookbookItem) => void;
  onDeleteLookbook: (id: string) => void;
  onResetLookbooks: () => void;
  onLoadPreset: (preset: LookbookItem) => void;
  onOpenStudio: () => void;
}

const OCCASIONS: EventOccasion[] = [
  'Lễ Tốt Nghiệp',
  'Dạo Phố & Cafe',
  'Tiệc Cưới & Dự Lễ',
  'Chụp Ảnh Kỷ Yếu',
  'Lễ Hội Truyền Thống / Tết',
  'Trình Diễn & Runway',
];

export const LookbookGallery: React.FC<LookbookGalleryProps> = ({
  lookbooks,
  costumes,
  currentStudioOutfit,
  onAddLookbook,
  onDeleteLookbook,
  onResetLookbooks,
  onLoadPreset,
  onOpenStudio,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for creating a new Lookbook
  const [title, setTitle] = useState('');
  const [occasion, setOccasion] = useState<EventOccasion>('Lễ Tốt Nghiệp');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');

  const outerOptions = costumes.filter((c) => c.category === 'ao_ngoai');
  const innerOptions = costumes.filter((c) => c.category === 'ao_trong');
  const bottomOptions = costumes.filter((c) => c.category === 'quan_vay');
  const accessoryOptions = costumes.filter((c) => c.category === 'phu_kien');
  const footwearOptions = costumes.filter((c) => c.category === 'giay_dep');

  const [selectedOuterId, setSelectedOuterId] = useState<string>(
    outerOptions[0]?.id || ''
  );
  const [selectedInnerId, setSelectedInnerId] = useState<string>('');
  const [selectedBottomId, setSelectedBottomId] = useState<string>(
    bottomOptions[0]?.id || ''
  );
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('');
  const [selectedFootwearId, setSelectedFootwearId] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setTitle('');
    setOccasion('Lễ Tốt Nghiệp');
    setDescription('');
    setCreatorName('Gen Z Heritage Stylist');
    setGender('Nam');
    setSelectedOuterId(outerOptions[0]?.id || '');
    setSelectedInnerId('');
    setSelectedBottomId(bottomOptions[0]?.id || '');
    setSelectedAccessoryId('');
    setSelectedFootwearId('');
    setIsAddModalOpen(true);
  };

  const handleFillFromStudio = () => {
    if (!currentStudioOutfit) return;
    if (currentStudioOutfit.lookbookTitle) setTitle(currentStudioOutfit.lookbookTitle);
    if (currentStudioOutfit.targetOccasion) setOccasion(currentStudioOutfit.targetOccasion);
    if (currentStudioOutfit.creatorName) setCreatorName(currentStudioOutfit.creatorName);
    if (currentStudioOutfit.gender) setGender(currentStudioOutfit.gender);
    if (currentStudioOutfit.outerwear) setSelectedOuterId(currentStudioOutfit.outerwear.id);
    if (currentStudioOutfit.innerwear) setSelectedInnerId(currentStudioOutfit.innerwear.id);
    if (currentStudioOutfit.bottom) setSelectedBottomId(currentStudioOutfit.bottom.id);
    if (currentStudioOutfit.accessory) setSelectedAccessoryId(currentStudioOutfit.accessory.id);
    if (currentStudioOutfit.footwear) setSelectedFootwearId(currentStudioOutfit.footwear.id);
    setDescription(
      `Bản phối phong cách cổ phục sáng tạo bởi ${currentStudioOutfit.creatorName || 'người yêu di sản'}.`
    );
    showToast('Đã nạp nhanh trang phục từ Xưởng May!');
  };

  const handleSubmitNewLookbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLookbook: LookbookItem = {
      id: `lookbook_${Date.now()}`,
      title: title.trim(),
      occasion,
      description:
        description.trim() ||
        `Bản phối thời thượng kết hợp nét đẹp di sản truyền thống và phong cách đương đại cho dịp ${occasion}.`,
      creatorName: creatorName.trim() || 'Người Yêu Di Sản',
      gender,
      outerId: selectedOuterId || undefined,
      innerId: selectedInnerId || undefined,
      bottomId: selectedBottomId || undefined,
      accessoryId: selectedAccessoryId || undefined,
      footwearId: selectedFootwearId || undefined,
    };

    onAddLookbook(newLookbook);
    setIsAddModalOpen(false);
    showToast(`Đã thêm thành công bản Lookbook "${newLookbook.title}"!`);
  };

  // Preview items for modal
  const previewOuter = costumes.find((c) => c.id === selectedOuterId);
  const previewBottom = costumes.find((c) => c.id === selectedBottomId);
  const previewAccessory = costumes.find((c) => c.id === selectedAccessoryId);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1918] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Phong Cách Tiêu Biểu · Lookbook Tuyển Chọn
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Lookbook <span className="text-[#9E2A2B]">CHẠM</span>
          </h2>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs cursor-pointer"
            title="Tạo và lưu thêm một bản Lookbook mới"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Thêm Bản Lookbook</span>
          </button>

          <button
            onClick={onOpenStudio}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1A1918] bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-md transition-all shadow-xs cursor-pointer"
            title="Đến Xưởng May để tự tay thử nghiệm"
          >
            <span>Xưởng May</span>
          </button>
        </div>
      </div>

      {/* Grid of Lookbook Items */}
      {lookbooks.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7E2D8] rounded-2xl p-8 mt-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-center mx-auto text-[#9E2A2B]">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1918]">Chưa có bản Lookbook nào</h3>
          <p className="text-xs text-[#78716C] max-w-md mx-auto leading-relaxed">
            Các bản lookbook mẫu đã được dọn sạch. Bạn hãy tự tay phối đồ tại Xưởng May hoặc bấm nút bên dưới để tạo các bản Lookbook của riêng bạn nhé!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bản Lookbook Mới</span>
            </button>
            <button
              onClick={onOpenStudio}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1A1918] bg-[#FAF8F5] hover:bg-[#F1EDE6] border border-[#DDD6CA] rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <span>Đến Xưởng May</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {lookbooks.map((preset, idx) => {
            const outer = costumes.find((c) => c.id === preset.outerId);
            const bottom = costumes.find((c) => c.id === preset.bottomId);
            const accessory = costumes.find((c) => c.id === preset.accessoryId);

            return (
              <div
                key={preset.id}
                className="bg-white border border-[#E7E2D8] hover:border-[#C4BDB0] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-2xs group"
              >
                {/* Visual Card Top */}
                <div className="relative aspect-[3/4] bg-gradient-to-b from-[#FAF8F5] to-[#F1EDE6] p-4 flex items-center justify-center border-b border-[#EAE6DF] overflow-hidden">
                  {preset.fullOutfitImage ? (
                    <img
                      src={preset.fullOutfitImage}
                      alt={preset.title}
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                  ) : (
                    <CostumeIllustration
                      outerwear={outer}
                      bottom={bottom}
                      accessory={accessory}
                      outerColor={preset.customColorOuter || outer?.heroColor}
                      bottomColor={preset.customColorBottom || bottom?.heroColor}
                      accessoryColor={preset.customColorAccessory || accessory?.heroColor}
                      size="md"
                      showMannequin={false}
                      gender={preset.gender || 'Nam'}
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#FAF9F6]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium text-[#1A1918] border border-[#E7E2D8]">
                      #{idx + 1} · {preset.occasion}
                    </span>
                    {preset.gender && (
                      <span className="bg-white/80 px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#78716C] border border-[#EDE8DF]">
                        {preset.gender}
                      </span>
                    )}
                  </div>

                  {/* Nút Xóa Bản Lookbook */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Bạn có chắc chắn muốn xóa bản Lookbook "${preset.title}" không?`
                        )
                      ) {
                        onDeleteLookbook(preset.id);
                        showToast(`Đã xóa bản Lookbook "${preset.title}"!`);
                      }
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-[#FDF2F2] text-[#78716C] hover:text-[#9E2A2B] rounded-md transition-colors border border-[#EDE8DF] shadow-2xs"
                    title={`Xóa bản Lookbook "${preset.title}"`}
                    aria-label={`Xóa bản Lookbook "${preset.title}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#1A1918] group-hover:text-[#9E2A2B] transition-colors">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-[#57534E] leading-relaxed mt-2 line-clamp-3">
                      {preset.description}
                    </p>
                    {preset.introduction && (
                      <p className="text-[11px] text-[#9E2A2B] italic line-clamp-2 mt-1.5 font-serif bg-[#FAF8F5] p-2 rounded border border-[#EDE8DF]">
                        “{preset.introduction}”
                      </p>
                    )}
                    {preset.creatorName && (
                      <div className="text-[11px] text-[#78716C] mt-2 italic">
                        Bởi: <span className="font-medium text-[#1A1918]">{preset.creatorName}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-[#78716C] truncate max-w-[140px]">
                      Áo: <span className="text-[#1A1918]">{outer?.name || 'Cổ phục'}</span>
                    </span>

                    <button
                      onClick={() => onLoadPreset(preset)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E2A2B] hover:text-[#831F20] transition-colors shrink-0"
                    >
                      <span>Thử Bản Này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL THÊM BẢN LOOKBOOK MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white border border-[#E7E2D8] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EAE6DF] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
                  Bộ Sưu Tập Cá Nhân
                </span>
                <h3 className="text-xl font-bold text-[#1A1918] font-display mt-0.5">
                  Thêm Bản Lookbook Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitNewLookbook} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Nút nạp nhanh từ Xưởng May nếu có */}
              {currentStudioOutfit && (
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#57534E]">
                    <div className="font-bold text-[#1A1918]">
                      Đang có trang phục trong Xưởng May
                    </div>
                    <span className="text-[11px] text-[#78716C]">
                      {currentStudioOutfit.outerwear?.name} × {currentStudioOutfit.bottom?.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillFromStudio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-md transition-colors shrink-0"
                  >
                    <span>Nạp Dữ Liệu Từ Xưởng May</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột trái: Form nhập liệu (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  {/* Tên bản Lookbook */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">
                      Tên Bản Lookbook <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Áo Tấc Đương Đại & Sneaker Chunky, Dạ Tiệc Cố Đô..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Dịp sự kiện & Giới tính */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1A1918]">Dịp Sự Kiện</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value as EventOccasion)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                      >
                        {OCCASIONS.map((occ) => (
                          <option key={occ} value={occ}>
                            {occ}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1A1918]">Dành Cho Giới Tính</label>
                      <div className="flex gap-1.5 pt-0.5">
                        {(['Nam', 'Nữ'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-all flex items-center justify-center gap-1 ${
                              gender === g
                                ? 'bg-[#1A1918] text-white border-[#1A1918]'
                                : 'bg-white text-[#57534E] border-[#DDD6CA] hover:border-[#1A1918]'
                            }`}
                          >
                            <User className="w-3 h-3" />
                            <span>{g}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Người phối */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Người Phối Đồ / Tác Giả</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Gen Z Stylist, Tên của bạn..."
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Mô tả phong cách */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Mô Tả Cảm Hứng Phối Đồ</label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả sự hòa quyện giữa truyền thống và phong cách trẻ trung..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Chọn thành phần trang phục */}
                  <div className="space-y-3 pt-2 border-t border-[#EDE8DF]">
                    <span className="text-xs font-bold text-[#1A1918] block">
                      Chọn Các Lớp Trang Phục
                    </span>

                    {/* Áo Ngoài */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">Áo Ngoài</label>
                      <select
                        value={selectedOuterId}
                        onChange={(e) => setSelectedOuterId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        {outerOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.era})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Thân Trên (Áo yếm/áo trong) */}
                    {innerOptions.length > 0 && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-[#78716C]">
                          Thân Trên (Tùy chọn)
                        </label>
                        <select
                          value={selectedInnerId}
                          onChange={(e) => setSelectedInnerId(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                        >
                          <option value="">-- Không chọn lớp thân trên --</option>
                          {innerOptions.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Thân Dưới */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">Thân Dưới</label>
                      <select
                        value={selectedBottomId}
                        onChange={(e) => setSelectedBottomId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        {bottomOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phụ Kiện */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">
                        Phụ Kiện (Tùy chọn)
                      </label>
                      <select
                        value={selectedAccessoryId}
                        onChange={(e) => setSelectedAccessoryId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Không dùng phụ kiện --</option>
                        {accessoryOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Giày Dép */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">
                        Giày Dép (Tùy chọn)
                      </label>
                      <select
                        value={selectedFootwearId}
                        onChange={(e) => setSelectedFootwearId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Mặc định --</option>
                        {footwearOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Xem trước trực tiếp trên ma-nơ-canh (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F5] to-[#F1EDE6] p-4 rounded-xl border border-[#EDE8DF]">
                  <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-2">
                    Xem Trước Bản Phối ({gender})
                  </span>
                  <div className="w-48 h-64 flex items-center justify-center my-2">
                    <CostumeIllustration
                      outerwear={previewOuter}
                      bottom={previewBottom}
                      accessory={previewAccessory}
                      outerColor={previewOuter?.heroColor}
                      bottomColor={previewBottom?.heroColor}
                      accessoryColor={previewAccessory?.heroColor}
                      size="md"
                      showMannequin={true}
                      gender={gender}
                    />
                  </div>
                  <div className="text-center text-xs mt-2">
                    <div className="font-bold text-[#1A1918]">{title || 'Tên bản Lookbook'}</div>
                    <div className="text-[11px] text-[#9E2A2B] mt-0.5">{occasion}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAE6DF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#57534E] hover:text-[#1A1918] transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Bản Lookbook</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
