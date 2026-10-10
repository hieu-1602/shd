export type CostumeCategory = 
  | 'bo_trang_phuc' // Bộ trang phục
  | 'ao_ngoai' // Áo ngoài (mặt trước)
  | 'ao_ngoai_truoc' // Áo ngoài (mặt trước)
  | 'ao_ngoai_sau' // Áo ngoài (mặt sau)
  | 'ao_trong'  // Áo trong
  | 'quan_vay'  // Thân dưới (Quần / Váy)
  | 'giay_dep' // Giày dép
  | 'phu_kien'; // Phụ kiện

// Thứ tự chuẩn xác theo yêu cầu: bộ trang phục -> áo ngoài (mặt trước) -> áo ngoài (mặt sau) -> áo trong -> thân dưới -> giày dép -> phụ kiện
export const ORDERED_CATEGORIES: CostumeCategory[] = [
  'bo_trang_phuc',
  'ao_ngoai',
  'ao_ngoai_sau',
  'ao_trong',
  'quan_vay',
  'giay_dep',
  'phu_kien',
];

export const CATEGORY_LABELS: Record<CostumeCategory, string> = {
  bo_trang_phuc: 'BỘ TRANG PHỤC',
  ao_ngoai: 'ÁO NGOÀI (MẶT TRƯỚC)',
  ao_ngoai_truoc: 'ÁO NGOÀI (MẶT TRƯỚC)',
  ao_ngoai_sau: 'ÁO NGOÀI (MẶT SAU)',
  ao_trong: 'ÁO TRONG',
  quan_vay: 'THÂN DƯỚI',
  giay_dep: 'GIÀY DÉP',
  phu_kien: 'PHỤ KIỆN',
};

export function getCategoryOrderIndex(cat: CostumeCategory | string): number {
  if (cat === 'bo_trang_phuc') return 0;
  if (cat === 'ao_ngoai' || cat === 'ao_ngoai_truoc') return 1;
  if (cat === 'ao_ngoai_sau') return 2;
  if (cat === 'ao_trong') return 3;
  if (cat === 'quan_vay') return 4;
  if (cat === 'giay_dep') return 5;
  if (cat === 'phu_kien') return 6;
  return 99;
}


export type HistoricalEra = 
  | 'Tất cả'
  | 'Triều Nguyễn (1802 - 1945)'
  | 'Thời Lê - Trịnh (Thế kỷ 17 - 18)'
  | 'Đồng bằng Bắc Bộ xưa'
  | 'Tân thời & Đương đại Gen Z';

export type EventOccasion = 
  | 'Lễ Tốt Nghiệp'
  | 'Dạo Phố & Cafe'
  | 'Tiệc Cưới & Dự Lễ'
  | 'Chụp Ảnh Kỷ Yếu'
  | 'Lễ Hội Truyền Thống / Tết'
  | 'Trình Diễn & Runway';

export interface CostumeItem {
  id: string;
  name: string;
  category: CostumeCategory;
  era: HistoricalEra | string;
  region: string; // e.g. "Cố đô Huế", "Bắc Bộ", "Toàn quốc"
  gender?: 'Nam' | 'Nữ'; // Giới tính phù hợp cho trang phục (Nam / Nữ)
  heroColor: string; // hex
  colorLabel?: string; // Tên / Chú thích màu sắc (ví dụ: "Đỏ son", "Xanh chàm thêu kim tuyến")
  secondaryColor?: string;
  availableColors?: string[]; // Danh sách màu sắc hợp lệ đã được thêm cho thành phần này
  material: string; // e.g. "Lụa tơ tằm Hà Đông", "Gấm vân mây", "Denim dệt thủ công"
  originStory: string; // Câu chuyện lịch sử & nguồn gốc
  culturalMeaning: string; // Ý nghĩa cấu trúc & triết lý
  remixTips: string; // Gợi ý phối Gen Z
  culturalAdvisory: string; // Lưu ý
  imageUrl?: string; // Tải ảnh lên hoặc link ảnh chính
  imageUrls?: string[]; // Danh sách nhiều hình ảnh của món đồ này
  accentPattern?: 'may_song' | 'hoa_sen' | 'chim_hac' | 'chu_nhat' | 'tron_toi_gian';
  suitableOccasions: EventOccasion[];
  isCustom?: boolean; // Được thêm bởi người dùng
  creatorName?: string; // Tên tác giả / người may
}

export interface HeritageColorOption {
  hex: string;
  name: string;
}

export const VIETNAMESE_HERITAGE_COLORS: HeritageColorOption[] = [
  { hex: '#9E2A2B', name: 'Đỏ son' },
  { hex: '#1D3557', name: 'Xanh chàm' },
  { hex: '#D4AF37', name: 'Vàng hoàng yến / Kim' },
  { hex: '#F4F1DE', name: 'Trắng ngà' },
  { hex: '#1A1A1A', name: 'Đen tuyền / Lãnh Mỹ A' },
  { hex: '#2D6A4F', name: 'Xanh rêu / Phỉ thúy' },
  { hex: '#E07A5F', name: 'Hồng cánh sen' },
  { hex: '#6A4C93', name: 'Tím cố đô Huế' },
  { hex: '#457B9D', name: 'Lam ngọc' },
  { hex: '#5C4033', name: 'Nâu sồng' },
];

export function getVietnameseColorName(hex?: string): string {
  if (!hex) return 'Màu truyền thống';
  const match = VIETNAMESE_HERITAGE_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );
  return match ? match.name : 'Màu tự chọn';
}

export interface BackgroundMedia {
  type: 'image' | 'video';
  url: string;
  name?: string;
}

export interface OutfitComposition {
  fullOutfit?: CostumeItem; // Bộ trang phục (hình ảnh của cả bộ đồ)
  outerwear?: CostumeItem;
  innerwear?: CostumeItem;
  bottom?: CostumeItem;
  accessory?: CostumeItem;
  footwear?: CostumeItem;
  customColorOuter: string;
  customColorOuterLabel?: string;
  customColorInner?: string;
  customColorInnerLabel?: string;
  customColorBottom: string;
  customColorBottomLabel?: string;
  customColorAccessory: string;
  customColorAccessoryLabel?: string;
  customColorFootwear?: string;
  customColorFootwearLabel?: string;
  targetOccasion: EventOccasion;
  lookbookTitle: string;
  creatorName: string;
  gender?: 'Nam' | 'Nữ'; // Giới tính nhân vật (Nam: vai rộng; Nữ: hông rộng & vai hẹp hơn)
  backgroundMedia?: BackgroundMedia;
  customImage?: string; // Ảnh trang phục do người dùng tải lên trực tiếp
  fullOutfitImages?: string[]; // Nhiều hình ảnh của cả bộ trang phục
  introduction?: string; // Dòng chữ tự do giới thiệu về trang phục do người gửi viết
}

export interface CustomOutfit {
  id: string;
  name: string; // Tên của cả bộ trang phục
  creatorName?: string; // Tên tác giả
  gender?: 'Nam' | 'Nữ';
  createdAt: number;
  imageUrl?: string; // Hình ảnh đại diện cho bộ
  imageUrls?: string[]; // Danh sách các hình ảnh của bộ
  heroColor?: string; // Tông màu chủ đạo
  colorLabel?: string; // Chú thích màu sắc (tiếng Việt, không mã hex)
  material?: string;
  era?: string;
  region?: string;
  introduction?: string; // Giới thiệu / câu chuyện của bộ
  occasion?: EventOccasion;
  // Các thành phần riêng lẻ của riêng bộ trang phục này:
  components: CostumeItem[];
}

export interface ColorHarmonyResult {
  score: number; // 0 - 100
  title: string;
  assessment: string;
  elementTheory: string; // Thuyết Ngũ Hành / Tương Phản / Pastel
  recommendations: string[];
}

export interface CulturalCheckResult {
  isValid: boolean;
  warnings: string[];
  praises: string[];
  etiquetteTips: string[];
}

export interface LookbookItem {
  id: string;
  title: string;
  occasion: EventOccasion;
  description: string;
  fullOutfitId?: string;
  fullOutfitImage?: string;
  introduction?: string;
  outerId?: string;
  innerId?: string;
  bottomId?: string;
  accessoryId?: string;
  footwearId?: string;
  gender?: 'Nam' | 'Nữ';
  customColorOuter?: string;
  customColorBottom?: string;
  customColorAccessory?: string;
  harmonyScore?: number;
  creatorName?: string;
}

