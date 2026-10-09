import React, { useState, useEffect } from 'react';
import {
  CostumeItem,
  CostumeCategory,
  OutfitComposition,
} from '../types/vietphuc';
import { CostumeIllustration } from './CostumeIllustration';
import { CostumeItemVisual } from './CostumeItemVisual';
import {
  Sparkles,
  Check,
  Layers,
  Split,
  Trash2,
  X,
  Plus,
  RotateCcw,
  Bookmark,
  Share2,
  PenTool,
  Quote,
  CheckCircle2,
  PlusCircle,
  Scissors,
  Eye,
  Shirt,
  Sparkle,
  ChevronDown,
  Info,
} from 'lucide-react';

interface MixMatchStudioProps {
  costumes: CostumeItem[];
  currentOutfit: OutfitComposition;
  setCurrentOutfit: React.Dispatch<React.SetStateAction<OutfitComposition>>;
  onDeleteCostume?: (id: string) => void;
  onUpdateCostume?: (item: CostumeItem) => void;
  onOpenCmsModal?: () => void;
  onOpenLookbookCard: () => void;
  onOpenComparison: () => void;
  onSaveToLookbook?: (outfit: OutfitComposition) => void;
}

export const MixMatchStudio: React.FC<MixMatchStudioProps> = ({
  costumes,
  currentOutfit,
  setCurrentOutfit,
  onDeleteCostume,
  onUpdateCostume,
  onOpenCmsModal,
  onOpenLookbookCard,
  onOpenComparison,
  onSaveToLookbook,
}) => {
  const [activeStreamCategory, setActiveStreamCategory] = useState<CostumeCategory | 'all'>('all');
  const [savedToLookbook, setSavedToLookbook] = useState(false);

  // Free-form introduction text state (syncs with currentOutfit.introduction)
  const [introText, setIntroText] = useState(currentOutfit.introduction || '');
  const [introSavedNotice, setIntroSavedNotice] = useState(false);

  // Sync intro text when currentOutfit changes externally
  useEffect(() => {
    if (currentOutfit.introduction !== undefined && currentOutfit.introduction !== introText) {
      setIntroText(currentOutfit.introduction);
    }
  }, [currentOutfit.introduction]);

  // Handle intro text change
  const handleIntroTextChange = (text: string) => {
    setIntroText(text);
    setCurrentOutfit((prev) => ({
      ...prev,
      introduction: text,
    }));
  };

  // Helper function to remove individual parts of the current outfit
  const handleRemovePart = (
    part: 'fullOutfit' | 'outerwear' | 'innerwear' | 'bottom' | 'accessory' | 'footwear'
  ) => {
    setCurrentOutfit((prev) => {
      const next = { ...prev, [part]: undefined };
      if (part === 'fullOutfit') {
        next.customImage = undefined;
        next.fullOutfitImages = undefined;
      }
      return next;
    });
  };

  // Filter costumes by category
  const fullOutfitOptions = costumes.filter((c) => c.category === 'bo_trang_phuc');
  const innerOptions = costumes.filter((c) => c.category === 'ao_trong');
  const outerOptions = costumes.filter((c) => c.category === 'ao_ngoai');
  const bottomOptions = costumes.filter((c) => c.category === 'quan_vay');
  const footwearOptions = costumes.filter((c) => c.category === 'giay_dep');
  const accessoryOptions = costumes.filter((c) => c.category === 'phu_kien');

  // Selection handlers
  const handleSelectFullOutfit = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorOuter)
      ? currentOutfit.customColorOuter
      : item.heroColor;
    setCurrentOutfit((prev) => ({
      ...prev,
      fullOutfit: item,
      customImage: item.imageUrl || (item.imageUrls && item.imageUrls[0]),
      fullOutfitImages: item.imageUrls || (item.imageUrl ? [item.imageUrl] : []),
      customColorOuter: newColor,
      lookbookTitle: item.name,
      gender: item.gender || prev.gender || 'Nam',
    }));
  };

  const handleSelectOuter = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorOuter)
      ? currentOutfit.customColorOuter
      : item.heroColor;
    setCurrentOutfit((prev) => ({
      ...prev,
      outerwear: item,
      customColorOuter: newColor,
      gender: item.gender || prev.gender || 'Nam',
    }));
  };

  const handleSelectInner = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor =
      currentOutfit.customColorInner && itemColors.includes(currentOutfit.customColorInner)
        ? currentOutfit.customColorInner
        : item.heroColor;
    setCurrentOutfit((prev) => ({
      ...prev,
      innerwear: item,
      customColorInner: newColor,
      gender: item.gender || prev.gender || 'Nam',
    }));
  };

  const handleSelectBottom = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorBottom)
      ? currentOutfit.customColorBottom
      : item.heroColor;
    setCurrentOutfit((prev) => ({
      ...prev,
      bottom: item,
      customColorBottom: newColor,
      gender: item.gender || prev.gender || 'Nam',
    }));
  };

  const handleSelectFootwear = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor =
      currentOutfit.customColorFootwear && itemColors.includes(currentOutfit.customColorFootwear)
        ? currentOutfit.customColorFootwear
        : item.heroColor;
    setCurrentOutfit((prev) => ({
      ...prev,
      footwear: item,
      customColorFootwear: newColor,
    }));
  };

  const handleSelectAccessory = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorAccessory)
      ? currentOutfit.customColorAccessory
      : item.heroColor;
    setCurrentOutfit((prev) => ({
      ...prev,
      accessory: item,
      customColorAccessory: newColor,
    }));
  };

  // Color selection
  const handleColorOptionSelect = (
    category: CostumeCategory,
    item: CostumeItem,
    color: string
  ) => {
    setCurrentOutfit((prev) => {
      switch (category) {
        case 'bo_trang_phuc':
          return { ...prev, fullOutfit: item, customColorOuter: color };
        case 'ao_ngoai':
          return { ...prev, outerwear: item, customColorOuter: color, gender: item.gender || prev.gender || 'Nam' };
        case 'ao_trong':
          return { ...prev, innerwear: item, customColorInner: color, gender: item.gender || prev.gender || 'Nam' };
        case 'quan_vay':
          return { ...prev, bottom: item, customColorBottom: color, gender: item.gender || prev.gender || 'Nam' };
        case 'giay_dep':
          return { ...prev, footwear: item, customColorFootwear: color };
        case 'phu_kien':
          return { ...prev, accessory: item, customColorAccessory: color };
        default:
          return prev;
      }
    });
  };

  const handleReset = () => {
    setCurrentOutfit({
      fullOutfit: undefined,
      outerwear: undefined,
      innerwear: undefined,
      bottom: undefined,
      accessory: undefined,
      footwear: undefined,
      customImage: undefined,
      fullOutfitImages: undefined,
      customColorOuter: '#9E2A2B',
      customColorBottom: '#1A1A1A',
      customColorAccessory: '#D4AF37',
      targetOccasion: 'Dạo Phố & Cafe',
      lookbookTitle: 'Bản Phối Mới',
      creatorName: 'Người Yêu Di Sản',
      introduction: '',
    });
    setIntroText('');
  };

  // Build the vertical display gallery items for the currently equipped outfit
  // (Left column vertical scroll sequence like The Wolf e-commerce video)
  interface GalleryCardItem {
    key: string;
    categoryLabel: string;
    tagNumber?: number;
    title: string;
    subTitle?: string;
    description?: string;
    color?: string;
    imageUrl?: string;
    allImages?: string[];
    itemData?: CostumeItem;
    onRemove?: () => void;
  }

  const galleryItems: GalleryCardItem[] = [];

  // 1. Full Outfit / Hero Look (if equipped)
  if (currentOutfit.fullOutfit || currentOutfit.customImage) {
    const fullItem = currentOutfit.fullOutfit;
    const allImgs = fullItem?.imageUrls && fullItem.imageUrls.length > 0
      ? fullItem.imageUrls
      : fullItem?.imageUrl
      ? [fullItem.imageUrl]
      : currentOutfit.customImage
      ? [currentOutfit.customImage]
      : [];

    galleryItems.push({
      key: 'full_outfit',
      categoryLabel: 'Bộ Trang Phục (Toàn Thân)',
      title: fullItem?.name || currentOutfit.lookbookTitle || 'Bộ Trang Phục Hoàn Chỉnh',
      subTitle: fullItem?.era || 'Cảm hứng di sản Việt Nam',
      description: fullItem?.culturalMeaning || fullItem?.originStory || 'Bản phối trọn bộ trang phục di sản.',
      color: currentOutfit.customColorOuter,
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: fullItem,
      onRemove: () => handleRemovePart('fullOutfit'),
    });
  }

  // 2. Step 1: Áo Trong (Thân Trên Đầu Tiên)
  if (currentOutfit.innerwear) {
    const item = currentOutfit.innerwear;
    const allImgs = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
    galleryItems.push({
      key: 'innerwear',
      categoryLabel: '1. Áo (Áo Đầu Tiên / Thân Trên)',
      tagNumber: 1,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: currentOutfit.customColorInner || item.heroColor,
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: item,
      onRemove: () => handleRemovePart('innerwear'),
    });
  }

  // 3. Step 2: Áo Ngoài
  if (currentOutfit.outerwear) {
    const item = currentOutfit.outerwear;
    const allImgs = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
    galleryItems.push({
      key: 'outerwear',
      categoryLabel: '2. Áo Ngoài (Ngũ Thân / Tấc / Giao Lĩnh)',
      tagNumber: 2,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: currentOutfit.customColorOuter || item.heroColor,
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: item,
      onRemove: () => handleRemovePart('outerwear'),
    });
  }

  // 4. Step 3: Thân Dưới (Quần / Váy)
  if (currentOutfit.bottom) {
    const item = currentOutfit.bottom;
    const allImgs = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
    galleryItems.push({
      key: 'bottom',
      categoryLabel: '3. Thân Dưới (Quần Lụa / Váy)',
      tagNumber: 3,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: currentOutfit.customColorBottom || item.heroColor,
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: item,
      onRemove: () => handleRemovePart('bottom'),
    });
  }

  // 5. Step 4: Giày Dép
  if (currentOutfit.footwear) {
    const item = currentOutfit.footwear;
    const allImgs = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
    galleryItems.push({
      key: 'footwear',
      categoryLabel: '4. Giày Dép (Hài Thêu / Sneaker)',
      tagNumber: 4,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: currentOutfit.customColorFootwear || item.heroColor,
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: item,
      onRemove: () => handleRemovePart('footwear'),
    });
  }

  // 6. Step 5: Phụ Kiện
  if (currentOutfit.accessory) {
    const item = currentOutfit.accessory;
    const allImgs = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
    galleryItems.push({
      key: 'accessory',
      categoryLabel: '5. Phụ Kiện (Khăn Đóng / Kiềng Bạc)',
      tagNumber: 5,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: currentOutfit.customColorAccessory || item.heroColor,
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: item,
      onRemove: () => handleRemovePart('accessory'),
    });
  }

  // Reusable card renderer on the right side
  const renderCostumeCard = (
    item: CostumeItem,
    categoryKey: CostumeCategory,
    isSelected: boolean,
    currentColor: string,
    onSelect: () => void
  ) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const displayColor = isSelected ? currentColor : item.heroColor;
    const allImages = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];

    return (
      <div
        key={item.id}
        className={`relative rounded-xl border transition-all p-3.5 flex flex-col justify-between gap-3 ${
          isSelected
            ? 'bg-[#FDFBF7] border-[#9E2A2B] ring-1.5 ring-[#9E2A2B] shadow-xs'
            : 'bg-white border-[#E7E2D8] hover:border-[#C4BDB0] hover:shadow-2xs'
        }`}
      >
        {/* Top: Image preview & garment info */}
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={onSelect}
            className="flex-1 text-left flex items-start gap-3 group/item cursor-pointer"
          >
            {/* Visual illustration / Image preview with selected color */}
            <CostumeItemVisual
              item={item}
              color={displayColor}
              className="w-16 h-20 sm:w-18 sm:h-22 shrink-0 rounded-lg"
            />

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#1A1918] group-hover/item:text-[#9E2A2B] transition-colors line-clamp-1">
                {item.name}
              </div>
              <div className="text-[11px] text-[#78716C] mt-0.5 line-clamp-1">{item.era}</div>
              <div className="text-[10px] text-[#9E2A2B] mt-0.5 italic line-clamp-1">
                {item.material.split(',')[0]}
              </div>

              {/* Status badge */}
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#9E2A2B] bg-[#9E2A2B]/10 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Đang trang bị
                  </span>
                )}
                {allImages.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#57534E] bg-[#F1EDE6] px-1.5 py-0.5 rounded">
                    {allImages.length} ảnh
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Delete button: freely available for anyone if custom item */}
          {onDeleteCostume && item.isCustom && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}"?`)) {
                  onDeleteCostume(item.id);
                }
              }}
              className="p-1.5 text-[#A8A29E] hover:text-[#9E2A2B] hover:bg-[#FDF2F2] rounded transition-colors shrink-0 cursor-pointer"
              title={`Xóa ${item.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom: Integrated color customization */}
        <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between gap-1.5 mt-auto">
          <span className="text-[10px] font-medium text-[#78716C] shrink-0">
            Màu ({itemColors.length}):
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {itemColors.map((color) => {
              const isColorActive = isSelected && currentColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorOptionSelect(categoryKey, item, color);
                  }}
                  title={`Chọn phối màu: ${color}`}
                  className={`w-4.5 h-4.5 rounded-full transition-all relative flex items-center justify-center cursor-pointer ${
                    isColorActive
                      ? 'ring-2 ring-[#9E2A2B] ring-offset-1 scale-110 border-2 border-white shadow-xs'
                      : 'border border-black/20 hover:scale-110 hover:border-black/40'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {isColorActive && <Check className="w-2.5 h-2.5 text-white drop-shadow-sm stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Studio Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Xưởng May · Cổ Phục Remix
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Xưởng Phối Trang Phục Di Sản
          </h2>
          <p className="text-xs md:text-sm text-[#57534E] mt-1 max-w-xl">
            Lướt xuống để chiêm ngưỡng từng chi tiết và thành phần của bộ trang phục đang xem ở bên trái. Tùy chọn các danh mục và viết lời giới thiệu ở bên phải.
          </p>
        </div>

        {/* Action Buttons: Tối giản, không có nút tải ảnh trực tiếp trong studio */}
        <div className="flex items-center flex-wrap gap-2.5">
          {onOpenCmsModal && (
            <button
              onClick={onOpenCmsModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1A1918] bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-md transition-colors shadow-2xs cursor-pointer"
              title="Thêm trang phục mới vào kho lưu trữ"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Thêm Trang Phục Mới</span>
            </button>
          )}

          <button
            onClick={onOpenComparison}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1918] bg-white border border-[#DDD6CA] hover:bg-[#F5F2EB] rounded-md transition-colors cursor-pointer"
            title="So sánh 2 phương án phối đồ"
          >
            <Split className="w-3.5 h-3.5 text-[#78716C]" />
            <span>So Sánh</span>
          </button>

          <button
            onClick={onOpenLookbookCard}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1A1918] bg-white border border-[#DDD6CA] hover:bg-[#F5F2EB] rounded-md transition-colors cursor-pointer"
            title="Xuất poster Lookbook kèm ảnh và lời giới thiệu"
          >
            <Share2 className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Xuất Lookbook</span>
          </button>

          {onSaveToLookbook && (
            <button
              onClick={() => {
                onSaveToLookbook(currentOutfit);
                setSavedToLookbook(true);
                setTimeout(() => setSavedToLookbook(false), 2500);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                savedToLookbook
                  ? 'bg-[#2D6A4F] text-white'
                  : 'bg-[#1A1918] hover:bg-[#33312E] text-white shadow-2xs'
              }`}
            >
              {savedToLookbook ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã Lưu!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#E9C46A]" />
                  <span>Lưu Vào Lookbook</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2 text-[#78716C] hover:text-[#1A1918] hover:bg-[#F5F2EB] rounded-md transition-colors cursor-pointer"
            title="Đặt lại bản phối mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Grid:
          - Left Column (7 cols): High-fashion vertical scroll viewer showing each part/photo of the costume (like The Wolf video)
          - Right Column (5 cols): Sticky sidebar keeping category stream and costume introduction pinned while scrolling
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative mt-8">
        {/* ========================================================== */}
        {/* BÊN TRÁI: HIỂN THỊ TRANG PHỤC ĐANG XEM DẠNG LƯỚT XUỐNG     */}
        {/* ========================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-8">
          {galleryItems.length === 0 ? (
            /* Khi chưa có món đồ nào được chọn */
            <div className="bg-white border border-[#E7E2D8] rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[480px] shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center text-[#9E2A2B]">
                <Shirt className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-normal font-display text-[#1A1918]">
                Xưởng May Đang Chờ Bản Phối Của Bạn
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto leading-relaxed">
                Hiện tại chưa có trang phục nào được chọn trong xưởng. Hãy chọn một bộ trang phục hoặc kết hợp các lớp áo, quần/váy từ bảng danh mục bên phải để ngắm nhìn từng thành phần hiển thị theo dạng lướt xuống tại đây!
              </p>
              <div className="pt-2 flex items-center gap-2">
                {onOpenCmsModal && (
                  <button
                    type="button"
                    onClick={onOpenCmsModal}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Trang Phục Mới</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Danh sách các thành phần của bộ trang phục hiển thị theo dạng lướt xuống giống trong video */
            <div className="space-y-8">
              {galleryItems.map((section, sectionIdx) => {
                const imagesToRender = section.allImages && section.allImages.length > 0
                  ? section.allImages
                  : section.imageUrl
                  ? [section.imageUrl]
                  : [];

                return (
                  <div
                    key={section.key}
                    id={`gallery-section-${section.key}`}
                    className="space-y-4 animate-in fade-in duration-300"
                  >
                    {/* Header bar cho từng thành phần trong luồng lướt xuống */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DF]">
                      <div className="flex items-center gap-2">
                        {section.tagNumber ? (
                          <span className="w-6 h-6 rounded-full bg-[#1A1918] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {section.tagNumber}
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-[#9E2A2B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            ★
                          </span>
                        )}
                        <div>
                          <span className="text-xs font-bold text-[#9E2A2B] uppercase tracking-wider block">
                            {section.categoryLabel}
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-[#1A1918]">
                            {section.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {section.color && (
                          <div
                            className="w-4 h-4 rounded-full border border-black/20 shadow-2xs shrink-0"
                            style={{ backgroundColor: section.color }}
                            title={`Màu phối: ${section.color}`}
                          />
                        )}
                        {section.onRemove && (
                          <button
                            type="button"
                            onClick={section.onRemove}
                            className="p-1.5 text-[#A8A29E] hover:text-[#9E2A2B] hover:bg-[#FDF2F2] rounded-md transition-colors cursor-pointer"
                            title={`Gỡ bỏ ${section.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Danh sách các góc ảnh của thành phần này */}
                    {imagesToRender.length > 0 ? (
                      imagesToRender.map((imgSrc, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="bg-white border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-xs p-4 sm:p-6 flex flex-col items-center justify-center transition-all hover:border-[#C4BDB0]"
                        >
                          <div className="relative w-full flex items-center justify-center min-h-[420px] sm:min-h-[520px] bg-gradient-to-b from-[#FAF9F6] to-[#F5F2EB] rounded-xl overflow-hidden p-4">
                            <img
                              src={imgSrc}
                              alt={`${section.title} - ảnh ${imgIdx + 1}`}
                              className="max-h-[500px] sm:max-h-[560px] w-auto max-w-full object-contain rounded-lg drop-shadow-md select-none transition-transform duration-300 hover:scale-[1.02]"
                            />

                            {/* Badge góc ảnh nhỏ ở góc dưới */}
                            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
                              <span>{section.categoryLabel}</span>
                              {imagesToRender.length > 1 && (
                                <span className="text-[#E9C46A] font-semibold">
                                  ({imgIdx + 1}/{imagesToRender.length})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : section.itemData ? (
                      /* Nếu không có ảnh trực tiếp thì hiển thị hình vẽ đồ họa vector */
                      <div className="bg-white border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-xs p-6 flex flex-col items-center justify-center min-h-[420px]">
                        <CostumeItemVisual
                          item={section.itemData}
                          color={section.color}
                          className="w-56 h-64 sm:w-64 sm:h-72"
                        />
                        <div className="mt-4 text-xs font-semibold text-[#1A1918]">
                          {section.title}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================== */}
        {/* BÊN PHẢI: ĐỨNG YÊN (STICKY) KHI LƯỚT XUỐNG                */}
        {/* Gồm: DANH MỤC TRANG PHỤC + GIỚI THIỆU VỀ TRANG PHỤC       */}
        {/* ========================================================== */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-20 self-start space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          {/* Thông tin bản phối hiện tại */}
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#9E2A2B] uppercase tracking-wider">
                Bản Phối Đang Xem
              </span>
              <span className="text-[11px] bg-[#FAF8F5] border border-[#EDE8DF] px-2.5 py-0.5 rounded-full text-[#57534E] font-medium">
                {galleryItems.length} thành phần
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#1A1918] truncate">
              {currentOutfit.lookbookTitle || currentOutfit.fullOutfit?.name || 'Bản Phối Cổ Phục Remix'}
            </h3>

            <div className="flex items-center justify-between text-xs text-[#78716C] pt-1 border-t border-[#F2EFE9]">
              <span>Tác giả: <strong className="text-[#1A1918]">{currentOutfit.creatorName || 'Người Yêu Di Sản'}</strong></span>
            </div>
          </div>

          {/* MỤC HIỂN THỊ TỪNG DANH MỤC TRANG PHỤC */}
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9E2A2B]" />
                <h4 className="text-sm font-bold text-[#1A1918]">
                  Danh Mục Trang Phục
                </h4>
              </div>
              <span className="text-[11px] text-[#78716C]">
                {costumes.length} món trong kho
              </span>
            </div>

            {/* Bộ lọc từng danh mục trang phục */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { key: 'all' as const, label: 'Tất Cả', count: costumes.length },
                { key: 'bo_trang_phuc' as const, label: 'Bộ Trang Phục', count: fullOutfitOptions.length },
                { key: 'ao_trong' as const, label: 'Áo Trong', count: innerOptions.length },
                { key: 'ao_ngoai' as const, label: 'Áo Ngoài', count: outerOptions.length },
                { key: 'quan_vay' as const, label: 'Thân Dưới', count: bottomOptions.length },
                { key: 'giay_dep' as const, label: 'Giày Dép', count: footwearOptions.length },
                { key: 'phu_kien' as const, label: 'Phụ Kiện', count: accessoryOptions.length },
              ].map((stream) => (
                <button
                  key={stream.key}
                  type="button"
                  onClick={() => setActiveStreamCategory(stream.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeStreamCategory === stream.key
                      ? 'bg-[#9E2A2B] text-white shadow-xs'
                      : 'bg-[#FAF9F6] text-[#57534E] hover:bg-[#F1EDE6] border border-[#DDD6CA]'
                  }`}
                >
                  <span>{stream.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeStreamCategory === stream.key ? 'bg-white/20 text-white' : 'bg-black/5 text-[#78716C]'
                  }`}>
                    {stream.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Danh sách trang phục theo danh mục */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {/* 1. Bộ Trang Phục */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'bo_trang_phuc') && fullOutfitOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1A1918] flex items-center justify-between">
                    <span>Bộ Trang Phục ({fullOutfitOptions.length})</span>
                    {currentOutfit.fullOutfit && (
                      <button
                        onClick={() => handleRemovePart('fullOutfit')}
                        className="text-[10px] text-[#9E2A2B] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {fullOutfitOptions.map((item) =>
                      renderCostumeCard(
                        item,
                        'bo_trang_phuc',
                        currentOutfit.fullOutfit?.id === item.id,
                        currentOutfit.customColorOuter,
                        () => handleSelectFullOutfit(item)
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 2. Áo Trong */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'ao_trong') && innerOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1A1918] flex items-center justify-between">
                    <span>1. Áo (Thân Trên Đầu Tiên) ({innerOptions.length})</span>
                    {currentOutfit.innerwear && (
                      <button
                        onClick={() => handleRemovePart('innerwear')}
                        className="text-[10px] text-[#9E2A2B] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {innerOptions.map((item) =>
                      renderCostumeCard(
                        item,
                        'ao_trong',
                        currentOutfit.innerwear?.id === item.id,
                        currentOutfit.customColorInner || currentOutfit.innerwear?.heroColor || item.heroColor,
                        () => handleSelectInner(item)
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 3. Áo Ngoài */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'ao_ngoai') && outerOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1A1918] flex items-center justify-between">
                    <span>2. Áo Ngoài ({outerOptions.length})</span>
                    {currentOutfit.outerwear && (
                      <button
                        onClick={() => handleRemovePart('outerwear')}
                        className="text-[10px] text-[#9E2A2B] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {outerOptions.map((item) =>
                      renderCostumeCard(
                        item,
                        'ao_ngoai',
                        currentOutfit.outerwear?.id === item.id,
                        currentOutfit.customColorOuter,
                        () => handleSelectOuter(item)
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 4. Thân Dưới */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'quan_vay') && bottomOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1A1918] flex items-center justify-between">
                    <span>3. Thân Dưới (Quần / Váy) ({bottomOptions.length})</span>
                    {currentOutfit.bottom && (
                      <button
                        onClick={() => handleRemovePart('bottom')}
                        className="text-[10px] text-[#9E2A2B] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {bottomOptions.map((item) =>
                      renderCostumeCard(
                        item,
                        'quan_vay',
                        currentOutfit.bottom?.id === item.id,
                        currentOutfit.customColorBottom,
                        () => handleSelectBottom(item)
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 5. Giày Dép */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'giay_dep') && footwearOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1A1918] flex items-center justify-between">
                    <span>4. Giày Dép ({footwearOptions.length})</span>
                    {currentOutfit.footwear && (
                      <button
                        onClick={() => handleRemovePart('footwear')}
                        className="text-[10px] text-[#9E2A2B] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {footwearOptions.map((item) =>
                      renderCostumeCard(
                        item,
                        'giay_dep',
                        currentOutfit.footwear?.id === item.id,
                        currentOutfit.customColorFootwear || currentOutfit.footwear?.heroColor || item.heroColor,
                        () => handleSelectFootwear(item)
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 6. Phụ Kiện */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'phu_kien') && accessoryOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1A1918] flex items-center justify-between">
                    <span>5. Phụ Kiện ({accessoryOptions.length})</span>
                    {currentOutfit.accessory && (
                      <button
                        onClick={() => handleRemovePart('accessory')}
                        className="text-[10px] text-[#9E2A2B] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {accessoryOptions.map((item) =>
                      renderCostumeCard(
                        item,
                        'phu_kien',
                        currentOutfit.accessory?.id === item.id,
                        currentOutfit.customColorAccessory,
                        () => handleSelectAccessory(item)
                      )
                    )}
                  </div>
                </div>
              )}

              {costumes.length === 0 && (
                <div className="text-center py-8 text-xs text-[#78716C] bg-[#FAF9F6] rounded-xl border border-[#EDE8DF] p-4">
                  Chưa có trang phục nào trong danh mục.
                  {onOpenCmsModal && (
                    <button
                      onClick={onOpenCmsModal}
                      className="mt-2 block mx-auto text-[#9E2A2B] font-semibold hover:underline cursor-pointer"
                    >
                      + Bấm vào đây để thêm trang phục
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================== */}
          {/* PHẦN GIỚI THIỆU CÁC TRANG PHỤC (ĐẶT Ở BÊN PHẢI DƯỚI DANH MỤC) */}
          {/* ========================================================== */}
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#9E2A2B]" />
                <h4 className="text-sm font-bold text-[#1A1918]">
                  Giới Thiệu Về Trang Phục
                </h4>
              </div>
              {introSavedNotice && (
                <span className="text-[11px] font-medium text-[#2D6A4F] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã lưu
                </span>
              )}
            </div>

            {/* Input Textarea for free-form introduction */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1918] block">
                Viết lời giới thiệu trang phục của bạn:
              </label>

              <textarea
                value={introText}
                onChange={(e) => handleIntroTextChange(e.target.value)}
                placeholder="Bạn tự do ghi những dòng chữ để giới thiệu về trang phục: câu chuyện nguồn gốc, cảm hứng sáng tạo, chất liệu hoặc thông điệp văn hóa bạn muốn gửi gắm..."
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-lg focus:outline-none transition-all leading-relaxed placeholder:text-[#A8A29E]"
              />
            </div>

            {/* Live Presentation of the Introduction */}
            {introText.trim() && (
              <div className="bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-4 relative space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px] text-[#9E2A2B] font-semibold border-b border-[#EAE6DF] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Lời người gửi giới thiệu</span>
                  </span>
                  <span className="text-[#78716C] font-normal">
                    {currentOutfit.creatorName || 'Người yêu di sản'}
                  </span>
                </div>

                <p className="text-xs text-[#1A1918] leading-relaxed whitespace-pre-line italic font-serif">
                  “{introText}”
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
