import React, { useState, useRef, useEffect } from 'react';
import {
  CostumeItem,
  CostumeCategory,
  EventOccasion,
  OutfitComposition,
} from '../types/vietphuc';
import { CostumeIllustration } from './CostumeIllustration';
import { CostumeItemVisual } from './CostumeItemVisual';
import {
  Sparkles,
  Check,
  Calendar,
  Layers,
  Split,
  Trash2,
  X,
  Plus,
  Image as ImageIcon,
  Video,
  Upload,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Share2,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  PenTool,
  Quote,
  Eye,
  CheckCircle2,
  Sparkle,
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
  isAdmin?: boolean;
  onOpenAuthModal?: () => void;
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
  isAdmin = false,
  onOpenAuthModal,
}) => {
  const [activeStep, setActiveStep] = useState<'items' | 'occasion'>('items');
  const [activeStreamCategory, setActiveStreamCategory] = useState<CostumeCategory | 'all'>('all');
  const [highlightedStream, setHighlightedStream] = useState<string | null>(null);
  const [focusedComponentKey, setFocusedComponentKey] = useState<CostumeCategory>('bo_trang_phuc');
  const [savedToLookbook, setSavedToLookbook] = useState(false);
  const [imageScale, setImageScale] = useState<number>(1);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showIllustrationFallback, setShowIllustrationFallback] = useState(false);
  const directImageInputRef = useRef<HTMLInputElement>(null);

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

  // Active outfit direct image
  const activeOutfitImage =
    currentOutfit.customImage ||
    currentOutfit.fullOutfit?.imageUrl ||
    (currentOutfit.fullOutfit?.imageUrls && currentOutfit.fullOutfit.imageUrls[0]) ||
    currentOutfit.outerwear?.imageUrl ||
    currentOutfit.bottom?.imageUrl;

  // Direct image upload handler (for the full outfit)
  const handleDirectImageUpload = (file: File) => {
    if (!isAdmin) {
      alert('Chỉ tài khoản Admin (Quản trị viên) mới có quyền thêm/tải ảnh trang phục mới! Vui lòng đăng nhập với tài khoản Admin.');
      onOpenAuthModal?.();
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCurrentOutfit((prev) => ({
        ...prev,
        customImage: base64,
        fullOutfit: prev.fullOutfit
          ? {
              ...prev.fullOutfit,
              imageUrl: base64,
              imageUrls: [base64, ...(prev.fullOutfit.imageUrls || [])],
            }
          : {
              id: `custom_outfit_${Date.now()}`,
              name: prev.lookbookTitle || 'Bộ Trang Phục Tải Lên',
              category: 'bo_trang_phuc',
              era: 'Cảm hứng di sản Việt Nam',
              region: 'Việt Nam',
              gender: prev.gender || 'Nam',
              heroColor: '#9E2A2B',
              material: 'Chất liệu vải truyền thống',
              originStory: 'Trang phục do người dùng tải lên trực tiếp.',
              culturalMeaning: 'Nét đẹp văn hóa trang phục Việt Nam.',
              remixTips: 'Phối cùng phong cách đương đại.',
              culturalAdvisory: 'Giữ nét đẹp thanh lịch, chuẩn mực.',
              imageUrl: base64,
              imageUrls: [base64],
              suitableOccasions: ['Dạo Phố & Cafe', 'Lễ Tốt Nghiệp', 'Tiệc Cưới & Dự Lễ'],
              isCustom: true,
            },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDirectImageUpload(file);
    }
  };

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleDirectImageUpload(file);
    }
  };

  const handleRemoveOutfitImage = () => {
    setCurrentOutfit((prev) => ({
      ...prev,
      customImage: undefined,
      fullOutfit: undefined,
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
      }
      return next;
    });
  };

  // Upload multiple images for any specific CostumeItem
  const handleUploadItemImages = (item: CostumeItem, files: FileList | null) => {
    if (!isAdmin) {
      alert('Chỉ tài khoản Admin (Quản trị viên) mới có quyền thêm hình ảnh cho trang phục!');
      onOpenAuthModal?.();
      return;
    }
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const currentList = item.imageUrls || (item.imageUrl ? [item.imageUrl] : []);
        const updatedImageUrls = [...currentList, base64];
        const updatedItem: CostumeItem = {
          ...item,
          imageUrl: item.imageUrl || base64,
          imageUrls: updatedImageUrls,
        };

        // Notify parent to update costumes list
        onUpdateCostume?.(updatedItem);

        // If currently equipped in currentOutfit, update currentOutfit as well
        setCurrentOutfit((prev) => {
          const next = { ...prev };
          if (prev.fullOutfit?.id === item.id) {
            next.fullOutfit = updatedItem;
            next.customImage = base64;
          }
          if (prev.outerwear?.id === item.id) next.outerwear = updatedItem;
          if (prev.innerwear?.id === item.id) next.innerwear = updatedItem;
          if (prev.bottom?.id === item.id) next.bottom = updatedItem;
          if (prev.accessory?.id === item.id) next.accessory = updatedItem;
          if (prev.footwear?.id === item.id) next.footwear = updatedItem;
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete a specific photo from an item
  const handleDeleteItemPhoto = (item: CostumeItem, photoIndexToRemove: number) => {
    if (!isAdmin) {
      alert('Chỉ tài khoản Admin (Quản trị viên) mới có quyền xóa ảnh của trang phục!');
      onOpenAuthModal?.();
      return;
    }
    const currentList = item.imageUrls || (item.imageUrl ? [item.imageUrl] : []);
    const updatedList = currentList.filter((_, idx) => idx !== photoIndexToRemove);
    const updatedItem: CostumeItem = {
      ...item,
      imageUrl: updatedList[0] || undefined,
      imageUrls: updatedList,
    };

    onUpdateCostume?.(updatedItem);

    setCurrentOutfit((prev) => {
      const next = { ...prev };
      if (prev.fullOutfit?.id === item.id) {
        next.fullOutfit = updatedItem;
        next.customImage = updatedList[0] || undefined;
      }
      if (prev.outerwear?.id === item.id) next.outerwear = updatedItem;
      if (prev.innerwear?.id === item.id) next.innerwear = updatedItem;
      if (prev.bottom?.id === item.id) next.bottom = updatedItem;
      if (prev.accessory?.id === item.id) next.accessory = updatedItem;
      if (prev.footwear?.id === item.id) next.footwear = updatedItem;
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

  const occasions: EventOccasion[] = [
    'Lễ Tốt Nghiệp',
    'Dạo Phố & Cafe',
    'Tiệc Cưới & Dự Lễ',
    'Chụp Ảnh Kỷ Yếu',
    'Lễ Hội Truyền Thống / Tết',
    'Trình Diễn & Runway',
  ];

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

  // ORDERED SET SEQUENCE (Strictly in requested order: 1. Áo đầu tiên -> 2. Áo ngoài -> 3. Thân dưới -> 4. Giày dép -> 5. Phụ kiện)
  // Plus the option for Bộ trang phục (Cả bộ đồ)
  const orderedSetSteps = [
    {
      stepNumber: 1,
      categoryKey: 'ao_trong' as const,
      name: 'Áo (Áo Đầu Tiên)',
      shortTitle: '1. Áo Trong',
      desc: 'Lớp thân trên đầu tiên',
      item: currentOutfit.innerwear,
      color: currentOutfit.customColorInner || currentOutfit.innerwear?.heroColor,
    },
    {
      stepNumber: 2,
      categoryKey: 'ao_ngoai' as const,
      name: 'Áo Ngoài',
      shortTitle: '2. Áo Ngoài',
      desc: 'Ngũ thân / Tấc / Giao lĩnh',
      item: currentOutfit.outerwear,
      color: currentOutfit.customColorOuter,
    },
    {
      stepNumber: 3,
      categoryKey: 'quan_vay' as const,
      name: 'Thân Dưới',
      shortTitle: '3. Thân Dưới',
      desc: 'Quần lụa / Chân váy xếp ly',
      item: currentOutfit.bottom,
      color: currentOutfit.customColorBottom,
    },
    {
      stepNumber: 4,
      categoryKey: 'giay_dep' as const,
      name: 'Giày Dép',
      shortTitle: '4. Giày Dép',
      desc: 'Hài thêu / Guốc mộc / Sneaker',
      item: currentOutfit.footwear,
      color: currentOutfit.customColorFootwear || currentOutfit.footwear?.heroColor,
    },
    {
      stepNumber: 5,
      categoryKey: 'phu_kien' as const,
      name: 'Phụ Kiện',
      shortTitle: '5. Phụ Kiện',
      desc: 'Khăn đóng / Trâm cài / Kiềng',
      item: currentOutfit.accessory,
      color: currentOutfit.customColorAccessory,
    },
  ];

  // List of all components in order for Next/Prev cycling
  const COMPONENT_ORDER: CostumeCategory[] = [
    'bo_trang_phuc',
    'ao_trong',
    'ao_ngoai',
    'quan_vay',
    'giay_dep',
    'phu_kien',
  ];

  // NAVIGATION TO COMPONENT IN RESPONSE TO CLICKING AN IMAGE IN THE SET SEQUENCE
  // "với phần này, tôi chỉ muốn khi tôi đang xem các trang phục ở phía trên thì ở dưới cũng sẽ hiển thị rằng tôi đang xem thành phần đó chứ không phải khi tôi bấm vào thành phần đó thì sẽ bị kéo xuống dưới."
  const handleNavigateToComponent = (categoryKey: CostumeCategory) => {
    setFocusedComponentKey(categoryKey);
    setActiveStep('items');
    setActiveStreamCategory(categoryKey);

    // Visual highlight flash
    setHighlightedStream(categoryKey);
    setTimeout(() => setHighlightedStream(null), 2500);
    // Explicitly NO scrollIntoView: user requested NOT to be pulled/scrolled down
  };

  const handleNextComponent = () => {
    const currentIndex = COMPONENT_ORDER.indexOf(focusedComponentKey);
    const nextIndex = (currentIndex + 1) % COMPONENT_ORDER.length;
    const nextKey = COMPONENT_ORDER[nextIndex];
    handleNavigateToComponent(nextKey);
  };

  const handlePrevComponent = () => {
    const currentIndex = COMPONENT_ORDER.indexOf(focusedComponentKey);
    const prevIndex = (currentIndex - 1 + COMPONENT_ORDER.length) % COMPONENT_ORDER.length;
    const prevKey = COMPONENT_ORDER[prevIndex];
    handleNavigateToComponent(prevKey);
  };

  // Get data of the currently focused component to display ONLY this component in showcase
  const getFocusedDisplay = () => {
    switch (focusedComponentKey) {
      case 'ao_trong': {
        const item = currentOutfit.innerwear;
        const img = item?.imageUrl || (item?.imageUrls && item.imageUrls[0]);
        const color = currentOutfit.customColorInner || item?.heroColor;
        return {
          categoryKey: 'ao_trong' as CostumeCategory,
          name: item?.name || 'Áo (Thân trên đầu tiên)',
          stepLabel: '1. Áo Trong (Thân trên)',
          shortTitle: 'Áo Trong',
          item,
          img,
          color,
          isEquipped: Boolean(item),
        };
      }
      case 'ao_ngoai': {
        const item = currentOutfit.outerwear;
        const img = item?.imageUrl || (item?.imageUrls && item.imageUrls[0]);
        const color = currentOutfit.customColorOuter || item?.heroColor;
        return {
          categoryKey: 'ao_ngoai' as CostumeCategory,
          name: item?.name || 'Áo Ngoài',
          stepLabel: '2. Áo Ngoài',
          shortTitle: 'Áo Ngoài',
          item,
          img,
          color,
          isEquipped: Boolean(item),
        };
      }
      case 'quan_vay': {
        const item = currentOutfit.bottom;
        const img = item?.imageUrl || (item?.imageUrls && item.imageUrls[0]);
        const color = currentOutfit.customColorBottom || item?.heroColor;
        return {
          categoryKey: 'quan_vay' as CostumeCategory,
          name: item?.name || 'Thân Dưới',
          stepLabel: '3. Thân Dưới',
          shortTitle: 'Thân Dưới',
          item,
          img,
          color,
          isEquipped: Boolean(item),
        };
      }
      case 'giay_dep': {
        const item = currentOutfit.footwear;
        const img = item?.imageUrl || (item?.imageUrls && item.imageUrls[0]);
        const color = currentOutfit.customColorFootwear || item?.heroColor;
        return {
          categoryKey: 'giay_dep' as CostumeCategory,
          name: item?.name || 'Giày Dép',
          stepLabel: '4. Giày Dép',
          shortTitle: 'Giày Dép',
          item,
          img,
          color,
          isEquipped: Boolean(item),
        };
      }
      case 'phu_kien': {
        const item = currentOutfit.accessory;
        const img = item?.imageUrl || (item?.imageUrls && item.imageUrls[0]);
        const color = currentOutfit.customColorAccessory || item?.heroColor;
        return {
          categoryKey: 'phu_kien' as CostumeCategory,
          name: item?.name || 'Phụ Kiện',
          stepLabel: '5. Phụ Kiện',
          shortTitle: 'Phụ Kiện',
          item,
          img,
          color,
          isEquipped: Boolean(item),
        };
      }
      case 'bo_trang_phuc':
      default: {
        const item = currentOutfit.fullOutfit;
        const img = item?.imageUrl || (item?.imageUrls && item.imageUrls[0]) || currentOutfit.customImage;
        const color = currentOutfit.customColorOuter;
        return {
          categoryKey: 'bo_trang_phuc' as CostumeCategory,
          name: item?.name || currentOutfit.lookbookTitle || 'Bộ Trang Phục',
          stepLabel: 'Bộ Trang Phục',
          shortTitle: 'Bộ Trang Phục',
          item,
          img,
          color,
          isEquipped: Boolean(item || currentOutfit.customImage),
        };
      }
    }
  };

  const focusedDisplay = getFocusedDisplay();

  // Reusable card renderer: visual image preview first, multiple photos support, integrated color options
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

              {/* Status and photos counter badge */}
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#9E2A2B] bg-[#9E2A2B]/10 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Đang chọn
                  </span>
                )}
                {allImages.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#57534E] bg-[#F1EDE6] px-1.5 py-0.5 rounded">
                    <Camera className="w-2.5 h-2.5 text-[#9E2A2B]" />
                    {allImages.length} ảnh
                  </span>
                )}
              </div>
            </div>
          </button>

          {onDeleteCostume && item.isCustom && (
            isAdmin ? (
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
            ) : null
          )}
        </div>

        {/* Multiple Images Gallery Strip for this item */}
        <div className="pt-2 border-t border-[#F2EFE9] space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-[#78716C] flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#9E2A2B]" />
              <span>Hình ảnh của món đồ ({allImages.length}):</span>
            </span>

            {/* + Thêm ảnh cho món đồ này (yêu cầu Admin) */}
            {isAdmin ? (
              <label className="text-[10px] font-medium text-[#9E2A2B] hover:underline cursor-pointer flex items-center gap-1">
                <Plus className="w-3 h-3" />
                <span>Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUploadItemImages(item, e.target.files)}
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={() => {
                  alert('Chỉ tài khoản Admin mới có quyền thêm hình ảnh cho trang phục!');
                  onOpenAuthModal?.();
                }}
                className="text-[10px] font-medium text-[#78716C] hover:text-[#9E2A2B] cursor-pointer flex items-center gap-1"
                title="Yêu cầu quyền Admin để thêm ảnh"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm ảnh</span>
              </button>
            )}
          </div>

          {allImages.length > 0 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {allImages.map((imgUrl, imgIdx) => (
                <div key={imgIdx} className="relative group/thumb shrink-0">
                  <img
                    src={imgUrl}
                    alt={`${item.name} ${imgIdx + 1}`}
                    className="w-10 h-12 object-cover rounded border border-[#DDD6CA] group-hover/thumb:border-[#9E2A2B] transition-all"
                  />
                  {allImages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItemPhoto(item, imgIdx);
                      }}
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black/75 hover:bg-[#9E2A2B] text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      title="Xóa ảnh này"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-[#A8A29E] italic">
              Chưa có hình ảnh. Bấm "Thêm ảnh" để tải lên nhiều ảnh cho món này.
            </div>
          )}
        </div>

        {/* Bottom: Integrated color customization (only colors added for this item) */}
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

  const handleReset = () => {
    const defaultFull = fullOutfitOptions[0];
    const defaultOuter = outerOptions[0];
    const defaultBottom = bottomOptions[0];
    const defaultAcc = accessoryOptions[0];
    const defaultFoot = footwearOptions[0];
    setCurrentOutfit({
      fullOutfit: defaultFull,
      outerwear: defaultOuter,
      bottom: defaultBottom,
      accessory: defaultAcc,
      footwear: defaultFoot,
      customImage: defaultFull?.imageUrl,
      customColorOuter: defaultOuter ? defaultOuter.heroColor : '#1F3A4B',
      customColorBottom: defaultBottom ? defaultBottom.heroColor : '#1A1A1A',
      customColorAccessory: defaultAcc ? defaultAcc.heroColor : '#D4AF37',
      targetOccasion: 'Dạo Phố & Cafe',
      lookbookTitle: 'Bản Phối Cổ Phục Remix',
      creatorName: 'Gen Z Heritage Stylist',
      introduction: '',
    });
    setIntroText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Studio Header: Đổi thành Xưởng May theo yêu cầu */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Xưởng May · Thử & Phối Đồ Cổ Phục
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Xưởng May Đo & Phối Trang Phục Di Sản
          </h2>
          <p className="text-xs md:text-sm text-[#57534E] mt-1 max-w-xl">
            Tự do thử nghiệm các lớp trang phục, tải trực tiếp nhiều hình ảnh cho từng món đồ và ghi lời giới thiệu trang phục theo góc nhìn riêng của bạn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <input
            ref={directImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          <button
            onClick={() => {
              if (!isAdmin) {
                alert('Chỉ tài khoản Admin (Quản trị viên) mới có quyền tải ảnh trang phục mới! Vui lòng đăng nhập với tài khoản Admin.');
                onOpenAuthModal?.();
                return;
              }
              directImageInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-2xs cursor-pointer"
            title={isAdmin ? 'Tải ảnh trang phục' : 'Yêu cầu quyền Admin để tải ảnh'}
          >
            <Upload className="w-3.5 h-3.5 text-[#F4A261]" />
            <span>Tải Lên Ảnh Trang Phục</span>
          </button>

          {onOpenCmsModal && (
            <button
              onClick={onOpenCmsModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1A1918] bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-md transition-colors shadow-2xs cursor-pointer"
              title="Tự thêm trang phục hoặc thông tin vào hệ thống"
            >
              <Plus className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Thêm Món Đồ Mới</span>
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

      {/* Main Studio Grid: 5 Cols Showcase + 7 Cols Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column (5 Cols): Interactive Costume Display & Free Intro Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col items-center">
            {/* Top Bar above Costume Display */}
            <div className="w-full flex items-center justify-between text-xs pb-3 border-b border-[#F2EFE9] gap-2">
              <span className="text-sm font-bold text-[#1A1918] truncate max-w-[260px] sm:max-w-[320px]">
                {currentOutfit.fullOutfit?.name || currentOutfit.lookbookTitle || 'Bộ Trang Phục'}
              </span>

              {/* Next and Previous component navigation buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevComponent}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#DDD6CA] rounded-lg text-[#57534E] hover:text-[#1A1918] transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-medium"
                  title="Thành phần trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Trước</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextComponent}
                  className="px-2.5 py-1 bg-[#9E2A2B] hover:bg-[#831F20] text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold shadow-2xs"
                  title="Chuyển sang thành phần tiếp theo"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Costume Display Canvas: Hiển thị đúng thành phần đang chọn */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDropImage}
              className={`w-full relative rounded-xl overflow-hidden my-2 flex items-center justify-center min-h-[440px] bg-gradient-to-b from-[#FBFBFA] to-[#F5F2EB] border transition-all ${
                isDraggingOver ? 'border-[#9E2A2B] bg-[#9E2A2B]/5 ring-2 ring-[#9E2A2B]/20' : 'border-[#EDE8DF]'
              }`}
            >
              {/* Overlaid Prev / Next buttons on canvas */}
              <button
                type="button"
                onClick={handlePrevComponent}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1A1918] shadow-md border border-[#E7E2D8] flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                title="Xem thành phần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextComponent}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1A1918] shadow-md border border-[#E7E2D8] flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                title="Xem thành phần tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Top pill showing currently displayed component */}
              <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#DDD6CA] shadow-2xs text-[11px] font-semibold text-[#1A1918] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9E2A2B]" />
                <span>{focusedDisplay.stepLabel}</span>
              </div>

              {/* Component Content */}
              {focusedDisplay.img ? (
                /* 1. Component has an image */
                <div className="relative z-10 w-full h-full min-h-[440px] p-4 flex flex-col items-center justify-center">
                  <div className="relative w-full max-h-[410px] flex items-center justify-center overflow-hidden rounded-xl">
                    <img
                      src={focusedDisplay.img}
                      alt={focusedDisplay.name}
                      style={{
                        transform: `scale(${imageScale})`,
                        transition: 'transform 0.2s ease',
                      }}
                      className="max-h-[400px] w-auto max-w-full object-contain rounded-lg drop-shadow-md select-none"
                    />
                  </div>

                  {/* Badge info at bottom of image */}
                  <div className="mt-3 bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                    <span className="font-semibold truncate max-w-[240px]">
                      {focusedDisplay.name}
                    </span>
                    <span className="text-[10px] text-[#E9C46A] shrink-0 font-medium">
                      {focusedDisplay.stepLabel}
                    </span>
                  </div>
                </div>
              ) : focusedComponentKey === 'bo_trang_phuc' && showIllustrationFallback ? (
                /* 2. Full Outfit Illustration Fallback */
                <div className="relative z-10 w-full py-4 flex flex-col items-center justify-center">
                  <CostumeIllustration
                    outerwear={currentOutfit.outerwear}
                    innerwear={currentOutfit.innerwear}
                    bottom={currentOutfit.bottom}
                    accessory={currentOutfit.accessory}
                    footwear={currentOutfit.footwear}
                    outerColor={currentOutfit.customColorOuter}
                    innerColor={currentOutfit.customColorInner || currentOutfit.innerwear?.heroColor}
                    bottomColor={currentOutfit.customColorBottom}
                    accessoryColor={currentOutfit.customColorAccessory}
                    footwearColor={currentOutfit.customColorFootwear || currentOutfit.footwear?.heroColor}
                    size="full"
                    showMannequin={false}
                    gender={currentOutfit.gender || 'Nam'}
                    customImage={currentOutfit.customImage}
                  />
                  <button
                    onClick={() => setShowIllustrationFallback(false)}
                    className="mt-2 text-[11px] text-[#9E2A2B] hover:underline cursor-pointer"
                  >
                    ← Quay lại ảnh
                  </button>
                </div>
              ) : focusedDisplay.item ? (
                /* 3. Component has costume item data without direct photo -> Show item visual */
                <div className="relative z-10 w-full min-h-[440px] p-6 flex flex-col items-center justify-center">
                  <div className="p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#EDE8DF] shadow-xs">
                    <CostumeItemVisual
                      item={focusedDisplay.item}
                      color={focusedDisplay.color}
                      className="w-48 h-56 sm:w-56 sm:h-64"
                    />
                  </div>

                  <div className="mt-4 bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                    <span className="font-semibold truncate max-w-[240px]">
                      {focusedDisplay.name}
                    </span>
                    <span className="text-[10px] text-[#E9C46A] shrink-0 font-medium">
                      {focusedDisplay.stepLabel}
                    </span>
                  </div>
                </div>
              ) : (
                /* 4. Component not equipped yet -> Elegant empty state */
                <div className="relative z-10 w-full max-w-sm mx-auto p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E7E2D8] flex items-center justify-center shadow-xs text-[#9E2A2B] mb-3">
                    <Layers className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1918]">
                    Chưa chọn {focusedDisplay.stepLabel}
                  </h4>
                  <p className="text-xs text-[#78716C] mt-1 max-w-xs leading-relaxed">
                    Chọn một món trong danh mục thành phần bên dưới hoặc bấm nút Next để xem các thành phần khác.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep('items');
                        setActiveStreamCategory(focusedDisplay.categoryKey);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      + Chọn {focusedDisplay.stepLabel}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextComponent}
                      className="px-3 py-2 text-xs font-medium text-[#1A1918] bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Tiếp theo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {focusedComponentKey === 'bo_trang_phuc' && (
                    <button
                      type="button"
                      onClick={() => setShowIllustrationFallback(true)}
                      className="mt-3 text-[11px] text-[#78716C] hover:text-[#1A1918] underline cursor-pointer"
                    >
                      Xem sơ đồ phối các lớp áo
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CÁC THÀNH PHẦN: SẮP XẾP THEO THỨ TỰ: 1. ÁO ĐẦU TIÊN -> 2. ÁO NGOÀI -> 3. THÂN DƯỚI -> 4. GIÀY DÉP -> 5. PHỤ KIỆN */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1918]">
                  Các thành phần
                </span>
                <button
                  type="button"
                  onClick={handleNextComponent}
                  className="text-xs font-semibold text-[#9E2A2B] hover:text-[#831F20] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next thành phần</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slot Bộ Trang Phục + 5 Bước Thành Phần Tuần Tự */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 0. Slot Bộ Trang Phục */}
                <button
                  type="button"
                  onClick={() => handleNavigateToComponent('bo_trang_phuc')}
                  className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer col-span-2 sm:col-span-1 ${
                    focusedComponentKey === 'bo_trang_phuc'
                      ? 'bg-[#FBF8F3] border-[#9E2A2B] ring-1.5 ring-[#9E2A2B] shadow-2xs'
                      : currentOutfit.fullOutfit
                      ? 'bg-white border-[#DDD6CA] hover:border-[#9E2A2B]'
                      : 'bg-[#FAF9F6] border-[#EDE8DF] hover:border-[#9E2A2B]'
                  }`}
                  title="Xem thành phần: Bộ Trang Phục"
                >
                  <div className="w-11 h-13 rounded-lg overflow-hidden bg-white border border-[#DDD6CA] shrink-0 flex items-center justify-center">
                    {currentOutfit.fullOutfit?.imageUrl || currentOutfit.customImage ? (
                      <img
                        src={currentOutfit.fullOutfit?.imageUrl || currentOutfit.customImage}
                        alt="Bộ trang phục"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#9E2A2B] font-bold">Bộ Đồ</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-[#9E2A2B] uppercase tracking-wider">
                      Bộ Trang Phục
                    </div>
                    <div className="text-xs font-semibold text-[#1A1918] truncate">
                      {currentOutfit.fullOutfit?.name || 'Bộ trang phục'}
                    </div>
                    <div className="text-[10px] text-[#78716C] truncate">
                      {currentOutfit.fullOutfit ? 'Đã trang bị' : '+ Chọn trang phục'}
                    </div>
                  </div>
                </button>

                {/* 1 -> 5: Tuần tự: 1. Áo trong -> 2. Áo ngoài -> 3. Thân dưới -> 4. Giày dép -> 5. Phụ kiện */}
                {orderedSetSteps.map((step) => {
                  const isEquipped = Boolean(step.item);
                  const isFocused = focusedComponentKey === step.categoryKey;
                  const itemImg =
                    step.item?.imageUrl || (step.item?.imageUrls && step.item.imageUrls[0]);

                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => handleNavigateToComponent(step.categoryKey)}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                        isFocused
                          ? 'bg-[#FBF8F3] border-[#9E2A2B] ring-1.5 ring-[#9E2A2B] shadow-2xs'
                          : isEquipped
                          ? 'bg-white border-[#DDD6CA] hover:border-[#9E2A2B]'
                          : 'bg-[#FAF9F6] border-dashed border-[#DDD6CA] hover:border-[#9E2A2B] opacity-80'
                      }`}
                      title={`Xem thành phần: ${step.name}`}
                    >
                      {/* Thumbnail Image */}
                      <div className="w-11 h-13 rounded-lg overflow-hidden bg-white border border-[#DDD6CA] shrink-0 flex items-center justify-center relative">
                        {itemImg ? (
                          <img
                            src={itemImg}
                            alt={step.item?.name || step.name}
                            className="w-full h-full object-cover"
                          />
                        ) : step.item ? (
                          <CostumeItemVisual
                            item={step.item}
                            color={step.color}
                            className="w-full h-full"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-[#A8A29E]">
                            {step.stepNumber}
                          </span>
                        )}

                        {/* Step badge */}
                        <span className="absolute top-0 left-0 w-3.5 h-3.5 bg-[#1A1918] text-white text-[9px] font-bold flex items-center justify-center rounded-br">
                          {step.stepNumber}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-[#78716C] truncate">
                          {step.shortTitle}
                        </div>
                        <div className="text-xs font-semibold text-[#1A1918] truncate">
                          {step.item?.name || <span className="text-[#A8A29E] font-normal italic">Chưa chọn</span>}
                        </div>
                        <div className="text-[10px] text-[#9E2A2B] flex items-center gap-0.5 mt-0.5">
                          <span>{isFocused ? 'Đang xem' : 'Xem món'}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Layers Summary Strip with Quick Remove buttons */}
            <div className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#EDE8DF] text-xs space-y-1.5 mt-3">
              <div className="flex justify-between items-center text-[#78716C]">
                <span>1. Áo (Thân trên đầu tiên):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#1A1918]">
                    {currentOutfit.innerwear?.name || <span className="text-[#A8A29E] font-normal italic">Chưa chọn</span>}
                  </span>
                  {currentOutfit.innerwear && (
                    <button
                      onClick={() => handleRemovePart('innerwear')}
                      className="text-[#A8A29E] hover:text-[#9E2A2B] p-0.5 rounded cursor-pointer"
                      title="Gỡ bỏ lớp áo này"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[#78716C]">
                <span>2. Áo ngoài:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#1A1918]">
                    {currentOutfit.outerwear?.name || <span className="text-[#A8A29E] font-normal italic">Chưa chọn</span>}
                  </span>
                  {currentOutfit.outerwear && (
                    <button
                      onClick={() => handleRemovePart('outerwear')}
                      className="text-[#A8A29E] hover:text-[#9E2A2B] p-0.5 rounded cursor-pointer"
                      title="Gỡ bỏ áo ngoài"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[#78716C]">
                <span>3. Thân dưới:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#1A1918]">
                    {currentOutfit.bottom?.name || <span className="text-[#A8A29E] font-normal italic">Chưa chọn</span>}
                  </span>
                  {currentOutfit.bottom && (
                    <button
                      onClick={() => handleRemovePart('bottom')}
                      className="text-[#A8A29E] hover:text-[#9E2A2B] p-0.5 rounded cursor-pointer"
                      title="Gỡ bỏ quần/váy"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[#78716C]">
                <span>4. Giày dép:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#1A1918]">
                    {currentOutfit.footwear?.name || <span className="text-[#A8A29E] font-normal italic">Chưa chọn</span>}
                  </span>
                  {currentOutfit.footwear && (
                    <button
                      onClick={() => handleRemovePart('footwear')}
                      className="text-[#A8A29E] hover:text-[#9E2A2B] p-0.5 rounded cursor-pointer"
                      title="Gỡ bỏ giày dép"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[#78716C]">
                <span>5. Phụ kiện:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#1A1918]">
                    {currentOutfit.accessory?.name || <span className="text-[#A8A29E] font-normal italic">Không dùng</span>}
                  </span>
                  {currentOutfit.accessory && (
                    <button
                      onClick={() => handleRemovePart('accessory')}
                      className="text-[#A8A29E] hover:text-[#9E2A2B] p-0.5 rounded cursor-pointer"
                      title="Gỡ bỏ phụ kiện"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* GIỚI THIỆU VỀ TRANG PHỤC */}
          <div className="bg-white border border-[#E7E2D8] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#9E2A2B]" />
                <h4 className="text-sm font-bold text-[#1A1918]">
                  Giới thiệu về trang phục
                </h4>
              </div>
            </div>

            {/* Input Textarea for free-form introduction */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1918] flex items-center justify-between">
                <span>Giới thiệu về trang phục:</span>
                {introSavedNotice && (
                  <span className="text-[11px] font-medium text-[#2D6A4F] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã lưu lời giới thiệu
                  </span>
                )}
              </label>

              <textarea
                value={introText}
                onChange={(e) => handleIntroTextChange(e.target.value)}
                placeholder="Bạn tự do ghi những dòng chữ để giới thiệu về trang phục: câu chuyện nguồn gốc, cảm hứng sáng tạo, chất liệu hoặc thông điệp bạn muốn gửi gắm..."
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-lg focus:outline-none transition-all leading-relaxed placeholder:text-[#A8A29E]"
              />
            </div>

            {/* Live Card Presentation of the Introduction (Hiển thị tao nhã lời giới thiệu của người gửi) */}
            {introText.trim() && (
              <div className="bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-4 relative space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#9E2A2B] font-semibold border-b border-[#EAE6DF] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Lời người gửi giới thiệu</span>
                  </span>
                  <span className="text-[#78716C] font-normal">
                    Tác giả: {currentOutfit.creatorName || 'Người yêu di sản'}
                  </span>
                </div>

                <p className="text-xs text-[#1A1918] leading-relaxed whitespace-pre-line italic font-serif">
                  “{introText}”
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Customizer Controls with Distinct Component Streams */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#EAE6DF] pb-3">
            <button
              onClick={() => setActiveStep('items')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'items'
                  ? 'bg-[#1A1918] text-white shadow-2xs'
                  : 'bg-white text-[#57534E] hover:text-[#1A1918] border border-[#DDD6CA]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Chọn & Phân Luồng Trang Phục</span>
            </button>

            <button
              onClick={() => setActiveStep('occasion')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'occasion'
                  ? 'bg-[#1A1918] text-white shadow-2xs'
                  : 'bg-white text-[#57534E] hover:text-[#1A1918] border border-[#DDD6CA]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>2. Dịp Phối & Sự Kiện</span>
            </button>
          </div>

          {/* STEP 1: CHỌN TRANG PHỤC VỚI PHÂN LUỒNG RIÊNG CHO TỪNG THÀNH PHẦN */}
          {activeStep === 'items' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Category Stream Pills Navigator */}
              <div className="bg-white border border-[#E7E2D8] rounded-xl p-3 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1918] block">
                    Danh mục thành phần trong trang phục:
                  </span>
                  <span className="text-[11px] font-semibold text-[#9E2A2B] bg-[#9E2A2B]/10 px-2.5 py-0.5 rounded-full">
                    Đang xem: {focusedDisplay.stepLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { key: 'all' as const, label: 'Tất Cả', count: costumes.length },
                    { key: 'bo_trang_phuc' as const, label: 'Bộ Trang Phục', count: fullOutfitOptions.length },
                    { key: 'ao_trong' as const, label: '1. Áo (Thân trên)', count: innerOptions.length },
                    { key: 'ao_ngoai' as const, label: '2. Áo Ngoài', count: outerOptions.length },
                    { key: 'quan_vay' as const, label: '3. Thân Dưới', count: bottomOptions.length },
                    { key: 'giay_dep' as const, label: '4. Giày Dép', count: footwearOptions.length },
                    { key: 'phu_kien' as const, label: '5. Phụ Kiện', count: accessoryOptions.length },
                  ].map((stream) => (
                    <button
                      key={stream.key}
                      type="button"
                      onClick={() => {
                        setActiveStreamCategory(stream.key);
                        if (stream.key !== 'all') {
                          handleNavigateToComponent(stream.key);
                        }
                      }}
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
              </div>

              {/* 0. PHÂN LUỒNG: BỘ TRANG PHỤC */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'bo_trang_phuc') && (
                <div
                  id="stream-bo_trang_phuc"
                  className={`bg-white border rounded-xl p-5 shadow-2xs space-y-3 transition-all ${
                    highlightedStream === 'bo_trang_phuc'
                      ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/30'
                      : 'border-[#E7E2D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#9E2A2B] text-white text-[10px] flex items-center justify-center font-bold">
                        ★
                      </span>
                      <span>Bộ Trang Phục</span>
                      {focusedComponentKey === 'bo_trang_phuc' && (
                        <span className="text-[10px] font-semibold bg-[#9E2A2B] text-white px-2 py-0.5 rounded-full">
                          Đang xem trên hình
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentOutfit.fullOutfit && (
                        <button
                          onClick={() => handleRemovePart('fullOutfit')}
                          className="text-[11px] font-medium text-[#9E2A2B] hover:text-[#831F20] hover:underline cursor-pointer"
                        >
                          Bỏ chọn bộ này
                        </button>
                      )}
                      <span className="text-xs text-[#78716C]">{fullOutfitOptions.length} lựa chọn</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#78716C]">
                    Hình ảnh của bộ trang phục. Bạn có thể chọn set đồ có sẵn hoặc tải thẳng hình ảnh lên.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* 1. PHÂN LUỒNG: ÁO (ÁO ĐẦU TIÊN / THÂN TRÊN) */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'ao_trong') && (
                <div
                  id="stream-ao_trong"
                  className={`bg-white border rounded-xl p-5 shadow-2xs space-y-3 transition-all ${
                    highlightedStream === 'ao_trong'
                      ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/30'
                      : 'border-[#E7E2D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E07A5F] text-white text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                      <span>Áo (Bộ Phận Áo Đầu Tiên / Thân Trên)</span>
                      {focusedComponentKey === 'ao_trong' && (
                        <span className="text-[10px] font-semibold bg-[#9E2A2B] text-white px-2 py-0.5 rounded-full">
                          Đang xem trên hình
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentOutfit.innerwear && (
                        <button
                          onClick={() => handleRemovePart('innerwear')}
                          className="text-[11px] font-medium text-[#9E2A2B] hover:text-[#831F20] hover:underline cursor-pointer"
                        >
                          Bỏ chọn món này
                        </button>
                      )}
                      <span className="text-xs text-[#78716C]">{innerOptions.length} lựa chọn</span>
                    </div>
                  </div>

                  {innerOptions.length === 0 ? (
                    <p className="text-xs text-[#78716C] italic py-2">
                      Chưa có áo trong. Bạn có thể bấm "Thêm Món Đồ Mới" để bổ sung áo cánh sen, áo yếm...
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  )}
                </div>
              )}

              {/* 2. PHÂN LUỒNG: ÁO NGOÀI */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'ao_ngoai') && (
                <div
                  id="stream-ao_ngoai"
                  className={`bg-white border rounded-xl p-5 shadow-2xs space-y-3 transition-all ${
                    highlightedStream === 'ao_ngoai'
                      ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/30'
                      : 'border-[#E7E2D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#9E2A2B] text-white text-[10px] flex items-center justify-center font-bold">
                        2
                      </span>
                      <span>Áo Ngoài (Ngũ Thân / Tấc / Nhật Bình / Giao Lĩnh)</span>
                      {focusedComponentKey === 'ao_ngoai' && (
                        <span className="text-[10px] font-semibold bg-[#9E2A2B] text-white px-2 py-0.5 rounded-full">
                          Đang xem trên hình
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentOutfit.outerwear && (
                        <button
                          onClick={() => handleRemovePart('outerwear')}
                          className="text-[11px] font-medium text-[#9E2A2B] hover:text-[#831F20] hover:underline cursor-pointer"
                        >
                          Bỏ chọn áo này
                        </button>
                      )}
                      <span className="text-xs text-[#78716C]">{outerOptions.length} lựa chọn</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* 3. PHÂN LUỒNG: THÂN DƯỚI (QUẦN / VÁY) */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'quan_vay') && (
                <div
                  id="stream-quan_vay"
                  className={`bg-white border rounded-xl p-5 shadow-2xs space-y-3 transition-all ${
                    highlightedStream === 'quan_vay'
                      ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/30'
                      : 'border-[#E7E2D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1A1918] text-white text-[10px] flex items-center justify-center font-bold">
                        3
                      </span>
                      <span>Thân Dưới (Quần Lụa / Chân Váy)</span>
                      {focusedComponentKey === 'quan_vay' && (
                        <span className="text-[10px] font-semibold bg-[#9E2A2B] text-white px-2 py-0.5 rounded-full">
                          Đang xem trên hình
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentOutfit.bottom && (
                        <button
                          onClick={() => handleRemovePart('bottom')}
                          className="text-[11px] font-medium text-[#9E2A2B] hover:text-[#831F20] hover:underline cursor-pointer"
                        >
                          Bỏ chọn món này
                        </button>
                      )}
                      <span className="text-xs text-[#78716C]">{bottomOptions.length} lựa chọn</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* 4. PHÂN LUỒNG: GIÀY DÉP */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'giay_dep') && (
                <div
                  id="stream-giay_dep"
                  className={`bg-white border rounded-xl p-5 shadow-2xs space-y-3 transition-all ${
                    highlightedStream === 'giay_dep'
                      ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/30'
                      : 'border-[#E7E2D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#57534E] text-white text-[10px] flex items-center justify-center font-bold">
                        4
                      </span>
                      <span>Giày Dép (Hài Thêu / Guốc Mộc / Sneaker)</span>
                      {focusedComponentKey === 'giay_dep' && (
                        <span className="text-[10px] font-semibold bg-[#9E2A2B] text-white px-2 py-0.5 rounded-full">
                          Đang xem trên hình
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentOutfit.footwear && (
                        <button
                          onClick={() => handleRemovePart('footwear')}
                          className="text-[11px] font-medium text-[#9E2A2B] hover:text-[#831F20] hover:underline cursor-pointer"
                        >
                          Bỏ giày dép này
                        </button>
                      )}
                      <span className="text-xs text-[#78716C]">{footwearOptions.length} lựa chọn</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* 5. PHÂN LUỒNG: PHỤ KIỆN */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'phu_kien') && (
                <div
                  id="stream-phu_kien"
                  className={`bg-white border rounded-xl p-5 shadow-2xs space-y-3 transition-all ${
                    highlightedStream === 'phu_kien'
                      ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/30'
                      : 'border-[#E7E2D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#D4A373] text-white text-[10px] flex items-center justify-center font-bold">
                        5
                      </span>
                      <span>Phụ Kiện (Khăn Đóng / Kiềng Bạc / Trâm Cài)</span>
                      {focusedComponentKey === 'phu_kien' && (
                        <span className="text-[10px] font-semibold bg-[#9E2A2B] text-white px-2 py-0.5 rounded-full">
                          Đang xem trên hình
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentOutfit.accessory && (
                        <button
                          onClick={() => handleRemovePart('accessory')}
                          className="text-[11px] font-medium text-[#9E2A2B] hover:text-[#831F20] hover:underline cursor-pointer"
                        >
                          Bỏ phụ kiện này
                        </button>
                      )}
                      <span className="text-xs text-[#78716C]">{accessoryOptions.length} lựa chọn</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>
          )}

          {/* STEP 2: DỊP PHỐI & SỰ KIỆN */}
          {activeStep === 'occasion' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* CHỌN DỊP / SỰ KIỆN XUẤT HIỆN */}
              <div className="bg-white border border-[#E7E2D8] rounded-xl p-5 shadow-2xs space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[#1A1918]">Chọn Dịp & Sự Kiện Xuất Hiện</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Định hình không gian và dịp sự kiện phù hợp nhất với bản phối của bạn.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {occasions.map((occ) => {
                    const isSelected = currentOutfit.targetOccasion === occ;
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setCurrentOutfit((prev) => ({ ...prev, targetOccasion: occ }))}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FBF8F3] border-[#9E2A2B] ring-1 ring-[#9E2A2B]'
                            : 'bg-white border-[#E7E2D8] hover:border-[#C4BDB0]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#1A1918]">{occ}</div>
                        <div className="text-[11px] text-[#78716C] mt-1">
                          {occ === 'Lễ Tốt Nghiệp' && 'Trang nghiêm, cốt cách trí thức, tự hào nhận bằng'}
                          {occ === 'Dạo Phố & Cafe' && 'Năng động, di chuyển nhẹ nhàng, phối đồ trẻ trung'}
                          {occ === 'Tiệc Cưới & Dự Lễ' && 'Thanh lịch, chúc phúc cô dâu chú rể, nhã nhặn'}
                          {occ === 'Chụp Ảnh Kỷ Yếu' && 'Đậm chất thanh xuân, lưu giữ nét đẹp di sản'}
                          {occ === 'Lễ Hội Truyền Thống / Tết' && 'Rực rỡ sắc xuân, hòa mình vào không khí hội hè'}
                          {occ === 'Trình Diễn & Runway' && 'Phá cách nghệ thuật, tuyên ngôn thời trang đương đại'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lookbook info edit */}
              <div className="bg-white border border-[#E7E2D8] rounded-xl p-5 shadow-2xs space-y-4">
                <h4 className="text-sm font-bold text-[#1A1918]">Thông Tin Bản Phối Của Bạn</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#57534E] block mb-1">
                      Tên Bản Phối
                    </label>
                    <input
                      type="text"
                      value={currentOutfit.lookbookTitle}
                      onChange={(e) =>
                        setCurrentOutfit((prev) => ({ ...prev, lookbookTitle: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#57534E] block mb-1">
                      Tên Người Phối / Người Gửi
                    </label>
                    <input
                      type="text"
                      value={currentOutfit.creatorName}
                      onChange={(e) =>
                        setCurrentOutfit((prev) => ({ ...prev, creatorName: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
