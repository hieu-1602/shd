import React from 'react';
import { CostumeItem } from '../types/vietphuc';
import { X, Trash2, ArrowRight, Bookmark } from 'lucide-react';

interface WardrobeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCostumes: CostumeItem[];
  onRemoveFromWardrobe: (id: string) => void;
  onClearWardrobe: () => void;
  onSendToStudio: (item: CostumeItem) => void;
  onOpenStudio: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  bo_trang_phuc: 'Bộ Trang Phục',
  ao_ngoai: 'Áo Chính (Mặt Trước)',
  ao_ngoai_sau: 'Áo Chính (Mặt Sau)',
  ao_trong: 'Áo Phụ',
  quan_vay: 'Thân Dưới',
  phu_kien: 'Phụ Kiện',
  giay_dep: 'Giày Dép',
};

export const WardrobeDrawer: React.FC<WardrobeDrawerProps> = ({
  isOpen,
  onClose,
  savedCostumes,
  onRemoveFromWardrobe,
  onClearWardrobe,
  onSendToStudio,
  onOpenStudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E7E2D8] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#EAE6DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#9E2A2B]" />
              <h3 className="text-lg font-bold text-[#1A1918] font-display">
                Tủ Đồ Của Bạn {savedCostumes.length > 0 ? `· ${savedCostumes.length} món` : ''}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedCostumes.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-sm font-medium text-[#1A1918]">Tủ đồ của bạn đang trống</p>
                <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                  Hãy ghé thăm Kho Di Sản và bấm nút "Lưu Tủ Đồ" ở các món đồ bạn yêu thích để sưu
                  tầm vào đây!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedCostumes.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FAF9F6] border border-[#EDE8DF] rounded-xl flex items-center justify-between gap-3 group hover:border-[#C4BDB0] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: item.heroColor }}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1A1918]">{item.name}</div>
                        <div className="text-[11px] text-[#78716C] mt-0.5">
                          {CATEGORY_NAMES[item.category] || item.category} · {item.era}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSendToStudio(item);
                          onClose();
                        }}
                        className="p-1.5 text-xs text-[#9E2A2B] hover:bg-white rounded transition-colors font-medium"
                        title="Thử phối món này"
                      >
                        Thử phối
                      </button>

                      <button
                        onClick={() => onRemoveFromWardrobe(item.id)}
                        className="p-1.5 text-xs text-[#78716C] hover:text-[#9E2A2B] hover:bg-white rounded transition-colors"
                        title="Xóa khỏi tủ đồ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {savedCostumes.length > 0 && (
            <div className="p-6 border-t border-[#EAE6DF] space-y-3 bg-[#FAF8F5]">
              <button
                onClick={() => {
                  onOpenStudio();
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#831F20] rounded-md transition-all shadow-xs"
              >
                <span>Mở Xưởng May Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={onClearWardrobe}
                  className="text-[11px] text-[#78716C] hover:text-[#9E2A2B] transition-colors"
                >
                  Xóa tất cả món đã lưu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
