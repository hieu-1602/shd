import React, { useState } from 'react';
import { CostumeItem, CostumeCategory, EventOccasion } from '../types/vietphuc';
import {
  X,
  Plus,
  Upload,
  BookOpen,
  FileJson,
  Download,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Sparkles,
  Layers,
  HelpCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  User,
  ShieldAlert,
} from 'lucide-react';

interface NoCodeCMSModalProps {
  costumes: CostumeItem[];
  onAddCostume: (item: CostumeItem) => void;
  onDeleteCostume: (id: string) => void;
  onResetToDefaults: () => void;
  onImportJson: (items: CostumeItem[]) => void;
  onClose: () => void;
  onEquipToStudio?: (item: CostumeItem) => void;
  isAdmin?: boolean;
  onOpenAuthModal?: () => void;
}

export const NoCodeCMSModal: React.FC<NoCodeCMSModalProps> = ({
  costumes,
  onAddCostume,
  onDeleteCostume,
  onResetToDefaults,
  onImportJson,
  onClose,
  onEquipToStudio,
  isAdmin = false,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'guide' | 'manage'>('form');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State - Free-form inputs according to user's new requirements
  const [name, setName] = useState('');
  const [era, setEra] = useState('');
  const [region, setRegion] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [category, setCategory] = useState<CostumeCategory>('ao_ngoai');
  const [material, setMaterial] = useState('');
  const [originStory, setOriginStory] = useState('');
  const [culturalMeaning, setCulturalMeaning] = useState('');
  const [remixTips, setRemixTips] = useState('');
  const [culturalAdvisory, setCulturalAdvisory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle Image File Upload (Convert to Base64, support multiple images)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImageUrls((prev) => [...prev, result]);
          setImageUrl((prev) => prev || result);
          setImagePreview((prev) => prev || result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      if (next.length > 0) {
        setImageUrl(next[0]);
        setImagePreview(next[0]);
      } else {
        setImageUrl('');
        setImagePreview(null);
      }
      return next;
    });
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isAdmin) {
      setErrorMessage('Chỉ tài khoản Admin (Quản trị viên) mới có quyền thêm hình ảnh hoặc thêm trang phục mới! Vui lòng đăng nhập với tài khoản Admin.');
      return;
    }

    if (!name.trim()) return;

    const newItem: CostumeItem = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      category: category,
      era: era.trim() || 'Cảm hứng di sản Việt Nam',
      region: region.trim() || 'Việt Nam',
      gender: gender,
      heroColor: '#9E2A2B', // Màu mặc định trang nhã, không bắt buộc người dùng chọn
      material: material.trim() || 'Chất liệu lụa truyền thống',
      originStory: originStory.trim() || 'Trang phục di sản văn hóa Việt Nam được số hóa và lưu trữ.',
      culturalMeaning: culturalMeaning.trim() || 'Thể hiện nét đẹp đoan trang, khí chất và niềm tự hào văn hóa Việt.',
      remixTips: remixTips.trim() || 'Phối cùng phong cách đương đại văn minh, tôn vinh dáng vẻ di sản.',
      culturalAdvisory: culturalAdvisory.trim() || 'Tuân thủ quy chuẩn cài vạt hữu nhậm (sang phải), giữ nguyên nét đẹp nguyên bản.',
      imageUrl: imageUrl || (imageUrls[0] || undefined),
      imageUrls: imageUrls.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : undefined),
      suitableOccasions: ['Dạo Phố & Cafe', 'Lễ Tốt Nghiệp', 'Chụp Ảnh Kỷ Yếu', 'Tiệc Cưới & Dự Lễ'],
      isCustom: true,
    };

    onAddCostume(newItem);
    setSuccessMessage(`Đã thêm thành công trang phục "${newItem.name}" vào hệ thống!`);
    setTimeout(() => setSuccessMessage(null), 3000);

    // Reset Form
    setName('');
    setEra('');
    setRegion('');
    setGender('Nam');
    setCategory('ao_ngoai');
    setMaterial('');
    setImagePreview(null);
    setImageUrl('');
    setImageUrls([]);
    setOriginStory('');
    setCulturalMeaning('');
    setRemixTips('');
    setCulturalAdvisory('');
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(costumes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'vietphuc_remix_dataset.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON File
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportJson(parsed);
            setSuccessMessage(`Đã nạp thành công ${parsed.length} trang phục từ file JSON!`);
            setTimeout(() => setSuccessMessage(null), 3000);
          } else {
            alert('File JSON không đúng định dạng mảng trang phục!');
          }
        } catch {
          alert('Không thể đọc file JSON, vui lòng kiểm tra cú pháp.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thư Viện Trang Phục Tùy Chỉnh</span>
            </div>
            <h3 className="text-2xl font-normal text-[#1A1918] font-display mt-0.5">
              Thêm & Quản Lý Trang Phục
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-[#EAE6DF] pb-3">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-[#1A1918] text-white shadow-2xs'
                : 'bg-white text-[#57534E] hover:text-[#1A1918] border border-[#DDD6CA]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Mới Bằng Biểu Mẫu (Dễ Nhất)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-[#1A1918] text-white shadow-2xs'
                : 'bg-white text-[#57534E] hover:text-[#1A1918] border border-[#DDD6CA]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hướng Dẫn Cho Người Mới</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-[#1A1918] text-white shadow-2xs'
                : 'bg-white text-[#57534E] hover:text-[#1A1918] border border-[#DDD6CA]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quản Lý & Sao Lưu JSON</span>
          </button>
        </div>

        {/* Admin Protection Banner if not admin */}
        {!isAdmin && (
          <div className="p-3 bg-[#FDF2F2] border border-[#FAD2D2] text-[#831F20] text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#9E2A2B] shrink-0" />
              <span>Chỉ tài khoản Admin mới có quyền thêm hình ảnh hoặc xóa hình ảnh, trang phục.</span>
            </div>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="px-2.5 py-1 bg-[#9E2A2B] text-white rounded text-[11px] font-semibold hover:bg-[#831F20] shrink-0 ml-2 cursor-pointer"
              >
                Đăng Nhập Admin
              </button>
            )}
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 bg-[#FDF2F2] text-[#831F20] border border-[#FAD2D2] rounded-lg text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#9E2A2B]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3 bg-[#EBF3ED] text-[#2D6A4F] border border-[#C3DEC9] rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: FORM THÊM MỚI TRỰC QUAN */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên trang phục */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">
                  Tên Bộ Trang Phục <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Áo Ngũ Thân Lụa Sa Trơn, Áo Tấc Cố Đô Remix, Áo Giao Lĩnh Tân Thời..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>

              {/* Cảm hứng thời đại / Thời kỳ lịch sử */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">
                  Cảm Hứng Thời Đại & Thời Kỳ Lịch Sử
                </label>
                <input
                  type="text"
                  placeholder="Bạn tự do ghi (Ví dụ: Triều Nguyễn thế kỷ 19, Thời Lê - Trịnh, Bắc Bộ đầu thế kỷ 20, Cách tân 2026...)"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>

              {/* Dành Cho Giới Tính: Chọn Nam hoặc Nữ đơn giản */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">
                  Dành Cho Giới Tính <span className="text-[#9E2A2B]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {(['Nam', 'Nữ'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 text-xs font-medium rounded-md border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        gender === g
                          ? 'bg-[#1A1918] text-white border-[#1A1918] shadow-2xs font-semibold'
                          : 'bg-white text-[#57534E] border-[#DDD6CA] hover:border-[#1A1918]'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Thành phần trang phục */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">
                  Thành Phần Trang Phục
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                  {[
                    { id: 'bo_trang_phuc', label: 'Bộ Trang Phục' },
                    { id: 'ao_trong', label: 'Áo (Thân Trên)' },
                    { id: 'ao_ngoai', label: 'Áo Ngoài' },
                    { id: 'quan_vay', label: 'Thân Dưới' },
                    { id: 'giay_dep', label: 'Giày Dép' },
                    { id: 'phu_kien', label: 'Phụ Kiện' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id as CostumeCategory)}
                      className={`py-2 text-xs font-medium rounded-md border transition-all ${
                        category === c.id
                          ? 'bg-[#9E2A2B] text-white border-[#9E2A2B] shadow-2xs font-semibold'
                          : 'bg-white text-[#57534E] border-[#DDD6CA] hover:border-[#1A1918]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vùng miền */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">Vùng Miền</label>
                <input
                  type="text"
                  placeholder="Bạn tự do ghi (Ví dụ: Cố đô Huế, Kinh Bắc, Nam Bộ sông nước, Đồng bằng sông Hồng, Tây Nguyên...)"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>

              {/* Chất liệu chính */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">Chất Liệu Chính</label>
                <input
                  type="text"
                  placeholder="Bạn tự do ghi (Ví dụ: Lụa tơ tằm Vạn Phúc, Gấm hoa mai dệt nổi, Vải Đũi nhuộm củ nâu, Denim dệt thủ công...)"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>
            </div>

            {/* Tải ảnh trang phục trực tiếp (hỗ trợ nhiều ảnh) */}
            <div className="p-4 bg-[#FAF9F6] border border-[#E7E2D8] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1A1918] block">
                  Tải Lên Hình Ảnh Trang Phục (Có thể chọn nhiều ảnh góc độ khác nhau) <span className="text-[#9E2A2B]">*</span>
                </label>
                <span className="text-[11px] text-[#78716C]">
                  {imageUrls.length} ảnh đã chọn
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1A1918] file:text-white hover:file:bg-[#9E2A2B] cursor-pointer transition-colors"
                />
                <span className="text-[11px] text-[#78716C]">
                  Hỗ trợ PNG, JPG, WEBP. Chọn nhiều ảnh để tạo bộ sưu tập chi tiết cho món đồ!
                </span>
              </div>

              {imageUrls.length > 0 && (
                <div className="mt-3 p-3 bg-white border border-[#DDD6CA] rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-[#1A1918] flex items-center justify-between">
                    <span>Danh sách hình ảnh đã thêm ({imageUrls.length} ảnh):</span>
                    <span className="text-[11px] text-[#78716C] font-normal">Ảnh đầu tiên sẽ là ảnh đại diện chính</span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {imageUrls.map((img, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className={`w-20 h-24 object-contain rounded bg-[#FAF9F6] border ${idx === 0 ? 'border-[#9E2A2B] ring-2 ring-[#9E2A2B]/20' : 'border-[#EAE6DF]'}`}
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#9E2A2B] text-white text-[9px] px-1 rounded font-semibold">
                            Chính
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#9E2A2B] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                          title="Xóa ảnh này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cultural Stories & Rules */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">
                  Ý Nghĩa Cấu Trúc & Triết Lý Văn Hóa
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Tượng trưng cho ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín) hoặc biểu tượng của sự kín đáo..."
                  value={culturalMeaning}
                  onChange={(e) => setCulturalMeaning(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2A9D8F]">
                    Gợi Ý Phối Trang Phục Cho Gen Z
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Mặc cùng sneaker trắng, quần tây ống suông hoặc áo khoác lửng..."
                    value={remixTips}
                    onChange={(e) => setRemixTips(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#2A9D8F] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#9E2A2B]">
                    Lưu Ý Chuẩn Mực Văn Hóa (Cần Tránh)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Tuyệt đối không cài cúc sang bên trái; tránh mặc xộc xệch..."
                    value={culturalAdvisory}
                    onChange={(e) => setCulturalAdvisory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD6CA] rounded-md focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-[#EAE6DF] flex flex-wrap items-center justify-end gap-2.5">
              {onEquipToStudio && (
                <button
                  type="button"
                  onClick={() => {
                    if (!name.trim()) {
                      alert('Vui lòng nhập Tên Bộ Trang Phục trước khi mặc thử!');
                      return;
                    }
                    const newItem: CostumeItem = {
                      id: `custom_${Date.now()}`,
                      name: name.trim(),
                      category: category,
                      era: era.trim() || 'Cảm hứng di sản Việt Nam',
                      region: region.trim() || 'Việt Nam',
                      gender: gender,
                      heroColor: '#9E2A2B',
                      material: material.trim() || 'Chất liệu lụa truyền thống',
                      originStory: originStory.trim() || 'Trang phục di sản văn hóa Việt Nam được số hóa và lưu trữ.',
                      culturalMeaning: culturalMeaning.trim() || 'Thể hiện nét đẹp đoan trang, khí chất và niềm tự hào văn hóa Việt.',
                      remixTips: remixTips.trim() || 'Phối cùng phong cách đương đại văn minh, tôn vinh dáng vẻ di sản.',
                      culturalAdvisory: culturalAdvisory.trim() || 'Tuân thủ quy chuẩn cài vạt hữu nhậm (sang phải), giữ nguyên nét đẹp nguyên bản.',
                      imageUrl: imageUrl || (imageUrls[0] || undefined),
                      imageUrls: imageUrls.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : undefined),
                      suitableOccasions: ['Dạo Phố & Cafe', 'Lễ Tốt Nghiệp', 'Chụp Ảnh Kỷ Yếu', 'Tiệc Cưới & Dự Lễ'],
                      isCustom: true,
                    };
                    onAddCostume(newItem);
                    onEquipToStudio(newItem);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#1A1918] to-[#332E2B] hover:bg-[#9E2A2B] rounded-md transition-all shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#E9C46A]" />
                  <span>Lưu & Xem Trang Phục Trực Tiếp</span>
                </button>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#F4A261]" />
                <span>Lưu Trang Phục Vào Thư Viện</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: HƯỚNG DẪN DÀNH CHO NGƯỜI KHÔNG BIẾT CODE */}
        {activeTab === 'guide' && (
          <div className="space-y-6 text-xs md:text-sm text-[#57534E] leading-relaxed animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-5 space-y-3">
              <h4 className="text-base font-bold text-[#1A1918] font-display">
                Bạn Không Biết Lập Trình? Đừng Lo, Mọi Thứ Đều Rất Đơn Giản!
              </h4>
              <p>
                Trang web này được xây dựng trực quan để bất kỳ ai cũng có
                thể tham gia đóng góp trang phục, phụ kiện vào bộ sưu tập mà không cần viết một dòng mã (code) nào. Dưới
                đây là 2 cách bạn có thể thực hiện:
              </p>
            </div>

            {/* HƯỚNG DẪN TẢI ẢNH TRANG PHỤC */}
            <div className="border border-[#E7E2D8] rounded-xl p-5 space-y-2 bg-white shadow-2xs">
              <span className="font-bold text-[#9E2A2B] uppercase text-xs">
                Quy Trình Tải Ảnh Trang Phục Vào Website Rất Đơn Giản
              </span>
              <ol className="list-decimal pl-5 space-y-2.5 mt-2 text-xs">
                <li>
                  <strong>Bước 1:</strong> Chuẩn bị ảnh bộ trang phục hoặc món đồ của bạn trên máy tính hoặc điện thoại (hỗ trợ PNG, JPG, WEBP).
                </li>
                <li>
                  <strong>Bước 2:</strong> Vào tab <strong>"Thêm Mới Bằng Biểu Mẫu"</strong>, điền tên trang phục, chọn giới tính (Nam / Nữ) và thành phần (Áo ngoài, thân trên, thân dưới...).
                </li>
                <li>
                  <strong>Bước 3:</strong> Bấm nút <strong>"Chọn tệp"</strong> tải ảnh lên, rồi nhấn <strong>"Lưu & Xem Trang Phục Trực Tiếp"</strong> để hiển thị trực tiếp ảnh trang phục mà không cần nhân vật ma-nơ-canh!
                </li>
              </ol>
            </div>

            {/* Cách 2 */}
            <div className="border border-[#E7E2D8] rounded-xl p-5 space-y-3 bg-white shadow-2xs">
              <span className="font-bold text-[#1A1918] uppercase text-xs">
                Cách 2: Quản lý hàng loạt bằng tệp dữ liệu JSON (Dành cho nộp bài thi)
              </span>
              <p>
                Nếu bạn cần nhập hàng chục trang phục cùng lúc hoặc muốn nộp toàn bộ dữ liệu cho Ban
                Giám Khảo:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1A1918] bg-[#F1EDE6] hover:bg-[#E7E2D8] rounded-md border border-[#DDD6CA] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#9E2A2B]" />
                  <span>Xuất Tệp JSON Hiện Tại</span>
                </button>

                <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-md cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#F4A261]" />
                  <span>Nhập Tệp JSON Vào Web</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ DANH SÁCH & SAO LƯU */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DF]">
              <span className="text-xs font-semibold text-[#1A1918]">
                Tổng số trang phục trong hệ thống: {costumes.length} món
              </span>

              <button
                onClick={onResetToDefaults}
                className="inline-flex items-center gap-1 text-xs text-[#9E2A2B] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục về dữ liệu ban đầu</span>
              </button>
            </div>

            {/* List items */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {costumes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#EDE8DF] rounded-lg text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: item.heroColor }}
                    />
                    <div>
                      <span className="font-semibold text-[#1A1918]">{item.name}</span>
                      <span className="text-[#78716C] ml-2 text-[11px]">
                        ({item.category} · {item.era})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isCustom && (
                      <span className="text-[10px] bg-[#9E2A2B] text-white px-2 py-0.5 rounded font-semibold">
                        Tự tạo
                      </span>
                    )}

                    {isAdmin ? (
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa "${item.name}"?`)) {
                            onDeleteCostume(item.id);
                          }
                        }}
                        className="p-1 text-[#78716C] hover:text-[#9E2A2B] transition-colors cursor-pointer"
                        title="Xóa trang phục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#A8A29E] italic">Cần quyền Admin để xóa</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
