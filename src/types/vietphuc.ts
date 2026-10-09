export type CostumeCategory = 
  | 'bo_trang_phuc' // Bộ trang phục (Cả bộ đồ)
  | 'ao_trong'  // Áo / Thân trên (bộ phần áo đầu tiên)
  | 'ao_ngoai' // Áo ngoài
  | 'quan_vay'  // Thân dưới (Quần / Váy)
  | 'giay_dep' // Giày dép
  | 'phu_kien'; // Phụ kiện

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
  customColorInner?: string;
  customColorBottom: string;
  customColorAccessory: string;
  customColorFootwear?: string;
  targetOccasion: EventOccasion;
  lookbookTitle: string;
  creatorName: string;
  gender?: 'Nam' | 'Nữ'; // Giới tính nhân vật (Nam: vai rộng; Nữ: hông rộng & vai hẹp hơn)
  backgroundMedia?: BackgroundMedia;
  customImage?: string; // Ảnh trang phục do người dùng tải lên trực tiếp
  fullOutfitImages?: string[]; // Nhiều hình ảnh của cả bộ trang phục
  introduction?: string; // Dòng chữ tự do giới thiệu về trang phục do người gửi viết
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

