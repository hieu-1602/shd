import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';

export interface CulturalRule {
  id: string;
  title: string;
  summary: string;
  content: string;
  tag?: string;
}

const STORAGE_KEY_RULES = 'vietphuc_cultural_rules_v3';

const DEFAULT_RULES: CulturalRule[] = [
  {
    id: 'rule_1',
    title: '1. Quy Tắc Vàng: Cài Cúc Sang Bên Phải (Hữu Nhậm)',
    summary: 'Quy chuẩn sinh tử phân minh trong cổ phục của người Việt.',
    content:
      'Tất cả các loại áo cổ truyền Việt Nam (Giao lĩnh, Ngũ thân, Áo tấc, Áo Nhật bình, Áo dài) đều cài cúc hoặc vắt vạt sang bên nách phải (Hữu nhậm - 右衽). Tuyệt đối KHÔNG cài cúc hoặc đè vạt sang bên trái (Tả nhậm), vì theo phong tục ngàn năm, chỉ có y phục người quá cố (đồ khâm liệm/đồ tang) mới cài sang trái. Đây là lỗi sai cấm kỵ hàng đầu mà người trẻ cần nắm vững.',
    tag: 'Bắt Buộc',
  },
  {
    id: 'rule_2',
    title: '2. Phân Biệt Áo Ngũ Thân Tay Chẽn và Áo Tấc',
    summary: 'Hai biến thể cùng một hệ thống nhưng công năng hoàn toàn khác nhau.',
    content:
      'Cả hai đều có cấu trúc 5 thân, 5 cúc cài. Tuy nhiên: Áo Ngũ Thân Tay Chẽn có ống tay áo ôm gọn gàng từ khuỷu tay đến cổ tay, dùng trong đời sống thường nhật, công sở, dạo phố năng động. Ngược lại, Áo Tấc là áo ngũ thân có ống tay thụng rộng, dài bằng hoặc quá đầu ngón tay khi buông xuôi, là thường lễ phục trang trọng dùng trong các dịp cưới hỏi, tế lễ, lễ tốt nghiệp, bái tổ đường.',
    tag: 'Quy Chuẩn Phom Dáng',
  },
  {
    id: 'rule_3',
    title: '3. Áo Nhật Bình: Nét Quý Phái Cung Đình & Hoa Văn Chữ Nhật',
    summary: 'Trang phục triều đình với dải cổ chữ nhật và ngũ sắc đặc trưng.',
    content:
      'Áo Nhật Bình là thường phục của Hoàng hậu, Công chúa và Cung tần triều Nguyễn. Đặc điểm nhận dạng là dải cổ áo hình chữ nhật viền trước ngực, phối các dải hoa văn ngũ hành ở cổ tay. Khi phối kiểu Gen Z (như mặc khoác ngoài hoặc phối cùng váy suông), người mặc cần giữ nguyên vẹn hoa văn viền cổ, không đính ghim hoặc phụ kiện rườm rà làm che khuất dải chữ nhật linh thiêng này.',
    tag: 'Cung Đình Triều Nguyễn',
  },
  {
    id: 'rule_4',
    title: '4. Ý Nghĩa Của 5 Thân Áo & 5 Nút Cài (Ngũ Thường)',
    summary: 'Triết lý gia đình và nhân cách làm người được dệt thành tấm áo.',
    content:
      'Năm thân áo tượng trưng cho Tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ vợ/chồng) che chở cho thân con bên trong (chính là người mặc). Năm chiếc cúc áo tượng trưng cho 5 đức tính nền tảng của con người: NHÂN (yêu thương), LỄ (cung kính lễ phép), NGHĨA (chính trực), TRÍ (sáng suốt), TÍN (giữ lời hứa). Khi mặc áo ngũ thân, người trẻ khoác lên mình cả đạo lý làm người sâu sắc.',
    tag: 'Triết Lý Di Sản',
  },
  {
    id: 'rule_5',
    title: '5. Cách Phối Gen Z Tôn Trọng Di Sản (Do & Don’t)',
    summary: 'Tự do sáng tạo phong cách nhưng không đánh mất cốt cách văn hóa.',
    content:
      'NÊN: Phối áo ngũ thân với giày sneaker trắng tối giản, quần tây ống suông hoặc chân váy xếp ly; kết hợp túi tote dệt lụa, kính mắt retro cho buổi dạo phố, chụp ảnh kỷ yếu. KHÔNG NÊN: Xuyên thấu hở hang không mặc áo lót; mặc áo tấc lễ phục đến những nơi bar/pub ồn ào; biến dạng phom dáng cổ áo; in thêu hoa văn linh vật (rồng, phượng, kỳ lân) sai quy cách.',
    tag: 'Gợi Ý Phối Đồ',
  },
];

export const CulturalGuideSection: React.FC = () => {
  // Rules list state with localStorage persistence
  const [rules, setRules] = useState<CulturalRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RULES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_RULES;
  });

  const [openAccordion, setOpenAccordion] = useState<string | null>(rules[0]?.id || null);

  // Form modal state for Adding / Editing rules
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSummary, setModalSummary] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalTag, setModalTag] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync rules with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    } catch (e) {
      console.warn('Could not save rules to localStorage', e);
    }
  }, [rules]);

  // Open modal to create a new rule
  const handleOpenAddModal = () => {
    setEditingRuleId(null);
    setModalTitle('');
    setModalSummary('');
    setModalContent('');
    setModalTag('Quy Tắc Mới');
    setIsModalOpen(true);
  };

  // Open modal to edit an existing rule
  const handleOpenEditModal = (rule: CulturalRule, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRuleId(rule.id);
    setModalTitle(rule.title);
    setModalSummary(rule.summary);
    setModalContent(rule.content);
    setModalTag(rule.tag || 'Quy Tắc');
    setIsModalOpen(true);
  };

  // Save rule (Add or Update)
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) {
      alert('Vui lòng nhập tiêu đề cho quy tắc!');
      return;
    }

    if (editingRuleId) {
      // Update existing rule
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRuleId
            ? {
                ...r,
                title: modalTitle.trim(),
                summary: modalSummary.trim() || 'Quy tắc hướng dẫn mặc cổ phục.',
                content: modalContent.trim() || modalSummary.trim(),
                tag: modalTag.trim() || undefined,
              }
            : r
        )
      );
      showToast('Đã cập nhật quy tắc thành công!');
    } else {
      // Add new rule
      const newRule: CulturalRule = {
        id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: modalTitle.trim(),
        summary: modalSummary.trim() || 'Quy tắc hướng dẫn mặc cổ phục.',
        content: modalContent.trim() || modalSummary.trim(),
        tag: modalTag.trim() || undefined,
      };
      setRules((prev) => [...prev, newRule]);
      setOpenAccordion(newRule.id);
      showToast('Đã thêm quy tắc mới thành công!');
    }

    setIsModalOpen(false);
  };

  // Delete a rule
  const handleDeleteRule = (ruleId: string, ruleTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa quy tắc "${ruleTitle}" không?`)) {
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      if (openAccordion === ruleId) {
        setOpenAccordion(null);
      }
      showToast('Đã xóa quy tắc.');
    }
  };

  // Reset to default rules
  const handleResetDefault = () => {
    if (window.confirm('Khôi phục danh sách các quy tắc mặc định ban đầu?')) {
      setRules(DEFAULT_RULES);
      setOpenAccordion(DEFAULT_RULES[0].id);
      showToast('Đã khôi phục các quy tắc di sản mặc định!');
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1918] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#E9C46A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar: Sửa tên thành "Quy Chuẩn" */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
            Di Sản & Văn Hóa · CHẠM
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
            Quy Chuẩn
          </h2>
          <p className="text-xs md:text-sm text-[#57534E] mt-1.5 max-w-2xl leading-relaxed">
            Hệ thống quy chuẩn và nguyên tắc khi mặc và phối cổ phục Việt Nam. Bạn có thể tự do thêm các ô quy tắc mới, chỉnh sửa nội dung hoặc xóa bớt bất kỳ lúc nào.
          </p>
        </div>

        {/* Action buttons: Thêm Quy Tắc Mới & Khôi Phục */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefault}
            className="p-2.5 text-[#78716C] hover:text-[#1A1918] hover:bg-[#F2EFE9] border border-[#DDD6CA] bg-white rounded-lg transition-colors cursor-pointer"
            title="Khôi phục danh sách quy tắc mặc định ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-lg transition-all shadow-2xs hover:shadow-md cursor-pointer"
            title="Thêm một quy tắc mới vào danh sách"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Quy Tắc Mới</span>
          </button>
        </div>
      </div>

      {/* Main Rules Content: ĐÃ XÓA Ô Cam Kết Bảo Tồn Bản Sắc VÀ Ô Ghi Nhớ Khi Thử Đồ */}
      <div className="pt-6 space-y-3.5">
        {rules.length === 0 ? (
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-10 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#A8A29E] mx-auto" />
            <h4 className="text-base font-bold text-[#1A1918]">Chưa có quy tắc nào trong danh sách</h4>
            <p className="text-xs text-[#78716C] max-w-md mx-auto">
              Bạn đã xóa hết các quy tắc. Hãy bấm nút dưới đây để thêm quy tắc mới hoặc khôi phục lại các quy tắc mẫu.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 text-xs font-bold text-white bg-[#9E2A2B] rounded-lg hover:bg-[#831F20] transition-colors"
              >
                + Thêm Quy Tắc Đầu Tiên
              </button>
              <button
                onClick={handleResetDefault}
                className="px-4 py-2 text-xs font-semibold text-[#57534E] bg-[#FAF9F6] border border-[#DDD6CA] rounded-lg hover:bg-[#F2EFE9] transition-colors"
              >
                Khôi Phục Quy Tắc Mẫu
              </button>
            </div>
          </div>
        ) : (
          rules.map((rule, index) => {
            const isOpen = openAccordion === rule.id;
            return (
              <div
                key={rule.id}
                className="bg-white border border-[#E7E2D8] hover:border-[#C4BDB0] rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                {/* Header card: Click to expand / collapse */}
                <div
                  onClick={() => setOpenAccordion(isOpen ? null : rule.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {rule.tag && (
                        <span className="text-[10px] font-bold text-[#9E2A2B] bg-[#9E2A2B]/10 px-2 py-0.5 rounded">
                          {rule.tag}
                        </span>
                      )}
                      <span className="text-[11px] text-[#A8A29E] font-medium">Quy tắc #{index + 1}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#1A1918]">
                      {rule.title}
                    </h3>
                    {rule.summary && (
                      <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">{rule.summary}</p>
                    )}
                  </div>

                  {/* Actions: Edit, Delete, Expand/Collapse */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(rule, e)}
                      className="p-1.5 text-[#78716C] hover:text-[#9E2A2B] hover:bg-white rounded-md transition-colors border border-transparent hover:border-[#DDD6CA] cursor-pointer"
                      title="Chỉnh sửa quy tắc này"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteRule(rule.id, rule.title, e)}
                      className="p-1.5 text-[#78716C] hover:text-[#B84227] hover:bg-[#FDF2F2] rounded-md transition-colors border border-transparent hover:border-[#F5C2B7] cursor-pointer"
                      title="Xóa quy tắc này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <ChevronDown
                      className={`w-4 h-4 text-[#78716C] ml-1 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#9E2A2B]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-[#44403C] leading-relaxed border-t border-[#F2EFE9] bg-[#FAF9F6]">
                    <div className="p-4 bg-white border border-[#EDE8DF] rounded-lg shadow-2xs space-y-2">
                      <p className="whitespace-pre-line text-[#292524]">{rule.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Thêm / Chỉnh Sửa Quy Tắc */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE6DF] bg-[#FAF9F6]">
              <div>
                <h3 className="text-base font-bold text-[#1A1918]">
                  {editingRuleId ? 'Chỉnh Sửa Quy Tắc' : 'Thêm Quy Tắc Mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#78716C] hover:text-[#1A1918] rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRule} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1A1918] block mb-1">
                  Tiêu đề quy tắc <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Ví dụ: Cài cúc áo sang bên nách phải, Lựa chọn hài thêu..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-lg focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A1918] block mb-1">
                  Nhãn phân loại (không bắt buộc)
                </label>
                <input
                  type="text"
                  value={modalTag}
                  onChange={(e) => setModalTag(e.target.value)}
                  placeholder="Ví dụ: Bắt Buộc, Khuyên Dùng, Quy Chuẩn Phom Dáng..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-lg focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A1918] block mb-1">
                  Tóm tắt ngắn gọn
                </label>
                <input
                  type="text"
                  value={modalSummary}
                  onChange={(e) => setModalSummary(e.target.value)}
                  placeholder="Một câu tóm tắt ý chính của quy tắc này..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-lg focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A1918] block mb-1">
                  Nội dung chi tiết & hướng dẫn <span className="text-[#9E2A2B]">*</span>
                </label>
                <textarea
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  rows={5}
                  placeholder="Ghi chi tiết quy tắc, cách thực hiện đúng, những điều nên và không nên làm khi mặc cổ phục..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD6CA] focus:border-[#9E2A2B] focus:bg-white rounded-lg focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1A1918] bg-white border border-[#DDD6CA] rounded-lg transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{editingRuleId ? 'Cập Nhật Quy Tắc' : 'Thêm Quy Tắc'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
