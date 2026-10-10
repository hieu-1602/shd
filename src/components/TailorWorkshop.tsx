import React, { useState } from 'react';
import {
  CostumeItem,
  CostumeCategory,
  CustomOutfit,
  VIETNAMESE_HERITAGE_COLORS,
  getVietnameseColorName,
  getCategoryOrderIndex,
} from '../types/vietphuc';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Scissors,
  Check,
  Upload,
  Palette,
  ArrowRight,
  CheckCircle2,
  Trash2,
  User,
  Plus,
  Shirt,
  Tag,
  BookOpen,
} from 'lucide-react';

interface TailorWorkshopProps {
  onSaveOutfit: (newOutfit: CustomOutfit) => void;
  onFinishAndShowcase: (createdOutfit?: CustomOutfit) => void;
}

interface CategoryOption {
  key: CostumeCategory;
  label: string;
  shortLabel: string;
  description: string;
  stepNumber?: number;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    key: 'bo_trang_phuc',
    stepNumber: 1,
    label: '1. BỘ TRANG PHỤC',
    shortLabel: 'Bộ Trang Phục',
    description: 'Trọn bộ trang phục toàn thân liền mạch',
  },
  {
    key: 'ao_ngoai',
    stepNumber: 2,
    label: '2. ÁO CHÍNH (MẶT TRƯỚC)',
    shortLabel: 'Áo Chính (Mặt Trước)',
    description: 'Lớp áo chính mặt trước tôn vinh khí chất cổ phục',
  },
  {
    key: 'ao_ngoai_sau',
    stepNumber: 3,
    label: '3. ÁO CHÍNH (MẶT SAU)',
    shortLabel: 'Áo Chính (Mặt Sau)',
    description: 'Lưng áo và nếp vải mặt sau thanh thoát',
  },
  {
    key: 'ao_trong',
    stepNumber: 4,
    label: '4. ÁO PHỤ',
    shortLabel: 'Áo Phụ',
    description: 'Áo lót trong, áo yếm hoặc lớp áo phụ nền nã',
  },
  {
    key: 'quan_vay',
    stepNumber: 5,
    label: '5. THÂN DƯỚI',
    shortLabel: 'Thân Dưới',
    description: 'Quần lụa, chân váy đụp, quần ống rộng',
  },
  {
    key: 'giay_dep',
    stepNumber: 6,
    label: '6. GIÀY DÉP',
    shortLabel: 'Giày Dép',
    description: 'Hài thêu, guốc mộc truyền thống hoặc giày phối tân thời',
  },
  {
    key: 'phu_kien',
    stepNumber: 7,
    label: '7. PHỤ KIỆN',
    shortLabel: 'Phụ Kiện',
    description: 'Khăn vấn, kiềng bạc, nón ba tầm, quạt trầm hương',
  },
];


interface CategoryDraft {
  name: string;
  creatorName: string;
  color: string;
  colorLabel: string;
  imageUrls: string[];
  imageUrlInput: string;
  gender: 'Nam' | 'Nữ';
  era: string;
  region: string;
  material: string;
  culturalMeaning: string;
  culturalAdvisory: string;
  remixTips: string;
}

const getDefaultCategoryDraft = (cat: CostumeCategory): CategoryDraft => {
  switch (cat) {
    case 'bo_trang_phuc':
      return {
        name: '',
        creatorName: '',
        color: '#9E2A2B',
        colorLabel: 'Đỏ son',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Triều Nguyễn',
        region: 'Cố đô Huế',
        material: 'Lụa tơ tằm, gấm truyền thống',
        culturalMeaning: 'Trọn bộ trang phục cổ truyền hoàn chỉnh tôn vinh vẻ đẹp di sản dân tộc.',
        culturalAdvisory: 'Giữ phom dáng thanh thoát, đứng áo và chỉn chu.',
        remixTips: 'Phối hợp hài hòa cùng các lớp trang phục trong phòng trưng bày.',
      };
    case 'ao_trong':
      return {
        name: '',
        creatorName: '',
        color: '#F4F1DE',
        colorLabel: 'Trắng ngà',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Triều Nguyễn',
        region: 'Toàn quốc',
        material: 'Lụa tơ tằm, vải sa hoặc đũi thoáng mát',
        culturalMeaning: 'Lớp áo lót trong giữ sự kín đáo, trang nhã và tôn trọng nét thuần phong mỹ tục.',
        culturalAdvisory: 'Mặc kín đáo, giữ sạch sẽ bảo vệ lớp áo ngoài.',
        remixTips: 'Mặc lót bên trong áo ngũ thân, áo tấc hoặc phối layer thời thượng.',
      };
    case 'ao_ngoai':
    case 'ao_ngoai_truoc':
      return {
        name: '',
        creatorName: '',
        color: '#9E2A2B',
        colorLabel: 'Đỏ son',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Triều Nguyễn',
        region: 'Cố đô Huế',
        material: 'Lụa tơ tằm truyền thống, gấm vân mây',
        culturalMeaning: 'Thể hiện vẻ đẹp trang nhã, đoan chính và niềm tự hào di sản truyền thống Việt Nam.',
        culturalAdvisory: 'Giữ phom dáng thanh thoát, đứng áo và chỉn chu.',
        remixTips: 'Phối cùng quần lãnh Mỹ A hoặc chân váy, kết hợp phụ kiện đương đại.',
      };
    case 'ao_ngoai_sau':
      return {
        name: '',
        creatorName: '',
        color: '#9E2A2B',
        colorLabel: 'Đỏ son',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Triều Nguyễn',
        region: 'Cố đô Huế',
        material: 'Lụa tơ tằm truyền thống, gấm vân mây',
        culturalMeaning: 'Mặt sau áo ngoài thể hiện sống áo ngay thẳng, nếp vải buông suông trang nghiêm và thanh thoát.',
        culturalAdvisory: 'Giữ phom lưng áo phẳng phiu, sống áo thẳng thớm.',
        remixTips: 'Đồng điệu màu sắc và chất liệu cùng mặt trước của áo ngoài.',
      };
    case 'quan_vay':
      return {
        name: '',
        creatorName: '',
        color: '#1A1A1A',
        colorLabel: 'Đen tuyền / Lãnh Mỹ A',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Triều Nguyễn',
        region: 'Nam Bộ / Bắc Bộ',
        material: 'Lụa lãnh Mỹ A, lụa Hà Đông dệt thủ công',
        culturalMeaning: 'Thân dưới suông rộng thoải mái, tượng trưng cho sự mềm mại, nền nã.',
        culturalAdvisory: 'Độ dài chạm mắt cá chân, ống quần thẳng tắp trang nhã.',
        remixTips: 'Ống suông phóng khoáng dễ dàng phối với giày sneaker trắng hoặc guốc mộc.',
      };
    case 'giay_dep':
      return {
        name: '',
        creatorName: '',
        color: '#1A1A1A',
        colorLabel: 'Đen tuyền',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Cảm hứng di sản Việt Nam',
        region: 'Việt Nam',
        material: 'Hài thêu nhung, guốc mộc truyền thống hoặc da thủ công',
        culturalMeaning: 'Bước đi khoan thai, vững vàng và thanh nhã của người xưa.',
        culturalAdvisory: 'Chọn phom dáng êm ái, màu sắc ăn nhập với tổng thể trang phục.',
        remixTips: 'Có thể linh hoạt dùng hài thêu cổ truyền hoặc giày modern minimalist.',
      };
    case 'phu_kien':
      return {
        name: '',
        creatorName: '',
        color: '#D4AF37',
        colorLabel: 'Vàng hoàng yến / Kim',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Cảm hứng di sản Việt Nam',
        region: 'Việt Nam',
        material: 'Bạc chạm khắc, lụa vấn, ngọc bích, quạt trầm hương',
        culturalMeaning: 'Điểm xuyết vẻ tinh tế, quý phái và cốt cách người mặc.',
        culturalAdvisory: 'Phối tiết chế tinh tế, tránh rườm rà làm lu mờ trang phục chính.',
        remixTips: 'Túi tote lụa, kính retro hoặc khăn vấn tạo điểm nhấn di sản.',
      };
    default:
      return {
        name: '',
        creatorName: '',
        color: '#9E2A2B',
        colorLabel: 'Đỏ son',
        imageUrls: [],
        imageUrlInput: '',
        gender: 'Nam',
        era: 'Triều Nguyễn',
        region: 'Cố đô Huế',
        material: 'Lụa tơ tằm truyền thống, gấm vân mây',
        culturalMeaning: 'Thể hiện vẻ đẹp trang nhã, đoan chính và niềm tự hào di sản truyền thống Việt Nam.',
        culturalAdvisory: 'Giữ phom dáng thanh thoát, đứng áo và chỉn chu.',
        remixTips: 'Phối hợp hài hòa cùng các lớp trang phục trong phòng trưng bày.',
      };
  }
};

export const TailorWorkshop: React.FC<TailorWorkshopProps> = ({
  onSaveOutfit,
  onFinishAndShowcase,
}) => {
  // Trạng thái của cả Bộ Trang Phục đang may đo (Mỗi lần vào Xưởng May là tạo một bộ riêng lẻ!)
  const [outfitName, setOutfitName] = useState('');
  const [outfitCreator, setOutfitCreator] = useState('');
  const [outfitGender, setOutfitGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [outfitIntro, setOutfitIntro] = useState('');

  // Danh sách các thành phần đã được thêm vào bộ trang phục này
  const [outfitComponents, setOutfitComponents] = useState<CostumeItem[]>([]);

  // Active Category State: Mặc định là Áo Ngoài
  const [activeCategory, setActiveCategory] = useState<CostumeCategory>('ao_ngoai');

  // ĐỒNG BỘ PHÂN LUỒNG: Mỗi danh mục có trạng thái form riêng biệt hoàn toàn!
  // Khi chuyển sang danh mục khác, form và ô xem trước sẽ chỉ thuộc về danh mục đó,
  // không hề hiển thị lại thông tin hoặc ảnh của danh mục vừa thêm trước đó!
  const [drafts, setDrafts] = useState<Record<CostumeCategory, CategoryDraft>>(() => ({
    bo_trang_phuc: getDefaultCategoryDraft('bo_trang_phuc'),
    ao_ngoai: getDefaultCategoryDraft('ao_ngoai'),
    ao_ngoai_truoc: getDefaultCategoryDraft('ao_ngoai'),
    ao_ngoai_sau: getDefaultCategoryDraft('ao_ngoai_sau'),
    ao_trong: getDefaultCategoryDraft('ao_trong'),
    quan_vay: getDefaultCategoryDraft('quan_vay'),
    giay_dep: getDefaultCategoryDraft('giay_dep'),
    phu_kien: getDefaultCategoryDraft('phu_kien'),
  }));

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper truy xuất và cập nhật draft của danh mục đang chọn
  const currentDraft = drafts[activeCategory];

  const updateCurrentDraft = (partial: Partial<CategoryDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        ...partial,
      },
    }));
  };

  // Chuyển đổi sang danh mục khác: Luồng dữ liệu hoàn toàn độc lập
  const handleSelectCategory = (catKey: CostumeCategory) => {
    setActiveCategory(catKey);
  };

  // Handle Image File Upload (Auto-compress to prevent LocalStorage Quota Exceeded)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      for (const file of fileList) {
        try {
          const compressed = await compressImageFile(file, 900, 0.8);
          if (compressed) {
            updateCurrentDraft({
              imageUrls: [...currentDraft.imageUrls, compressed],
            });
          }
        } catch {
          // Fallback to basic reader if canvas fails
          const reader = new FileReader();
          reader.onloadend = () => {
            const res = reader.result as string;
            if (res) {
              updateCurrentDraft({
                imageUrls: [...currentDraft.imageUrls, res],
              });
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleAddImageUrlInput = () => {
    if (currentDraft.imageUrlInput.trim()) {
      updateCurrentDraft({
        imageUrls: [...currentDraft.imageUrls, currentDraft.imageUrlInput.trim()],
        imageUrlInput: '',
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    updateCurrentDraft({
      imageUrls: currentDraft.imageUrls.filter((_, idx) => idx !== index),
    });
  };

  // Tạo đối tượng CostumeItem từ draft của bất kỳ danh mục nào
  const buildCostumeItemFromDraft = (catKey: CostumeCategory, draft: CategoryDraft): CostumeItem | null => {
    const catInfo = CATEGORY_OPTIONS.find((c) => c.key === catKey);
    // Tự động dùng chung tên của bộ trang phục đã thêm ở phần 1 (Thông tin chung)
    const effectiveName =
      outfitName.trim() ||
      (catInfo ? `Trang phục ${catInfo.shortLabel}` : 'Trang phục di sản');

    if (!effectiveName) return null;

    const resolvedColorLabel = draft.colorLabel.trim() || getVietnameseColorName(draft.color);
    const resolvedCreator = (outfitCreator.trim() || draft.creatorName.trim()) || 'Người Yêu Di Sản';

    return {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: effectiveName,
      category: catKey,
      era: draft.era.trim() || 'Cảm hứng di sản Việt Nam',
      region: draft.region.trim() || 'Việt Nam',
      gender: outfitGender,
      heroColor: draft.color,
      colorLabel: resolvedColorLabel,
      availableColors: [draft.color],
      material: draft.material.trim() || 'Lụa truyền thống',
      originStory: `Trang phục ${effectiveName} thuộc danh mục ${catInfo?.shortLabel}, mang sắc ${resolvedColorLabel}, sáng tạo bởi ${resolvedCreator}.`,
      culturalMeaning: draft.culturalMeaning.trim() || 'Thể hiện nét đẹp đoan trang, khí chất và niềm tự hào văn hóa Việt.',
      remixTips: draft.remixTips.trim() || 'Phối cùng phong cách đương đại văn minh, tôn vinh dáng vẻ di sản.',
      culturalAdvisory: draft.culturalAdvisory.trim() || 'Giữ nguyên nét đẹp nguyên bản, phom dáng thanh thoát và chỉn chu.',
      imageUrl: draft.imageUrls[0] || undefined,
      imageUrls: draft.imageUrls.length > 0 ? draft.imageUrls : undefined,
      suitableOccasions: ['Dạo Phố & Cafe', 'Lễ Tốt Nghiệp', 'Tiệc Cưới & Dự Lễ', 'Chụp Ảnh Kỷ Yếu'],
      isCustom: true,
      creatorName: outfitCreator.trim() || draft.creatorName.trim() || undefined,
    };
  };

  const buildCurrentCostumeItem = (): CostumeItem | null => {
    return buildCostumeItemFromDraft(activeCategory, currentDraft);
  };

  // NÚT: "Thêm Thành Phần Này Vào Bộ Trang Phục"
  // Gom món này vào danh sách thành phần của riêng bộ trang phục này!
  const handleSaveToCurrentOutfit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!outfitName.trim()) {
      alert(`Vui lòng nhập tên bộ trang phục ở mục 1 (Thông tin chung) trước khi lưu thành phần!`);
      return;
    }

    const newItem = buildCurrentCostumeItem();
    if (!newItem) return;

    setOutfitComponents((prev) => {
      const next = [newItem, ...prev.filter((c) => c.id !== newItem.id)];
      return next.sort((a, b) => getCategoryOrderIndex(a.category) - getCategoryOrderIndex(b.category));
    });

    // Reset draft của riêng danh mục này về form mới tinh
    setDrafts((prev) => ({
      ...prev,
      [activeCategory]: getDefaultCategoryDraft(activeCategory),
    }));

    showNotification(`Đã thêm thành phần "${selectedCatInfo?.shortLabel || newItem.name}" vào bộ trang phục!`);
  };

  // Xóa một thành phần đã thêm khỏi bộ đang tạo
  const handleRemoveComponent = (itemId: string) => {
    setOutfitComponents((prev) => prev.filter((item) => item.id !== itemId));
    showNotification('Đã gỡ thành phần khỏi bộ trang phục.');
  };

  // NÚT: "Xong · Chuyển Sang Trưng Bày"
  // Đóng gói toàn bộ thành một BỘ TRANG PHỤC RIÊNG BIỆT với các thành phần riêng của nó!
  const handleFinish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let allComponents = [...outfitComponents];

    // Gom TẤT CẢ các danh mục có ảnh đã tải lên từ bất kỳ mục nào (không chỉ riêng tab đang mở)
    CATEGORY_OPTIONS.forEach((catOpt) => {
      const d = drafts[catOpt.key];
      if (d && d.imageUrls && d.imageUrls.length > 0) {
        const alreadyExists = allComponents.some(
          (c) => c.category === catOpt.key || (catOpt.key === 'ao_ngoai' && c.category === 'ao_ngoai_truoc')
        );
        if (!alreadyExists) {
          const item = buildCostumeItemFromDraft(catOpt.key, d);
          if (item) {
            allComponents.push(item);
          }
        }
      }
    });

    if (allComponents.length === 0 && !outfitName.trim()) {
      alert('Vui lòng thêm ít nhất một món hoặc thành phần cho bộ trang phục trước khi chuyển sang Trưng Bày!');
      return;
    }

    // Sắp xếp các thành phần chuẩn xác theo thứ tự yêu cầu
    allComponents.sort((a, b) => getCategoryOrderIndex(a.category) - getCategoryOrderIndex(b.category));

    // Xác định tên bộ, ảnh đại diện, màu sắc đại diện
    const finalCreator = outfitCreator.trim() || allComponents[0]?.creatorName || 'Người Yêu Di Sản';
    const finalName =
      outfitName.trim() ||
      (allComponents[0] ? `Bộ Trang Phục ${allComponents[0].name}` : 'Bộ Cổ Phục Mới');

    // Tìm ảnh đại diện chính (ưu tiên ảnh từ cả bộ hoặc món có ảnh đầu tiên)
    const primaryImgItem =
      allComponents.find((c) => c.category === 'bo_trang_phuc' && c.imageUrl) ||
      allComponents.find((c) => c.imageUrl);
    const primaryImageUrl = primaryImgItem?.imageUrl;

    const allImages: string[] = [];
    allComponents.forEach((c) => {
      if (c.imageUrls) allImages.push(...c.imageUrls);
      else if (c.imageUrl) allImages.push(c.imageUrl);
    });

    const primaryColorItem =
      allComponents.find((c) => c.category === 'ao_ngoai' || c.category === 'ao_ngoai_truoc') ||
      allComponents.find((c) => c.category === 'bo_trang_phuc') ||
      allComponents[0];

    const newOutfit: CustomOutfit = {
      id: `outfit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: finalName,
      creatorName: finalCreator,
      gender: outfitGender,
      createdAt: Date.now(),
      imageUrl: primaryImageUrl,
      imageUrls: allImages.length > 0 ? Array.from(new Set(allImages)) : undefined,
      heroColor: primaryColorItem?.heroColor || '#9E2A2B',
      colorLabel: primaryColorItem?.colorLabel || getVietnameseColorName(primaryColorItem?.heroColor),
      introduction: outfitIntro.trim() || undefined,
      components: allComponents,
    };

    onSaveOutfit(newOutfit);

    // Reset workshop form hoàn toàn để lần sau người dùng có thể tạo một bộ trang phục riêng biệt mới
    setOutfitName('');
    setOutfitCreator('');
    setOutfitIntro('');
    setOutfitComponents([]);
    setDrafts({
      bo_trang_phuc: getDefaultCategoryDraft('bo_trang_phuc'),
      ao_ngoai: getDefaultCategoryDraft('ao_ngoai'),
      ao_ngoai_truoc: getDefaultCategoryDraft('ao_ngoai'),
      ao_ngoai_sau: getDefaultCategoryDraft('ao_ngoai_sau'),
      ao_trong: getDefaultCategoryDraft('ao_trong'),
      quan_vay: getDefaultCategoryDraft('quan_vay'),
      giay_dep: getDefaultCategoryDraft('giay_dep'),
      phu_kien: getDefaultCategoryDraft('phu_kien'),
    });

    onFinishAndShowcase(newOutfit);
  };

  const selectedCatInfo = CATEGORY_OPTIONS.find((c) => c.key === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1918] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#E9C46A]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Workshop Header & Top Navigation CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            <Scissors className="w-3.5 h-3.5" />
            <span>Xưởng May Đo Di Sản · Tạo Bộ Trang Phục</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Xưởng May & Thêm Trang Phục
          </h2>
          <p className="text-sm text-[#57534E] mt-1.5 max-w-2xl">
            Mỗi lần may đo tại đây sẽ tạo thành <strong>một bộ trang phục riêng lẻ</strong> gồm đầy đủ các thành phần riêng của bộ đó. Khi hoàn tất, bộ trang phục sẽ được đưa thẳng sang trang <strong>Trưng Bày</strong> để ngắm nhìn chi tiết!
          </p>
        </div>

        {/* Nút Xong chuyển sang Trưng Bày */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleFinish}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#9E2A2B] hover:bg-[#7D2223] rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            title="Hoàn tất bộ trang phục này và chuyển ngay sang trang Trưng Bày"
          >
            <span>Xong · Chuyển Sang Trưng Bày</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THÔNG TIN CHUNG CỦA BỘ TRANG PHỤC NÀY */}
      <div className="mt-8 bg-white border border-[#DDD6CA] rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9]">
          <Shirt className="w-4 h-4 text-[#9E2A2B]" />
          <h3 className="text-sm font-bold text-[#1A1918] uppercase tracking-wider">
            1. Thông Tin Chung Của Bộ Trang Phục
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          {/* Tên Bộ Trang Phục */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-[#1A1918] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Tên Bộ Trang Phục *</span>
            </label>
            <input
              type="text"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              placeholder="Ví dụ: Bộ Nhật Bình Hoàng Triều, Bộ Ngũ Thân Dạ Hội..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD6CA] rounded-lg focus:outline-none focus:border-[#9E2A2B] transition-colors"
            />
          </div>

          {/* Tên Tác Giả */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-[#1A1918] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>Tên Tác Giả / Người May *</span>
            </label>
            <input
              type="text"
              value={outfitCreator}
              onChange={(e) => setOutfitCreator(e.target.value)}
              placeholder="Nhập tên tác giả..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD6CA] rounded-lg focus:outline-none focus:border-[#9E2A2B] transition-colors"
            />
          </div>

          {/* Giới Tính */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-[#1A1918]">Phù Hợp Cho</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOutfitGender('Nam')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  outfitGender === 'Nam'
                    ? 'bg-[#1A1918] text-white border-[#1A1918]'
                    : 'bg-white text-[#57534E] border-[#DDD6CA] hover:bg-[#FAF8F5]'
                }`}
              >
                Nam Giới
              </button>
              <button
                type="button"
                onClick={() => setOutfitGender('Nữ')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  outfitGender === 'Nữ'
                    ? 'bg-[#1A1918] text-white border-[#1A1918]'
                    : 'bg-white text-[#57534E] border-[#DDD6CA] hover:bg-[#FAF8F5]'
                }`}
              >
                Nữ Giới
              </button>
            </div>
          </div>

          {/* Cảm Hứng Sáng Tạo & Nét Đẹp Di Sản */}
          <div className="md:col-span-12 space-y-2 mt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-[#1A1918] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#9E2A2B]" />
                <span className="uppercase tracking-wider">Cảm Hứng Sáng Tạo & Nét Đẹp Di Sản</span>
              </label>
            </div>
            <textarea
              rows={8}
              value={outfitIntro}
              onChange={(e) => setOutfitIntro(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const val = target.value;
                  const tabStr = '    ';
                  const nextVal = val.substring(0, start) + tabStr + val.substring(end);
                  setOutfitIntro(nextVal);
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + tabStr.length;
                  }, 0);
                }
              }}
              placeholder="Nhập toàn bộ câu chuyện lịch sử, ý niệm sáng tạo, triết lý may đo và nét đẹp di sản của bộ trang phục này..."
              className="w-full p-4 text-xs md:text-sm text-[#1A1918] bg-[#FDFCFB] border border-[#DDD6CA] rounded-xl focus:outline-none focus:border-[#9E2A2B] focus:ring-2 focus:ring-[#9E2A2B]/20 transition-all leading-relaxed font-sans resize-y min-h-[180px] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* BƯỚC 2: CÁC THÀNH PHẦN RIÊNG CỦA BỘ TRANG PHỤC NÀY */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1A1918] uppercase tracking-wider">
              2. Thêm Từng Thành Phần Cho Bộ Trang Phục Này
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Chọn danh mục theo chiều ngang bên dưới: Bộ trang phục ➔ Áo chính (mặt trước) ➔ Áo chính (mặt sau) ➔ Áo phụ ➔ Thân dưới ➔ Giày dép ➔ Phụ kiện.
            </p>
          </div>
          {outfitComponents.length > 0 && (
            <span className="text-xs font-semibold bg-[#FAF8F5] text-[#9E2A2B] border border-[#DDD6CA] px-3 py-1 rounded-full">
              Đã có {outfitComponents.length} thành phần trong bộ này
            </span>
          )}
        </div>

        {/* Danh Mục Tabs theo chiều ngang: bộ trang phục -> áo chính (mặt trước) -> áo chính (mặt sau) -> áo phụ -> thân dưới -> giày dép -> phụ kiện */}
        <div className="flex flex-row overflow-x-auto gap-2.5 pb-2 pt-1 scrollbar-thin">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = activeCategory === cat.key;
            const countInOutfit = outfitComponents.filter((c) => c.category === cat.key).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleSelectCategory(cat.key)}
                className={`min-w-[150px] flex-1 shrink-0 flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#1A1918] text-white border-[#1A1918] shadow-sm'
                    : 'bg-white text-[#1A1918] border-[#DDD6CA] hover:border-[#9E2A2B] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-[#E9C46A]' : 'text-[#9E2A2B]'
                    }`}
                  >
                    {cat.shortLabel}
                  </span>
                  {countInOutfit > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white text-[#1A1918]' : 'bg-[#9E2A2B] text-white'
                      }`}
                    >
                      {countInOutfit}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium truncate w-full ${
                    isSelected ? 'text-white/80' : 'text-[#78716C]'
                  }`}
                >
                  {cat.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KHU VỰC FORM NHẬP LIỆU & XEM TRƯỚC (CỘT TRÁI: FORM, CỘT PHẢI: XEM TRƯỚC & DANH SÁCH THÀNH PHẦN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* CỘT TRÁI: Form Chi Tiết Của Danh Mục Đang Chọn */}
        <div className="lg:col-span-7 bg-white border border-[#DDD6CA] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2EFE9] flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold text-[#9E2A2B] uppercase tracking-wider">
                Đang may đo thành phần
              </span>
              <h3 className="text-lg font-bold text-[#1A1918]">{selectedCatInfo?.label}</h3>
            </div>
            {outfitName.trim() ? (
              <span className="text-xs font-medium text-[#2A9D8F] bg-[#FAF8F5] border border-[#DDD6CA] px-3 py-1 rounded-full">
                Sử dụng chung tên: &quot;{outfitName.trim()}&quot;
              </span>
            ) : (
              <span className="text-xs font-medium text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-full">
                Chưa nhập tên bộ ở mục 1
              </span>
            )}
          </div>

          {/* CHỌN MÀU SẮC CHỦ ĐẠO & CHÚ THÍCH MÀU SẮC - HOÀN TOÀN KHÔNG CÓ MÃ MÀU HEX */}
          <div className="space-y-3 pt-2 border-t border-[#F2EFE9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A1918] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span>Màu Sắc Chủ Đạo</span>
              </label>
              <span className="text-xs text-[#57534E] font-medium">
                {currentDraft.colorLabel || getVietnameseColorName(currentDraft.color)}
              </span>
            </div>

            {/* Bảng màu di sản Việt Nam (Chỉ hiển thị tên màu tiếng Việt khi hover/active) */}
            <div className="flex flex-wrap gap-2.5">
              {VIETNAMESE_HERITAGE_COLORS.map((item) => {
                const isColorActive = currentDraft.color.toLowerCase() === item.hex.toLowerCase();
                return (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() =>
                      updateCurrentDraft({
                        color: item.hex,
                        colorLabel: item.name,
                      })
                    }
                    className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      isColorActive
                        ? 'border-[#1A1918] bg-[#FAF8F5] shadow-xs'
                        : 'border-[#DDD6CA] hover:border-[#9E2A2B] bg-white'
                    }`}
                    title={item.name}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs font-medium text-[#1A1918]">{item.name}</span>
                    {isColorActive && <Check className="w-3 h-3 text-[#1A1918] ml-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Ô chú thích màu sắc chủ đạo */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-[#57534E]">
                Tên Màu Sắc Chủ Đạo
              </label>
              <input
                type="text"
                value={currentDraft.colorLabel}
                onChange={(e) => updateCurrentDraft({ colorLabel: e.target.value })}
                placeholder="Ví dụ: Đỏ son, Xanh chàm thêu kim tuyến, Vàng hoàng yến..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DDD6CA] rounded-lg focus:outline-none focus:border-[#9E2A2B] transition-colors"
              />
            </div>
          </div>

          {/* HÌNH ẢNH TRANG PHỤC */}
          <div className="space-y-3 pt-2 border-t border-[#F2EFE9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A1918] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span>Hình Ảnh Trang Phục</span>
              </label>
              <span className="text-[11px] text-[#78716C]">
                {currentDraft.imageUrls.length > 0 ? `Đã chọn ${currentDraft.imageUrls.length} ảnh` : 'Chưa có ảnh'}
              </span>
            </div>

            {/* Nút Upload từ máy */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#DDD6CA] hover:border-[#9E2A2B] rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE9] text-xs font-semibold text-[#1A1918] cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#9E2A2B]" />
                <span>Tải ảnh từ thiết bị</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Dán link URL ảnh */}
              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  value={currentDraft.imageUrlInput}
                  onChange={(e) => updateCurrentDraft({ imageUrlInput: e.target.value })}
                  placeholder="Hoặc dán URL ảnh trực tiếp..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-lg focus:outline-none focus:border-[#9E2A2B] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrlInput}
                  disabled={!currentDraft.imageUrlInput.trim()}
                  className="px-3 py-2 text-xs font-semibold bg-[#1A1918] hover:bg-[#9E2A2B] text-white rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Danh sách ảnh đã thêm */}
            {currentDraft.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {currentDraft.imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group w-16 h-16 rounded-lg overflow-hidden border border-[#DDD6CA] bg-transparent flex items-center justify-center"
                  >
                    <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CHẤT LIỆU */}
          <div className="pt-2 border-t border-[#F2EFE9]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1918]">Chất liệu vải</label>
              <input
                type="text"
                value={currentDraft.material}
                onChange={(e) => updateCurrentDraft({ material: e.target.value })}
                placeholder="Ví dụ: Lụa tơ tằm Hà Đông, Gấm vân mây..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-lg focus:outline-none focus:border-[#9E2A2B] transition-colors"
              />
            </div>
          </div>

          {/* NÚT THÊM THÀNH PHẦN NÀY VÀO BỘ TRANG PHỤC */}
          <div className="pt-4 border-t border-[#EAE6DF] flex items-center justify-between gap-4">
            <span className="text-xs text-[#78716C]">
              Lưu món này vào danh sách thành phần của bộ đang tạo
            </span>
            <button
              type="button"
              onClick={handleSaveToCurrentOutfit}
              disabled={!outfitName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-lg transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Món Này Vào Bộ Trang Phục</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: XEM TRƯỚC VÀ DANH SÁCH CÁC THÀNH PHẦN ĐÃ CÓ TRONG BỘ */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. XEM TRƯỚC MÓN ĐANG NHẬP */}
          <div className="bg-white border border-[#DDD6CA] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
              <span className="text-xs font-bold text-[#1A1918] uppercase tracking-wider">
                Xem Trước Món Đang Nhập
              </span>
              <span className="text-[11px] font-semibold text-[#9E2A2B] bg-[#FAF8F5] border border-[#DDD6CA] px-2 py-0.5 rounded-full">
                {selectedCatInfo?.shortLabel}
              </span>
            </div>

            <div className="mt-4">
              {/* KHUNG HÌNH ẢNH */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-transparent border border-[#EAE6DF] flex items-center justify-center">
                {currentDraft.imageUrls.length > 0 ? (
                  <img
                    src={currentDraft.imageUrls[0]}
                    alt={outfitName.trim() || 'Xem trước trang phục'}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div
                      className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: currentDraft.color }}
                    >
                      <Scissors className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[#78716C]">
                      Chưa tải ảnh lên. Hãy nhấn &quot;Tải ảnh từ thiết bị&quot; để bổ sung hình ảnh thực tế của trang phục.
                    </p>
                  </div>
                )}

                {/* Chú thích màu sắc tiếng Việt thuần túy */}
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#1A1918] shadow-xs flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: currentDraft.color }}
                  />
                  <span>{currentDraft.colorLabel || getVietnameseColorName(currentDraft.color)}</span>
                </div>
              </div>

              {/* Thông tin mô tả bên dưới xem trước */}
              <div className="mt-3 space-y-1">
                <h4 className="text-base font-bold text-[#1A1918]">
                  {outfitName.trim() ? `${outfitName.trim()} · ${selectedCatInfo?.shortLabel}` : (selectedCatInfo?.shortLabel || 'Thành phần trang phục')}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#78716C] flex-wrap">
                  {(outfitCreator.trim() || currentDraft.creatorName.trim()) && (
                    <span>
                      Tác giả: <strong className="text-[#1A1918]">{outfitCreator.trim() || currentDraft.creatorName.trim()}</strong>
                    </span>
                  )}
                  <span>·</span>
                  <span>Chất liệu: {currentDraft.material || 'Lụa truyền thống'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CÁC THÀNH PHẦN ĐÃ THÊM VÀO BỘ TRANG PHỤC NÀY */}
          <div className="bg-white border border-[#DDD6CA] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
              <span className="text-xs font-bold text-[#1A1918] uppercase tracking-wider flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span>Các Thành Phần Đã Thuộc Về Bộ Này: {outfitComponents.length} món</span>
              </span>
            </div>

            {outfitComponents.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#78716C] space-y-1.5">
                <p>Chưa có thành phần nào được lưu vào bộ này.</p>
                <p className="text-[11px] text-[#A8A29E]">
                  Hãy điền thông tin món đồ bên trái rồi nhấn &quot;Thêm Món Này Vào Bộ Trang Phục&quot;.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {outfitComponents.map((item) => {
                  const catMeta = CATEGORY_OPTIONS.find((c) => c.key === item.category);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] hover:bg-[#F2EFE9] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-contain p-0.5 border border-[#DDD6CA] shrink-0 bg-transparent"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg border border-black/10 shrink-0 flex items-center justify-center text-white"
                            style={{ backgroundColor: item.heroColor }}
                          >
                            <Shirt className="w-5 h-5 opacity-90" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E2A2B] bg-white px-1.5 py-0.5 rounded border border-[#DDD6CA]">
                              {catMeta?.shortLabel || item.category}
                            </span>
                            <span className="text-xs font-bold text-[#1A1918] truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#78716C] mt-0.5">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full border border-black/20"
                                style={{ backgroundColor: item.heroColor }}
                              />
                              <span>{item.colorLabel || getVietnameseColorName(item.heroColor)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveComponent(item.id)}
                        className="p-1.5 text-[#78716C] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
                        title="Gỡ thành phần này khỏi bộ trang phục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Nút Xong chuyển sang Trưng Bày lớn ở đáy cột */}
            <div className="mt-5 pt-4 border-t border-[#F2EFE9]">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 px-4 text-sm font-bold text-white bg-[#9E2A2B] hover:bg-[#7D2223] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Xong · Hoàn Tất Bộ Này & Chuyển Sang Trưng Bày</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
