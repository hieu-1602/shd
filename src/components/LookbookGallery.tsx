import React, { useState, useRef, useEffect } from 'react';
import { CostumeItem, LookbookItem, OutfitComposition } from '../types/vietphuc';
import { CostumeIllustration } from './CostumeIllustration';
import { compressImageFile } from '../utils/imageCompressor';
import {
  ArrowRight,
  Plus,
  Trash2,
  X,
  Check,
  CheckCircle2,
  Layers,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface LookbookGalleryProps {
  lookbooks: LookbookItem[];
  costumes: CostumeItem[];
  currentStudioOutfit?: OutfitComposition;
  onAddLookbook: (item: LookbookItem) => void;
  onDeleteLookbook: (id: string) => void;
  onResetLookbooks: () => void;
  onLoadPreset?: (preset: LookbookItem) => void;
  onOpenStudio?: () => void;
}

const COMMON_OCCASIONS = [
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
  onAddLookbook,
  onDeleteLookbook,
  onLoadPreset,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Card photo indices for multi-photo navigation directly on cards
  const [cardPhotoIndices, setCardPhotoIndices] = useState<Record<string, number>>({});

  // Full detail / multi-photo viewer modal state
  const [viewingLookbook, setViewingLookbook] = useState<LookbookItem | null>(null);
  const [viewerPhotoIndex, setViewerPhotoIndex] = useState(0);

  // Form states for creating a new Lookbook
  const [title, setTitle] = useState('');
  const [occasion, setOccasion] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [gender, setGender] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [activeFormPreviewIndex, setActiveFormPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outerOptions = costumes.filter(
    (c) => c.category === 'ao_ngoai' || c.category === 'ao_ngoai_truoc' || c.category === 'bo_trang_phuc'
  );
  const innerOptions = costumes.filter((c) => c.category === 'ao_trong');
  const bottomOptions = costumes.filter((c) => c.category === 'quan_vay');
  const accessoryOptions = costumes.filter((c) => c.category === 'phu_kien');
  const footwearOptions = costumes.filter((c) => c.category === 'giay_dep');

  const [selectedOuterId, setSelectedOuterId] = useState<string>('');
  const [selectedInnerId, setSelectedInnerId] = useState<string>('');
  const [selectedBottomId, setSelectedBottomId] = useState<string>('');
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('');
  const [selectedFootwearId, setSelectedFootwearId] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setTitle('');
    setOccasion('');
    setDescription('');
    setCreatorName('');
    setGender('');
    setIntroduction('');
    setImageUrls([]);
    setUrlInput('');
    setActiveFormPreviewIndex(0);
    setSelectedOuterId('');
    setSelectedInnerId('');
    setSelectedBottomId('');
    setSelectedAccessoryId('');
    setSelectedFootwearId('');
    setIsAddModalOpen(true);
  };

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const compressed = await compressImageFile(file, 1000, 0.85);
        if (compressed) {
          setImageUrls((prev) => [...prev, compressed]);
        }
      } catch {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImageUrls((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImageUrls((prev) => [...prev, trimmed]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      if (activeFormPreviewIndex >= next.length) {
        setActiveFormPreviewIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleSubmitNewLookbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const primaryImage = imageUrls[0] || '';
    const newLookbook: LookbookItem = {
      id: `lookbook_${Date.now()}`,
      title: title.trim(),
      occasion: occasion.trim() || 'Tự do',
      description: description.trim() || 'Bản phối phong cách cổ phục Việt Nam.',
      creatorName: creatorName.trim() || 'Người Yêu Di Sản',
      gender: gender.trim() || undefined,
      imageUrl: primaryImage || undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      fullOutfitImage: primaryImage || undefined,
      introduction: introduction.trim() || undefined,
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

  const getLookbookImages = (preset: LookbookItem): string[] => {
    const list: string[] = [];
    if (Array.isArray(preset.imageUrls) && preset.imageUrls.length > 0) {
      preset.imageUrls.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (preset.imageUrl && !list.includes(preset.imageUrl)) {
      list.push(preset.imageUrl);
    }
    if (preset.fullOutfitImage && !list.includes(preset.fullOutfitImage)) {
      list.push(preset.fullOutfitImage);
    }
    return list;
  };

  const handleCardPrevImage = (presetId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardPhotoIndices((prev) => {
      const current = prev[presetId] || 0;
      const next = current <= 0 ? total - 1 : current - 1;
      return { ...prev, [presetId]: next };
    });
  };

  const handleCardNextImage = (presetId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardPhotoIndices((prev) => {
      const current = prev[presetId] || 0;
      const next = current >= total - 1 ? 0 : current + 1;
      return { ...prev, [presetId]: next };
    });
  };

  const handleOpenViewer = (preset: LookbookItem, initialIndex = 0) => {
    setViewingLookbook(preset);
    setViewerPhotoIndex(initialIndex);
  };

  // Keyboard navigation for viewer modal
  useEffect(() => {
    if (!viewingLookbook) return;
    const images = getLookbookImages(viewingLookbook);
    if (images.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewingLookbook(null);
      } else if (e.key === 'ArrowLeft') {
        setViewerPhotoIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setViewerPhotoIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingLookbook]);

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
            Bộ Sưu Tập Lookbook
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Lookbook <span className="text-[#9E2A2B]">CHẠM</span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Thêm Bản Lookbook</span>
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
          <div className="pt-2">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bản Lookbook Mới</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {lookbooks.map((preset, idx) => {
            const outer = costumes.find((c) => c.id === preset.outerId);
            const bottom = costumes.find((c) => c.id === preset.bottomId);
            const accessory = costumes.find((c) => c.id === preset.accessoryId);
            const images = getLookbookImages(preset);
            const activeIdx = Math.min(cardPhotoIndices[preset.id] || 0, Math.max(0, images.length - 1));
            const currentImg = images[activeIdx];

            return (
              <div
                key={preset.id}
                className="bg-white border border-[#E7E2D8] hover:border-[#C4BDB0] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-2xs group"
              >
                {/* Visual Card Top */}
                <div
                  onClick={() => handleOpenViewer(preset, activeIdx)}
                  className="relative aspect-[3/4] bg-transparent p-4 flex items-center justify-center border-b border-[#EAE6DF] overflow-hidden cursor-pointer"
                >
                  {currentImg ? (
                    <img
                      src={currentImg}
                      alt={preset.title}
                      className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
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
                      gender={(preset.gender as 'Nam' | 'Nữ') || 'Nam'}
                    />
                  )}

                  {/* Multi-Photo Arrows on Card */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleCardPrevImage(preset.id, images.length, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#1A1918] shadow-sm border border-[#DDD6CA] transition-all opacity-80 group-hover:opacity-100 z-10 cursor-pointer"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleCardNextImage(preset.id, images.length, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#1A1918] shadow-sm border border-[#DDD6CA] transition-all opacity-80 group-hover:opacity-100 z-10 cursor-pointer"
                        title="Ảnh tiếp theo"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full z-10">
                        {images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              i === activeIdx ? 'bg-white w-2.5' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
                    <span className="bg-[#FAF9F6]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium text-[#1A1918] border border-[#E7E2D8]">
                      #{idx + 1} · {preset.occasion}
                    </span>
                    {preset.gender && (
                      <span className="bg-white/80 px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#78716C] border border-[#EDE8DF]">
                        {preset.gender}
                      </span>
                    )}
                  </div>

                  {/* Top Right: Photo count & Delete Button */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {images.length > 1 && (
                      <span className="bg-[#1A1918]/70 text-white px-1.5 py-0.5 rounded text-[10px] font-mono">
                        {activeIdx + 1}/{images.length}
                      </span>
                    )}
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
                      className="p-1.5 bg-white/90 hover:bg-[#FDF2F2] text-[#78716C] hover:text-[#9E2A2B] rounded-md transition-colors border border-[#EDE8DF] shadow-2xs cursor-pointer"
                      title={`Xóa bản Lookbook "${preset.title}"`}
                      aria-label={`Xóa bản Lookbook "${preset.title}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div onClick={() => handleOpenViewer(preset, activeIdx)} className="cursor-pointer">
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
                    <button
                      type="button"
                      onClick={() => handleOpenViewer(preset, activeIdx)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#57534E] hover:text-[#1A1918] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      <span>{images.length > 1 ? `Xem ${images.length} ảnh` : 'Xem chi tiết'}</span>
                    </button>

                    {onLoadPreset && (
                      <button
                        onClick={() => onLoadPreset(preset)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E2A2B] hover:text-[#831F20] transition-colors shrink-0 cursor-pointer"
                      >
                        <span>Thử Bản Này</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL XEM CHI TIẾT NHIỀU ẢNH (LOOKBOOK MULTI-PHOTO VIEWER) */}
      {viewingLookbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white border border-[#E7E2D8] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Viewer Header */}
            <div className="p-4 md:px-6 border-b border-[#EAE6DF] flex items-center justify-between bg-[#FAF8F5]">
              <div className="min-w-0 pr-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E2A2B] block">
                  {viewingLookbook.occasion} · {viewingLookbook.gender || 'Cổ phục'}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-[#1A1918] font-display truncate">
                  {viewingLookbook.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingLookbook(null)}
                className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#EAE6DF] transition-colors cursor-pointer shrink-0"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Cột trái: Ảnh chính kích thước lớn với thanh chuyển ảnh */}
              <div className="md:col-span-7 flex flex-col items-center">
                {(() => {
                  const images = getLookbookImages(viewingLookbook);
                  const outer = costumes.find((c) => c.id === viewingLookbook.outerId);
                  const bottom = costumes.find((c) => c.id === viewingLookbook.bottomId);
                  const accessory = costumes.find((c) => c.id === viewingLookbook.accessoryId);
                  const activeImg = images[viewerPhotoIndex];

                  return (
                    <div className="w-full space-y-3">
                      <div className="relative w-full aspect-[3/4] max-h-[480px] bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl flex items-center justify-center overflow-hidden p-3">
                        {activeImg ? (
                          <img
                            src={activeImg}
                            alt={`${viewingLookbook.title} - ${viewerPhotoIndex + 1}`}
                            className="w-full h-full object-contain drop-shadow-md"
                          />
                        ) : (
                          <CostumeIllustration
                            outerwear={outer}
                            bottom={bottom}
                            accessory={accessory}
                            outerColor={viewingLookbook.customColorOuter || outer?.heroColor}
                            bottomColor={viewingLookbook.customColorBottom || bottom?.heroColor}
                            accessoryColor={viewingLookbook.customColorAccessory || accessory?.heroColor}
                            size="lg"
                            showMannequin={false}
                            gender={(viewingLookbook.gender as 'Nam' | 'Nữ') || 'Nam'}
                          />
                        )}

                        {/* Navigation buttons */}
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setViewerPhotoIndex((prev) =>
                                  prev <= 0 ? images.length - 1 : prev - 1
                                )
                              }
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#1A1918] shadow-md border border-[#DDD6CA] transition-all cursor-pointer"
                              title="Ảnh trước"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setViewerPhotoIndex((prev) =>
                                  prev >= images.length - 1 ? 0 : prev + 1
                                )
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#1A1918] shadow-md border border-[#DDD6CA] transition-all cursor-pointer"
                              title="Ảnh kế tiếp"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>

                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
                              {viewerPhotoIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Dải thumbnail thu nhỏ của tất cả ảnh */}
                      {images.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 justify-center">
                          {images.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setViewerPhotoIndex(i)}
                              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer p-0.5 bg-white ${
                                i === viewerPhotoIndex
                                  ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/20 scale-105'
                                  : 'border-[#DDD6CA] opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt={`Ảnh ${i + 1}`} className="w-full h-full object-contain" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Cột phải: Thông tin bản Lookbook */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-[#1A1918]">{viewingLookbook.title}</h4>
                  {viewingLookbook.creatorName && (
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Tác giả / Người phối: <span className="font-semibold text-[#1A1918]">{viewingLookbook.creatorName}</span>
                    </p>
                  )}
                  {viewingLookbook.occasion && (
                    <p className="text-xs text-[#9E2A2B] font-semibold mt-1">
                      Dịp sự kiện: {viewingLookbook.occasion}
                    </p>
                  )}
                </div>

                {viewingLookbook.description && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
                      Mô Tả Phong Cách
                    </span>
                    <p className="text-xs text-[#3E3C3A] leading-relaxed bg-[#FAF8F5] p-3 rounded-lg border border-[#EDE8DF]">
                      {viewingLookbook.description}
                    </p>
                  </div>
                )}

                {viewingLookbook.introduction && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E2A2B] block">
                      Lời Giới Thiệu
                    </span>
                    <p className="text-xs text-[#1A1918] italic font-serif leading-relaxed bg-[#FAF8F5] p-3 rounded-lg border border-[#EDE8DF]">
                      “{viewingLookbook.introduction}”
                    </p>
                  </div>
                )}

                {/* Các lớp trang phục đã phối */}
                <div className="space-y-2 pt-2 border-t border-[#EDE8DF]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1918] block">
                    Các Lớp Trang Phục
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {viewingLookbook.outerId && (
                      <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                        <span className="text-[#78716C]">Áo chính:</span>
                        <span className="font-semibold text-[#1A1918]">
                          {costumes.find((c) => c.id === viewingLookbook.outerId)?.name || 'Cổ phục'}
                        </span>
                      </div>
                    )}
                    {viewingLookbook.innerId && (
                      <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                        <span className="text-[#78716C]">Áo phụ:</span>
                        <span className="font-semibold text-[#1A1918]">
                          {costumes.find((c) => c.id === viewingLookbook.innerId)?.name || 'Áo lót'}
                        </span>
                      </div>
                    )}
                    {viewingLookbook.bottomId && (
                      <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                        <span className="text-[#78716C]">Thân dưới:</span>
                        <span className="font-semibold text-[#1A1918]">
                          {costumes.find((c) => c.id === viewingLookbook.bottomId)?.name || 'Quần / Váy'}
                        </span>
                      </div>
                    )}
                    {viewingLookbook.accessoryId && (
                      <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                        <span className="text-[#78716C]">Phụ kiện:</span>
                        <span className="font-semibold text-[#1A1918]">
                          {costumes.find((c) => c.id === viewingLookbook.accessoryId)?.name || 'Phụ kiện'}
                        </span>
                      </div>
                    )}
                    {viewingLookbook.footwearId && (
                      <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                        <span className="text-[#78716C]">Giày dép:</span>
                        <span className="font-semibold text-[#1A1918]">
                          {costumes.find((c) => c.id === viewingLookbook.footwearId)?.name || 'Giày dép'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {onLoadPreset && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset(viewingLookbook);
                        setViewingLookbook(null);
                      }}
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Thử Bản Phối Này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                  Bộ Sưu Tập Lookbook
                </span>
                <h3 className="text-xl font-bold text-[#1A1918] font-display mt-0.5">
                  Thêm Bản Lookbook Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitNewLookbook} className="flex-1 overflow-y-auto p-6 space-y-5">
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
                      placeholder="Nhập tên bản Lookbook..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Chọn nhiều ảnh cho Lookbook (tự do chọn nhiều ảnh) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#1A1918]">
                        Hình Ảnh Lookbook {imageUrls.length > 0 && `(${imageUrls.length} ảnh)`}
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleImageFilesChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1918] bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#DDD6CA] rounded-md transition-colors cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#9E2A2B]" />
                        <span>Tải ảnh lên</span>
                      </button>

                      <input
                        type="text"
                        placeholder="Dán URL ảnh..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddUrlImage();
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrlImage}
                        className="px-3 py-2 text-xs font-medium bg-[#1A1918] hover:bg-[#9E2A2B] text-white rounded-md transition-colors cursor-pointer shrink-0"
                      >
                        + Thêm
                      </button>
                    </div>

                    {/* Danh sách ảnh đã chọn */}
                    {imageUrls.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto py-2">
                        {imageUrls.map((img, i) => (
                          <div
                            key={i}
                            className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 group cursor-pointer ${
                              i === activeFormPreviewIndex ? 'border-[#9E2A2B]' : 'border-[#DDD6CA]'
                            }`}
                            onClick={() => setActiveFormPreviewIndex(i)}
                          >
                            <img src={img} alt={`Ảnh ${i + 1}`} className="w-full h-full object-contain p-1" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(i);
                              }}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full transition-opacity opacity-80 hover:opacity-100 cursor-pointer"
                              title="Xóa ảnh này"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dịp sự kiện & Giới tính */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1A1918]">Dịp Sự Kiện</label>
                      <input
                        type="text"
                        list="occasion-list"
                        placeholder="Nhập hoặc chọn dịp sự kiện..."
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                      />
                      <datalist id="occasion-list">
                        {COMMON_OCCASIONS.map((occ) => (
                          <option key={occ} value={occ} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1A1918]">Giới Tính / Phù Hợp</label>
                      <input
                        type="text"
                        list="gender-list"
                        placeholder="Nam, Nữ, Unisex..."
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                      />
                      <datalist id="gender-list">
                        <option value="Nam" />
                        <option value="Nữ" />
                        <option value="Unisex" />
                      </datalist>
                    </div>
                  </div>

                  {/* Người phối / Tác giả */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Người Phối / Tác Giả</label>
                    <input
                      type="text"
                      placeholder="Nhập tên người phối / tác giả..."
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Lời giới thiệu */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Lời Giới Thiệu</label>
                    <input
                      type="text"
                      placeholder="Nhập lời giới thiệu..."
                      value={introduction}
                      onChange={(e) => setIntroduction(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Mô tả phong cách */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Mô Tả Phong Cách</label>
                    <textarea
                      rows={2}
                      placeholder="Nhập mô tả phong cách..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  {/* Chọn các lớp trang phục */}
                  <div className="space-y-3 pt-2 border-t border-[#EDE8DF]">
                    <span className="text-xs font-bold text-[#1A1918] block">
                      Chọn Các Lớp Trang Phục
                    </span>

                    {/* Áo Chính */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">Áo Chính (Mặt Trước)</label>
                      <select
                        value={selectedOuterId}
                        onChange={(e) => setSelectedOuterId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Không chọn --</option>
                        {outerOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Áo Phụ */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">
                        Áo Phụ
                      </label>
                      <select
                        value={selectedInnerId}
                        onChange={(e) => setSelectedInnerId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Không chọn --</option>
                        {innerOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Thân Dưới */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#78716C]">Thân Dưới</label>
                      <select
                        value={selectedBottomId}
                        onChange={(e) => setSelectedBottomId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Không chọn --</option>
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
                        Phụ Kiện
                      </label>
                      <select
                        value={selectedAccessoryId}
                        onChange={(e) => setSelectedAccessoryId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Không chọn --</option>
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
                        Giày Dép
                      </label>
                      <select
                        value={selectedFootwearId}
                        onChange={(e) => setSelectedFootwearId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD6CA] rounded-md"
                      >
                        <option value="">-- Không chọn --</option>
                        {footwearOptions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Xem trước hình ảnh / lớp trang phục (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F5] to-[#F1EDE6] p-4 rounded-xl border border-[#EDE8DF] min-h-[320px]">
                  <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-2">
                    Xem Trước {imageUrls.length > 0 && `(Ảnh ${activeFormPreviewIndex + 1}/${imageUrls.length})`}
                  </span>
                  <div className="w-full aspect-[3/4] max-h-72 flex items-center justify-center my-2 overflow-hidden rounded-lg">
                    {imageUrls.length > 0 ? (
                      <img
                        src={imageUrls[activeFormPreviewIndex] || imageUrls[0]}
                        alt="Xem trước"
                        className="w-full h-full object-contain drop-shadow-sm rounded-lg"
                      />
                    ) : selectedOuterId || selectedBottomId || selectedAccessoryId ? (
                      <CostumeIllustration
                        outerwear={previewOuter}
                        bottom={previewBottom}
                        accessory={previewAccessory}
                        outerColor={previewOuter?.heroColor}
                        bottomColor={previewBottom?.heroColor}
                        accessoryColor={previewAccessory?.heroColor}
                        size="md"
                        showMannequin={true}
                        gender={(gender as 'Nam' | 'Nữ') || 'Nam'}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#A8A29E] p-4">
                        <ImageIcon className="w-10 h-10 stroke-1 mb-2" />
                        <span className="text-xs text-center">Chưa có ảnh hoặc trang phục</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-xs mt-2 w-full truncate">
                    <div className="font-bold text-[#1A1918] truncate">{title || 'Tên bản Lookbook'}</div>
                    {occasion && <div className="text-[11px] text-[#9E2A2B] mt-0.5 truncate">{occasion}</div>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAE6DF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#57534E] hover:text-[#1A1918] transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs cursor-pointer"
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
