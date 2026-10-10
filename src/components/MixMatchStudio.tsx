import React, { useState, useEffect, useRef } from 'react';
import {
  CostumeItem,
  CostumeCategory,
  OutfitComposition,
  VIETNAMESE_HERITAGE_COLORS,
  HeritageColorOption,
  getVietnameseColorName,
} from '../types/vietphuc';
import { compressImageFile } from '../utils/imageCompressor';
import { CostumeItemVisual } from './CostumeItemVisual';
import {
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
  Shirt,
  Palette,
  Upload,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MixMatchStudioProps {
  costumes: CostumeItem[];
  currentOutfit: OutfitComposition;
  setCurrentOutfit: React.Dispatch<React.SetStateAction<OutfitComposition>>;
  onDeleteCostume?: (id: string) => void;
  onUpdateCostume?: (item: CostumeItem) => void;
  onAddCostume?: (item: CostumeItem) => void;
  onOpenCmsModal?: () => void;
  onOpenLookbookCard: () => void;
  onOpenComparison: () => void;
  onSaveToLookbook?: (outfit: OutfitComposition) => void;
  initialAddCategory?: CostumeCategory | null;
  onClearAddCategory?: () => void;
}

interface CategoryMeta {
  key: CostumeCategory;
  stepNumber?: number;
  label: string;
  shortLabel: string;
  badge: string;
  placeholderName: string;
  description: string;
}

const CATEGORY_LIST: CategoryMeta[] = [
  {
    key: 'bo_trang_phuc',
    label: 'Bộ Trang Phục (Cả Bộ Đồ)',
    shortLabel: 'Bộ Trang Phục',
    badge: 'Cả Bộ',
    placeholderName: 'Ví dụ: Áo Tấc & Quần Lụa Trọn Bộ Hoàng Gia',
    description: 'Trọn bộ trang phục toàn thân liền mạch',
  },
  {
    key: 'ao_trong',
    stepNumber: 1,
    label: '1. Áo Phụ',
    shortLabel: 'Áo Phụ',
    badge: '1. Áo Phụ',
    placeholderName: 'Ví dụ: Áo Yếm Thắt Dây Lụa Tơ, Áo Lót Bạch Sa',
    description: 'Áo lót trong, áo yếm hoặc lớp áo phụ nền nã',
  },
  {
    key: 'ao_ngoai',
    stepNumber: 2,
    label: '2. Áo Chính (Mặt Trước)',
    shortLabel: 'Áo Chính (Mặt Trước)',
    badge: '2. Áo Chính',
    placeholderName: 'Ví dụ: Áo Ngũ Thân Tay Chẽn Gấm Lam, Áo Tấc Đỏ Son',
    description: 'Lớp áo chính mặt trước tôn vinh khí chất cổ phục',
  },
  {
    key: 'quan_vay',
    stepNumber: 3,
    label: '3. Thân Dưới (Quần / Váy)',
    shortLabel: 'Thân Dưới',
    badge: '3. Thân Dưới',
    placeholderName: 'Ví dụ: Quần Lụa Lãnh Mỹ A Đen Tuyền, Chân Váy Đụp Lụa Hà Đông',
    description: 'Quần lụa, chân váy đụp, quần ống rộng',
  },
  {
    key: 'giay_dep',
    stepNumber: 4,
    label: '4. Giày Dép (Hài Thêu / Sneaker)',
    shortLabel: 'Giày Dép',
    badge: '4. Giày Dép',
    placeholderName: 'Ví dụ: Hài Thêu Kim Tuyến Phụng Hoàng, Sneaker Trắng Ngà',
    description: 'Hài thêu, guốc mộc truyền thống hoặc giày phối tân thời',
  },
  {
    key: 'phu_kien',
    stepNumber: 5,
    label: '5. Phụ Kiện (Khăn Đóng / Kiềng Bạc / Quạt)',
    shortLabel: 'Phụ Kiện',
    badge: '5. Phụ Kiện',
    placeholderName: 'Ví dụ: Khăn Đóng Ngũ Thân, Kiềng Bạc Chạm Sen, Quạt Trầm',
    description: 'Khăn vấn, kiềng bạc, nón ba tầm, quạt trầm hương',
  },
];

export const MixMatchStudio: React.FC<MixMatchStudioProps> = ({
  costumes,
  currentOutfit,
  setCurrentOutfit,
  onDeleteCostume,
  onUpdateCostume,
  onAddCostume,
  onOpenLookbookCard,
  onOpenComparison,
  onSaveToLookbook,
  initialAddCategory,
  onClearAddCategory,
}) => {
  const [activeStreamCategory, setActiveStreamCategory] = useState<CostumeCategory | 'all'>('all');
  const [savedToLookbook, setSavedToLookbook] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Category in which inline Add Form is currently open
  const [activeAddCategory, setActiveAddCategory] = useState<CostumeCategory | null>(null);

  // Costume ID currently in inline Color-Editing mode
  const [editingColorItemId, setEditingColorItemId] = useState<string | null>(null);
  const [editColorHex, setEditColorHex] = useState('#9E2A2B');
  const [editColorLabel, setEditColorLabel] = useState('Đỏ son');

  // Add Costume Form fields state
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState('#9E2A2B');
  const [formColorLabel, setFormColorLabel] = useState('Đỏ son');
  const [formImageUrls, setFormImageUrls] = useState<string[]>([]);
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [formGender, setFormGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [formEra, setFormEra] = useState('Triều Nguyễn (1802 - 1945)');
  const [formMaterial, setFormMaterial] = useState('Lụa tơ tằm truyền thống');
  const [formRegion, setFormRegion] = useState('Cố đô Huế');

  // Free-form introduction text state (syncs with currentOutfit.introduction)
  const [introText, setIntroText] = useState(currentOutfit.introduction || '');

  const categoryContainerRef = useRef<HTMLDivElement>(null);

  // Sync intro text when currentOutfit changes externally
  useEffect(() => {
    if (currentOutfit.introduction !== undefined && currentOutfit.introduction !== introText) {
      setIntroText(currentOutfit.introduction);
    }
  }, [currentOutfit.introduction]);

  // Handle external trigger to open add form in a specific category (e.g. from Header)
  useEffect(() => {
    if (initialAddCategory) {
      setActiveAddCategory(initialAddCategory);
      if (activeStreamCategory !== 'all' && activeStreamCategory !== initialAddCategory) {
        setActiveStreamCategory('all');
      }
      // Scroll to category
      setTimeout(() => {
        const el = document.getElementById(`category-section-${initialAddCategory}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      if (onClearAddCategory) {
        onClearAddCategory();
      }
    }
  }, [initialAddCategory, activeStreamCategory, onClearAddCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
        next.customColorOuterLabel = undefined;
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

  // Selection handlers with color annotation preservation
  const handleSelectFullOutfit = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorOuter)
      ? currentOutfit.customColorOuter
      : item.heroColor;
    const colorLabel = item.colorLabel || getVietnameseColorName(newColor);

    setCurrentOutfit((prev) => ({
      ...prev,
      fullOutfit: item,
      customImage: item.imageUrl || (item.imageUrls && item.imageUrls[0]),
      fullOutfitImages: item.imageUrls || (item.imageUrl ? [item.imageUrl] : []),
      customColorOuter: newColor,
      customColorOuterLabel: colorLabel,
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
    const colorLabel = item.colorLabel || getVietnameseColorName(newColor);

    setCurrentOutfit((prev) => ({
      ...prev,
      outerwear: item,
      customColorOuter: newColor,
      customColorOuterLabel: colorLabel,
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
    const colorLabel = item.colorLabel || getVietnameseColorName(newColor);

    setCurrentOutfit((prev) => ({
      ...prev,
      innerwear: item,
      customColorInner: newColor,
      customColorInnerLabel: colorLabel,
      gender: item.gender || prev.gender || 'Nam',
    }));
  };

  const handleSelectBottom = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorBottom)
      ? currentOutfit.customColorBottom
      : item.heroColor;
    const colorLabel = item.colorLabel || getVietnameseColorName(newColor);

    setCurrentOutfit((prev) => ({
      ...prev,
      bottom: item,
      customColorBottom: newColor,
      customColorBottomLabel: colorLabel,
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
    const colorLabel = item.colorLabel || getVietnameseColorName(newColor);

    setCurrentOutfit((prev) => ({
      ...prev,
      footwear: item,
      customColorFootwear: newColor,
      customColorFootwearLabel: colorLabel,
    }));
  };

  const handleSelectAccessory = (item: CostumeItem) => {
    const itemColors =
      item.availableColors && item.availableColors.length > 0 ? item.availableColors : [item.heroColor];
    const newColor = itemColors.includes(currentOutfit.customColorAccessory)
      ? currentOutfit.customColorAccessory
      : item.heroColor;
    const colorLabel = item.colorLabel || getVietnameseColorName(newColor);

    setCurrentOutfit((prev) => ({
      ...prev,
      accessory: item,
      customColorAccessory: newColor,
      customColorAccessoryLabel: colorLabel,
    }));
  };

  // Color selection for an equipped item
  const handleColorOptionSelect = (
    category: CostumeCategory,
    item: CostumeItem,
    color: string,
    colorLabel?: string
  ) => {
    const resolvedLabel = colorLabel || getVietnameseColorName(color);
    setCurrentOutfit((prev) => {
      switch (category) {
        case 'bo_trang_phuc':
          return {
            ...prev,
            fullOutfit: item,
            customColorOuter: color,
            customColorOuterLabel: resolvedLabel,
          };
        case 'ao_ngoai':
          return {
            ...prev,
            outerwear: item,
            customColorOuter: color,
            customColorOuterLabel: resolvedLabel,
            gender: item.gender || prev.gender || 'Nam',
          };
        case 'ao_trong':
          return {
            ...prev,
            innerwear: item,
            customColorInner: color,
            customColorInnerLabel: resolvedLabel,
            gender: item.gender || prev.gender || 'Nam',
          };
        case 'quan_vay':
          return {
            ...prev,
            bottom: item,
            customColorBottom: color,
            customColorBottomLabel: resolvedLabel,
            gender: item.gender || prev.gender || 'Nam',
          };
        case 'giay_dep':
          return {
            ...prev,
            footwear: item,
            customColorFootwear: color,
            customColorFootwearLabel: resolvedLabel,
          };
        case 'phu_kien':
          return {
            ...prev,
            accessory: item,
            customColorAccessory: color,
            customColorAccessoryLabel: resolvedLabel,
          };
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
      customColorOuterLabel: 'Đỏ son',
      customColorBottom: '#1A1A1A',
      customColorBottomLabel: 'Đen tuyền',
      customColorAccessory: '#D4AF37',
      customColorAccessoryLabel: 'Vàng kim',
      targetOccasion: 'Dạo Phố & Cafe',
      lookbookTitle: 'Bản Phối Mới',
      creatorName: 'Người Yêu Di Sản',
      introduction: '',
    });
    setIntroText('');
    showToast('Đã đặt lại bản phối mặc định');
  };

  // Image upload handler for inline add form (Auto-compress to prevent LocalStorage Quota Exceeded)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      for (const file of fileList) {
        try {
          const compressed = await compressImageFile(file, 900, 0.8);
          if (compressed) {
            setFormImageUrls((prev) => [...prev, compressed]);
          }
        } catch {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            if (result) {
              setFormImageUrls((prev) => [...prev, result]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleAddImageUrlInput = () => {
    if (formImageUrlInput.trim()) {
      setFormImageUrls((prev) => [...prev, formImageUrlInput.trim()]);
      setFormImageUrlInput('');
    }
  };

  const handleRemoveFormImage = (index: number) => {
    setFormImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Open add form for a category
  const handleOpenAddForm = (categoryKey: CostumeCategory) => {
    if (activeAddCategory === categoryKey) {
      setActiveAddCategory(null);
    } else {
      setActiveAddCategory(categoryKey);
      setFormName('');
      setFormColor('#9E2A2B');
      setFormColorLabel('Đỏ son');
      setFormImageUrls([]);
      setFormImageUrlInput('');
    }
  };

  // Save new costume directly into the category
  const handleSaveNewCostume = (categoryKey: CostumeCategory, autoEquip: boolean = true) => {
    if (!formName.trim()) {
      alert('Vui lòng nhập tên trang phục!');
      return;
    }

    const catInfo = CATEGORY_LIST.find((c) => c.key === categoryKey);
    const resolvedColorLabel = formColorLabel.trim() || getVietnameseColorName(formColor);

    const newItem: CostumeItem = {
      id: `costume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: formName.trim(),
      category: categoryKey,
      era: formEra.trim() || 'Cảm hứng di sản Việt Nam',
      region: formRegion.trim() || 'Việt Nam',
      gender: formGender,
      heroColor: formColor,
      colorLabel: resolvedColorLabel,
      availableColors: [formColor],
      material: formMaterial.trim() || 'Chất liệu lụa truyền thống',
      originStory: `Trang phục ${formName.trim()} thuộc danh mục ${catInfo?.shortLabel || 'Cổ phục'}, mang sắc ${resolvedColorLabel}.`,
      culturalMeaning: 'Thể hiện vẻ đẹp trang nhã, đoan chính và niềm tự hào di sản truyền thống Việt Nam.',
      remixTips: 'Phối màu tinh tế cùng các lớp trang phục trong xưởng may để tạo nên phong cách độc đáo.',
      culturalAdvisory: 'Cài vạt hữu nhậm (vạt phải) đối với áo truyền thống, giữ phom dáng thanh thoát.',
      imageUrl: formImageUrls[0] || undefined,
      imageUrls: formImageUrls.length > 0 ? formImageUrls : undefined,
      suitableOccasions: ['Dạo Phố & Cafe', 'Lễ Tốt Nghiệp', 'Tiệc Cưới & Dự Lễ', 'Chụp Ảnh Kỷ Yếu'],
      isCustom: true,
    };

    if (onAddCostume) {
      onAddCostume(newItem);
    }

    if (autoEquip) {
      if (categoryKey === 'bo_trang_phuc') handleSelectFullOutfit(newItem);
      else if (categoryKey === 'ao_trong') handleSelectInner(newItem);
      else if (categoryKey === 'ao_ngoai') handleSelectOuter(newItem);
      else if (categoryKey === 'quan_vay') handleSelectBottom(newItem);
      else if (categoryKey === 'giay_dep') handleSelectFootwear(newItem);
      else if (categoryKey === 'phu_kien') handleSelectAccessory(newItem);
    }

    // Reset form state & close form
    setFormName('');
    setFormImageUrls([]);
    setFormImageUrlInput('');
    setActiveAddCategory(null);
    showToast(`Đã thêm "${newItem.name}" với chú thích màu "${resolvedColorLabel}"!`);
  };

  // Open inline color editing for an existing costume item
  const handleStartEditColor = (item: CostumeItem) => {
    setEditingColorItemId(item.id);
    setEditColorHex(item.heroColor || '#9E2A2B');
    setEditColorLabel(item.colorLabel || getVietnameseColorName(item.heroColor || '#9E2A2B'));
  };

  // Save updated color & color label for an existing costume item
  const handleSaveEditedColor = (item: CostumeItem) => {
    const updatedLabel = editColorLabel.trim() || getVietnameseColorName(editColorHex);
    const existingColors = item.availableColors || [item.heroColor];
    const newColors = Array.from(new Set([editColorHex, ...existingColors]));

    const updatedItem: CostumeItem = {
      ...item,
      heroColor: editColorHex,
      colorLabel: updatedLabel,
      availableColors: newColors,
    };

    if (onUpdateCostume) {
      onUpdateCostume(updatedItem);
    }

    // If this item is currently equipped, update outfit color and label immediately
    if (currentOutfit.fullOutfit?.id === item.id) {
      setCurrentOutfit((prev) => ({
        ...prev,
        fullOutfit: updatedItem,
        customColorOuter: editColorHex,
        customColorOuterLabel: updatedLabel,
      }));
    } else if (currentOutfit.outerwear?.id === item.id) {
      setCurrentOutfit((prev) => ({
        ...prev,
        outerwear: updatedItem,
        customColorOuter: editColorHex,
        customColorOuterLabel: updatedLabel,
      }));
    } else if (currentOutfit.innerwear?.id === item.id) {
      setCurrentOutfit((prev) => ({
        ...prev,
        innerwear: updatedItem,
        customColorInner: editColorHex,
        customColorInnerLabel: updatedLabel,
      }));
    } else if (currentOutfit.bottom?.id === item.id) {
      setCurrentOutfit((prev) => ({
        ...prev,
        bottom: updatedItem,
        customColorBottom: editColorHex,
        customColorBottomLabel: updatedLabel,
      }));
    } else if (currentOutfit.footwear?.id === item.id) {
      setCurrentOutfit((prev) => ({
        ...prev,
        footwear: updatedItem,
        customColorFootwear: editColorHex,
        customColorFootwearLabel: updatedLabel,
      }));
    } else if (currentOutfit.accessory?.id === item.id) {
      setCurrentOutfit((prev) => ({
        ...prev,
        accessory: updatedItem,
        customColorAccessory: editColorHex,
        customColorAccessoryLabel: updatedLabel,
      }));
    }

    setEditingColorItemId(null);
    showToast(`Đã cập nhật chú thích màu: "${updatedLabel}" cho ${item.name}`);
  };

  // Build the vertical display gallery items for the currently equipped outfit
  interface GalleryCardItem {
    key: string;
    categoryLabel: string;
    tagNumber?: number;
    title: string;
    subTitle?: string;
    description?: string;
    color?: string;
    colorLabel?: string;
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
      colorLabel: currentOutfit.customColorOuterLabel || fullItem?.colorLabel || getVietnameseColorName(currentOutfit.customColorOuter),
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
    const activeColor = currentOutfit.customColorInner || item.heroColor;
    galleryItems.push({
      key: 'innerwear',
      categoryLabel: '1. Áo Trong (Thân Trên Đầu Tiên)',
      tagNumber: 1,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: activeColor,
      colorLabel: currentOutfit.customColorInnerLabel || item.colorLabel || getVietnameseColorName(activeColor),
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
    const activeColor = currentOutfit.customColorOuter || item.heroColor;
    galleryItems.push({
      key: 'outerwear',
      categoryLabel: '2. Áo Ngoài (Ngũ Thân / Tấc / Giao Lĩnh / Nhật Bình)',
      tagNumber: 2,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: activeColor,
      colorLabel: currentOutfit.customColorOuterLabel || item.colorLabel || getVietnameseColorName(activeColor),
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
    const activeColor = currentOutfit.customColorBottom || item.heroColor;
    galleryItems.push({
      key: 'bottom',
      categoryLabel: '3. Thân Dưới (Quần Lụa / Váy)',
      tagNumber: 3,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: activeColor,
      colorLabel: currentOutfit.customColorBottomLabel || item.colorLabel || getVietnameseColorName(activeColor),
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
    const activeColor = currentOutfit.customColorFootwear || item.heroColor;
    galleryItems.push({
      key: 'footwear',
      categoryLabel: '4. Giày Dép (Hài Thêu / Sneaker)',
      tagNumber: 4,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: activeColor,
      colorLabel: currentOutfit.customColorFootwearLabel || item.colorLabel || getVietnameseColorName(activeColor),
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
    const activeColor = currentOutfit.customColorAccessory || item.heroColor;
    galleryItems.push({
      key: 'accessory',
      categoryLabel: '5. Phụ Kiện (Khăn Đóng / Kiềng Bạc / Quạt)',
      tagNumber: 5,
      title: item.name,
      subTitle: item.era,
      description: item.culturalMeaning || item.material,
      color: activeColor,
      colorLabel: currentOutfit.customColorAccessoryLabel || item.colorLabel || getVietnameseColorName(activeColor),
      imageUrl: allImgs[0],
      allImages: allImgs,
      itemData: item,
      onRemove: () => handleRemovePart('accessory'),
    });
  }

  // Render inline Add Costume Form inside a category
  const renderInlineAddForm = (categoryMeta: CategoryMeta) => {
    return (
      <div className="bg-[#FAF8F5] border-2 border-[#9E2A2B]/30 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-4 my-2.5">
        {/* Header of Form */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E7E2D8]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#9E2A2B] text-white flex items-center justify-center text-xs font-bold">
              +
            </span>
            <div>
              <h5 className="text-xs font-bold text-[#1A1918]">
                Thêm Trang Phục Vào: <span className="text-[#9E2A2B]">{categoryMeta.label}</span>
              </h5>
              <p className="text-[11px] text-[#78716C]">{categoryMeta.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveAddCategory(null)}
            className="p-1 text-[#78716C] hover:text-[#9E2A2B] hover:bg-[#F2EFE9] rounded transition-colors cursor-pointer"
            title="Đóng form thêm trang phục"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Field 1: Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#1A1918] flex items-center justify-between">
            <span>Tên trang phục <span className="text-[#9E2A2B]">*</span></span>
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder={categoryMeta.placeholderName}
            className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] focus:border-[#9E2A2B] rounded-lg focus:outline-none transition-colors"
          />
        </div>

        {/* Field 2: TỰ CHỌN MÀU SẮC VÀ CHÚ THÍCH MÀU (YÊU CẦU CỐT LÕI) */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#1A1918] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Chọn màu sắc & Chú thích màu sắc cho trang phục:</span>
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-[#78716C]">
              <span>Mã màu:</span>
              <span className="font-mono font-semibold text-[#1A1918]">{formColor}</span>
            </div>
          </div>

          {/* Preset Heritage Color Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#78716C] block">Bảng màu truyền thống gợi ý nhanh:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {VIETNAMESE_HERITAGE_COLORS.map((preset) => {
                const isSelected = formColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setFormColor(preset.hex);
                      setFormColorLabel(preset.name);
                    }}
                    title={`${preset.name} (${preset.hex})`}
                    className={`h-7 px-2 rounded-md text-[10px] font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-[#9E2A2B] bg-[#FDFBF7] ring-1 ring-[#9E2A2B] shadow-2xs font-semibold'
                        : 'border-[#EDE8DF] bg-[#FAF9F6] hover:bg-[#F2EFE9] text-[#57534E]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.name.split(' / ')[0]}</span>
                    {isSelected && <Check className="w-2.5 h-2.5 text-[#9E2A2B] stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker + Custom Color Label Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center pt-1 border-t border-[#F2EFE9]">
            {/* Native Color Picker */}
            <div className="sm:col-span-4 flex items-center gap-2">
              <input
                type="color"
                value={formColor}
                onChange={(e) => {
                  const newHex = e.target.value;
                  setFormColor(newHex);
                  // Auto-suggest name if matching preset or update text
                  const nameMatch = getVietnameseColorName(newHex);
                  if (nameMatch !== newHex) {
                    setFormColorLabel(nameMatch);
                  }
                }}
                className="w-8 h-8 rounded-lg border border-[#DDD6CA] cursor-pointer p-0.5 bg-white shrink-0"
                title="Bấm để tự do chọn màu sắc bất kỳ"
              />
              <span className="text-[11px] text-[#57534E]">Tự chọn mã màu</span>
            </div>

            {/* Custom Color Annotation Input */}
            <div className="sm:col-span-8 space-y-1">
              <input
                type="text"
                value={formColorLabel}
                onChange={(e) => setFormColorLabel(e.target.value)}
                placeholder="Gõ chú thích màu (ví dụ: Đỏ son thêu chỉ vàng, Xanh chàm cổ...)"
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-md focus:outline-none transition-colors"
                title="Chú thích tên màu sắc của trang phục trong danh mục"
              />
            </div>
          </div>

          {/* Live Preview of Color Annotation */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#57534E]">
            <span className="text-[10px] text-[#78716C]">Trang phục sẽ hiển thị là:</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#DDD6CA] font-semibold text-[#1A1918]">
              <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: formColor }} />
              <span>{formColorLabel || getVietnameseColorName(formColor)}</span>
              <span className="text-[10px] text-[#78716C] font-mono">({formColor})</span>
            </span>
          </div>
        </div>

        {/* Field 3: Image Upload & URL */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#1A1918] flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-[#9E2A2B]" />
            <span>Hình ảnh trang phục:</span>
          </label>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Upload File Button */}
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A1918] bg-white hover:bg-[#F2EFE9] border border-[#DDD6CA] rounded-md transition-colors cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Tải ảnh từ máy / điện thoại</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>

            {/* URL Input */}
            <div className="flex-1 min-w-[200px] flex items-center gap-1.5">
              <input
                type="url"
                value={formImageUrlInput}
                onChange={(e) => setFormImageUrlInput(e.target.value)}
                placeholder="Hoặc dán liên kết URL ảnh..."
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#DDD6CA] focus:border-[#9E2A2B] rounded-md focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleAddImageUrlInput}
                className="px-2.5 py-1.5 text-xs font-medium text-[#1A1918] bg-white border border-[#DDD6CA] hover:bg-[#F2EFE9] rounded-md transition-colors cursor-pointer"
              >
                Thêm URL
              </button>
            </div>
          </div>

          {/* Image Previews */}
          {formImageUrls.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {formImageUrls.map((url, idx) => (
                <div key={idx} className="relative w-14 h-16 rounded-md overflow-hidden border border-[#DDD6CA] group/thumb">
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFormImage(idx)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] opacity-80 hover:opacity-100 cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    ×
                  </button>
                </div>
              ))}
              <span className="text-[10px] text-[#78716C] self-center">
                Đã chọn {formImageUrls.length} ảnh
              </span>
            </div>
          )}
        </div>

        {/* Field 4: Quick Details (Gender, Era, Material) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-[#57534E] block mb-1">Giới tính:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormGender('Nam')}
                className={`flex-1 py-1 rounded text-center font-medium border text-[11px] cursor-pointer ${
                  formGender === 'Nam' ? 'bg-[#1A1918] text-white border-[#1A1918]' : 'bg-white border-[#DDD6CA] text-[#57534E]'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setFormGender('Nữ')}
                className={`flex-1 py-1 rounded text-center font-medium border text-[11px] cursor-pointer ${
                  formGender === 'Nữ' ? 'bg-[#9E2A2B] text-white border-[#9E2A2B]' : 'bg-white border-[#DDD6CA] text-[#57534E]'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#57534E] block mb-1">Triều đại / Cảm hứng:</label>
            <input
              type="text"
              value={formEra}
              onChange={(e) => setFormEra(e.target.value)}
              placeholder="Triều Nguyễn, Lê - Trịnh..."
              className="w-full px-2 py-1 bg-white border border-[#DDD6CA] rounded text-[11px] focus:outline-none focus:border-[#9E2A2B]"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#57534E] block mb-1">Chất liệu:</label>
            <input
              type="text"
              value={formMaterial}
              onChange={(e) => setFormMaterial(e.target.value)}
              placeholder="Lụa, gấm, sa, dạ..."
              className="w-full px-2 py-1 bg-white border border-[#DDD6CA] rounded text-[11px] focus:outline-none focus:border-[#9E2A2B]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E2D8]">
          <button
            type="button"
            onClick={() => setActiveAddCategory(null)}
            className="px-3 py-1.5 text-xs text-[#57534E] hover:text-[#1A1918] hover:bg-[#EDE8DF] rounded-md transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => handleSaveNewCostume(categoryMeta.key, false)}
            className="px-3 py-1.5 text-xs font-semibold text-[#1A1918] bg-white border border-[#DDD6CA] hover:bg-[#F2EFE9] rounded-md transition-colors cursor-pointer"
          >
            Lưu Vào Danh Mục
          </button>

          <button
            type="button"
            onClick={() => handleSaveNewCostume(categoryMeta.key, true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Lưu & Phối Đồ Ngay</span>
          </button>
        </div>
      </div>
    );
  };

  // Render costume card in right sidebar with clear color annotation
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
    const isEditingColor = editingColorItemId === item.id;
    const allImages = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
    const displayColorLabel = item.colorLabel || getVietnameseColorName(displayColor);

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

              {/* CHÚ THÍCH MÀU SẮC CỦA TRANG PHỤC TRONG DANH MỤC */}
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF8F5] border border-[#E7E2D8] text-[#1A1918]">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: displayColor }}
                  />
                  <span>Màu: <strong className="text-[#9E2A2B]">{displayColorLabel}</strong></span>
                </span>

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

        {/* INLINE COLOR EDITING DRAWER (NẾU ĐANG BẬT CHỈNH SỬA CHÚ THÍCH MÀU) */}
        {isEditingColor ? (
          <div className="p-2.5 bg-[#FAF8F5] border border-[#DDD6CA] rounded-lg space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#1A1918] flex items-center gap-1">
                <Palette className="w-3 h-3 text-[#9E2A2B]" />
                <span>Chỉnh sửa chú thích màu:</span>
              </span>
              <button
                type="button"
                onClick={() => setEditingColorItemId(null)}
                className="text-[10px] text-[#78716C] hover:text-[#1A1918]"
              >
                Đóng
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1 flex-wrap">
              {VIETNAMESE_HERITAGE_COLORS.slice(0, 6).map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    setEditColorHex(preset.hex);
                    setEditColorLabel(preset.name);
                  }}
                  className="w-4 h-4 rounded-full border border-black/20 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                />
              ))}
              <input
                type="color"
                value={editColorHex}
                onChange={(e) => {
                  setEditColorHex(e.target.value);
                  const name = getVietnameseColorName(e.target.value);
                  if (name !== e.target.value) setEditColorLabel(name);
                }}
                className="w-5 h-5 rounded cursor-pointer p-0 border border-[#DDD6CA]"
                title="Tự chọn màu"
              />
            </div>

            {/* Color label text */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editColorLabel}
                onChange={(e) => setEditColorLabel(e.target.value)}
                placeholder="Nhập chú thích màu sắc..."
                className="flex-1 px-2 py-1 text-[11px] bg-white border border-[#DDD6CA] rounded focus:outline-none focus:border-[#9E2A2B]"
              />
              <button
                type="button"
                onClick={() => handleSaveEditedColor(item)}
                className="px-2 py-1 text-[11px] font-bold text-white bg-[#9E2A2B] rounded hover:bg-[#831F20] cursor-pointer"
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          /* Bottom: Color Swatches + Edit Color Annotation button */
          <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between gap-1.5 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-[#78716C] shrink-0">
                Màu ({itemColors.length}):
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEditColor(item);
                }}
                className="text-[10px] text-[#9E2A2B] hover:underline flex items-center gap-0.5 cursor-pointer"
                title="Đổi màu hoặc sửa chú thích màu cho trang phục này"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Đổi / Chú thích</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {itemColors.map((color) => {
                const isColorActive = isSelected && currentColor.toLowerCase() === color.toLowerCase();
                const colorNote = item.colorLabel || getVietnameseColorName(color);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorOptionSelect(categoryKey, item, color, item.colorLabel);
                    }}
                    title={`Chọn màu: ${colorNote} (${color})`}
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
        )}
      </div>
    );
  };

  // Render a full Category Section (with its items + direct inline Add button)
  const renderCategorySection = (
    categoryMeta: CategoryMeta,
    items: CostumeItem[],
    isSelectedAny: boolean,
    onDeselect: () => void,
    onSelectItem: (item: CostumeItem) => void,
    selectedItemId?: string,
    currentColorHex?: string
  ) => {
    const isAdding = activeAddCategory === categoryMeta.key;

    return (
      <div
        key={categoryMeta.key}
        id={`category-section-${categoryMeta.key}`}
        className="space-y-2.5 pt-2 border-t border-[#F2EFE9] first:pt-0 first:border-t-0"
      >
        {/* Category Header Bar with direct "+ Thêm trang phục" button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1918]">
              {categoryMeta.label}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E7E2D8] text-[#57534E]">
              {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSelectedAny && (
              <button
                type="button"
                onClick={onDeselect}
                className="text-[11px] text-[#78716C] hover:text-[#9E2A2B] hover:underline cursor-pointer"
              >
                Bỏ chọn
              </button>
            )}

            {/* DIRECT ADD BUTTON IN THIS CATEGORY */}
            <button
              type="button"
              onClick={() => handleOpenAddForm(categoryMeta.key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                isAdding
                  ? 'bg-[#1A1918] text-white shadow-xs'
                  : 'bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#9E2A2B] border border-[#DDD6CA] shadow-2xs'
              }`}
              title={`Thêm trang phục mới vào danh mục ${categoryMeta.shortLabel}`}
            >
              {isAdding ? (
                <>
                  <X className="w-3 h-3" />
                  <span>Đóng Form</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 text-[#9E2A2B]" />
                  <span>+ Thêm {categoryMeta.shortLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inline Add Form for this category (when expanded) */}
        {isAdding && renderInlineAddForm(categoryMeta)}

        {/* Items List in this category */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5">
            {items.map((item) =>
              renderCostumeCard(
                item,
                categoryMeta.key,
                selectedItemId === item.id,
                currentColorHex || item.heroColor,
                () => onSelectItem(item)
              )
            )}
          </div>
        ) : !isAdding ? (
          /* Empty state for category with direct action */
          <div className="text-center py-4 px-3 bg-[#FAF9F6] rounded-xl border border-dashed border-[#DDD6CA] space-y-1.5">
            <p className="text-[11px] text-[#78716C]">
              Chưa có trang phục nào trong mục <strong>{categoryMeta.shortLabel}</strong>.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAddForm(categoryMeta.key)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9E2A2B] hover:underline cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Bấm vào đây để thêm {categoryMeta.shortLabel} đầu tiên</span>
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1918] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#E9C46A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Studio Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Xưởng May · CHẠM
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Xưởng Phối Trang Phục Di Sản
          </h2>
          <p className="text-xs md:text-sm text-[#57534E] mt-1 max-w-xl">
            Thêm và chọn trang phục trực tiếp trong từng danh mục ở bên phải. Tự chọn màu sắc và chú thích màu để ngắm nhìn từng thành phần hiển thị dạng lướt xuống ở bên trái.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Nút Thêm Trang Phục Vào Xưởng */}
          <button
            onClick={() => {
              const targetCat = activeStreamCategory !== 'all' ? activeStreamCategory : 'ao_ngoai';
              handleOpenAddForm(targetCat);
              const el = document.getElementById(`category-section-${targetCat}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-colors shadow-2xs cursor-pointer"
            title="Thêm trang phục mới trực tiếp vào danh mục xưởng may"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Thêm Trang Phục Mới</span>
          </button>

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
          - Left Column (7 cols): High-fashion vertical scroll viewer showing each part/photo of the costume with clear color annotations
          - Right Column (5 cols): Sticky sidebar keeping category stream and direct costume addition pinned while scrolling
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
                Hiện tại chưa có trang phục nào được chọn trong xưởng. Bạn có thể thêm trang phục trực tiếp vào từng danh mục ở cột bên phải, tự chọn màu sắc và chú thích màu để phối đồ ngay tại đây!
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenAddForm('ao_ngoai');
                    const el = document.getElementById('category-section-ao_ngoai');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Trang Phục Vào Xưởng Ngay</span>
                </button>
              </div>
            </div>
          ) : (
            /* Danh sách các thành phần của bộ trang phục hiển thị theo dạng lướt xuống */
            <div className="space-y-8">
              {galleryItems.map((section) => {
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
                    <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DF] gap-3">
                      <div className="flex items-center gap-2">
                        {section.tagNumber ? (
                          <span className="w-6 h-6 rounded-full bg-[#1A1918] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {section.tagNumber}
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-[#9E2A2B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            •
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

                      {/* CHÚ THÍCH MÀU SẮC ĐẦY ĐỦ Ở CỘT HIỂN THỊ */}
                      <div className="flex items-center gap-2 shrink-0">
                        {section.color && (
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E2D8] rounded-full text-xs font-medium text-[#1A1918]"
                            title={`Mã màu: ${section.color}`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                              style={{ backgroundColor: section.color }}
                            />
                            <span>
                              Màu: <strong className="font-semibold text-[#9E2A2B]">{section.colorLabel || getVietnameseColorName(section.color)}</strong>
                            </span>
                          </div>
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
                              {section.colorLabel && (
                                <span className="text-white/80 border-l border-white/30 pl-1.5">
                                  {section.colorLabel}
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
                          {section.title} ({section.colorLabel})
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
        {/* Gồm: DANH MỤC TRANG PHỤC KÈM MỤC THÊM TRANG PHỤC TRỰC TIẾP */}
        {/* ========================================================== */}
        <div
          ref={categoryContainerRef}
          className="lg:col-span-5 xl:col-span-5 sticky top-20 self-start space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1"
        >
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
              {currentOutfit.lookbookTitle || currentOutfit.fullOutfit?.name || 'Bản Phối CHẠM'}
            </h3>

            <div className="flex items-center justify-between text-xs text-[#78716C] pt-1 border-t border-[#F2EFE9]">
              <span>Tác giả: <strong className="text-[#1A1918]">{currentOutfit.creatorName || 'Người Yêu Di Sản'}</strong></span>
              {currentOutfit.customColorOuterLabel && (
                <span className="text-[11px] font-semibold text-[#9E2A2B]">
                  Sắc màu chủ đạo: {currentOutfit.customColorOuterLabel}
                </span>
              )}
            </div>
          </div>

          {/* MỤC HIỂN THỊ TỪNG DANH MỤC TRANG PHỤC KÈM TÍNH NĂNG THÊM TRỰC TIẾP */}
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9E2A2B]" />
                <h4 className="text-sm font-bold text-[#1A1918]">
                  Danh Mục & Thêm Trang Phục
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

            {/* DANH SÁCH TỪNG DANH MỤC TRANG PHỤC KÈM NÚT THÊM TRANG PHỤC & CHÚ THÍCH MÀU TRỰC TIẾP */}
            <div className="space-y-6 max-h-[520px] overflow-y-auto pr-1">
              {/* 1. BỘ TRANG PHỤC */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'bo_trang_phuc') &&
                renderCategorySection(
                  CATEGORY_LIST[0],
                  fullOutfitOptions,
                  Boolean(currentOutfit.fullOutfit),
                  () => handleRemovePart('fullOutfit'),
                  handleSelectFullOutfit,
                  currentOutfit.fullOutfit?.id,
                  currentOutfit.customColorOuter
                )}

              {/* 2. ÁO TRONG */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'ao_trong') &&
                renderCategorySection(
                  CATEGORY_LIST[1],
                  innerOptions,
                  Boolean(currentOutfit.innerwear),
                  () => handleRemovePart('innerwear'),
                  handleSelectInner,
                  currentOutfit.innerwear?.id,
                  currentOutfit.customColorInner || currentOutfit.innerwear?.heroColor
                )}

              {/* 3. ÁO NGOÀI */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'ao_ngoai') &&
                renderCategorySection(
                  CATEGORY_LIST[2],
                  outerOptions,
                  Boolean(currentOutfit.outerwear),
                  () => handleRemovePart('outerwear'),
                  handleSelectOuter,
                  currentOutfit.outerwear?.id,
                  currentOutfit.customColorOuter
                )}

              {/* 4. THÂN DƯỚI */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'quan_vay') &&
                renderCategorySection(
                  CATEGORY_LIST[3],
                  bottomOptions,
                  Boolean(currentOutfit.bottom),
                  () => handleRemovePart('bottom'),
                  handleSelectBottom,
                  currentOutfit.bottom?.id,
                  currentOutfit.customColorBottom
                )}

              {/* 5. GIÀY DÉP */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'giay_dep') &&
                renderCategorySection(
                  CATEGORY_LIST[4],
                  footwearOptions,
                  Boolean(currentOutfit.footwear),
                  () => handleRemovePart('footwear'),
                  handleSelectFootwear,
                  currentOutfit.footwear?.id,
                  currentOutfit.customColorFootwear || currentOutfit.footwear?.heroColor
                )}

              {/* 6. PHỤ KIỆN */}
              {(activeStreamCategory === 'all' || activeStreamCategory === 'phu_kien') &&
                renderCategorySection(
                  CATEGORY_LIST[5],
                  accessoryOptions,
                  Boolean(currentOutfit.accessory),
                  () => handleRemovePart('accessory'),
                  handleSelectAccessory,
                  currentOutfit.accessory?.id,
                  currentOutfit.customColorAccessory
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
