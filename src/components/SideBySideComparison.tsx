import React, { useState } from 'react';
import { OutfitComposition, CostumeItem } from '../types/vietphuc';
import { CostumeIllustration } from './CostumeIllustration';
import { analyzeColorHarmony, auditCulturalEtiquette } from '../utils/costumeRules';
import { X, ArrowRightLeft } from 'lucide-react';

interface SideBySideComparisonProps {
  currentOutfit: OutfitComposition;
  allCostumes: CostumeItem[];
  onClose: () => void;
  onApplyOutfitA: () => void;
  onApplyOutfitB: (outfitB: OutfitComposition) => void;
}

export const SideBySideComparison: React.FC<SideBySideComparisonProps> = ({
  currentOutfit,
  allCostumes,
  onClose,
  onApplyOutfitB,
}) => {
  const outerOptions = allCostumes.filter((c) => c.category === 'ao_ngoai');
  const bottomOptions = allCostumes.filter((c) => c.category === 'quan_vay');
  const accessoryOptions = allCostumes.filter((c) => c.category === 'phu_kien');

  // Alternative outfit B state
  const [outfitB, setOutfitB] = useState<OutfitComposition>({
    outerwear: outerOptions[1] || outerOptions[0],
    bottom: bottomOptions[1] || bottomOptions[0],
    accessory: accessoryOptions[1] || accessoryOptions[0],
    footwear: allCostumes.find((c) => c.id === 'guoc_moc_khac_hoa'),
    customColorOuter: outerOptions[1]?.heroColor || '#9E2A2B',
    customColorBottom: bottomOptions[1]?.heroColor || '#F7F5F0',
    customColorAccessory: accessoryOptions[1]?.heroColor || '#CBD5E1',
    targetOccasion: 'Tiệc Cưới & Dự Lễ',
    lookbookTitle: 'Phương Án B · Lễ Nghi Cổ Điển',
    creatorName: 'Người phối di sản',
  });

  const harmonyA = analyzeColorHarmony(
    currentOutfit.customColorOuter,
    currentOutfit.customColorBottom,
    currentOutfit.customColorAccessory
  );

  const harmonyB = analyzeColorHarmony(
    outfitB.customColorOuter,
    outfitB.customColorBottom,
    outfitB.customColorAccessory
  );

  const culturalA = auditCulturalEtiquette(
    currentOutfit.outerwear,
    currentOutfit.bottom,
    currentOutfit.accessory,
    currentOutfit.footwear,
    currentOutfit.targetOccasion
  );

  const culturalB = auditCulturalEtiquette(
    outfitB.outerwear,
    outfitB.bottom,
    outfitB.accessory,
    outfitB.footwear,
    outfitB.targetOccasion
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>So Sánh Song Song Hai Phương Án</span>
            </div>
            <h3 className="text-2xl font-normal text-[#1A1918] font-display mt-0.5">
              Đối Chiếu Bản Phối Cổ Phục
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1A1918] rounded-full hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side by side columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OPTION A: CURRENT */}
          <div className="bg-[#FAF9F6] border border-[#E7E2D8] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B]">
                Phương Án A (Hiện Tại)
              </span>
              <span className="text-xs font-medium text-[#2D6A4F] bg-[#EBF3ED] px-2.5 py-0.5 rounded">
                {currentOutfit.targetOccasion}
              </span>
            </div>

            <div className="w-full flex items-center justify-center py-2 bg-white rounded-lg border border-[#EDE8DF]">
              <CostumeIllustration
                outerwear={currentOutfit.outerwear}
                bottom={currentOutfit.bottom}
                accessory={currentOutfit.accessory}
                outerColor={currentOutfit.customColorOuter}
                bottomColor={currentOutfit.customColorBottom}
                accessoryColor={currentOutfit.customColorAccessory}
                size="md"
                showMannequin={true}
                gender={currentOutfit.gender || 'Nam'}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Tên bản phối:</span>
                <span className="font-semibold text-[#1A1918]">{currentOutfit.lookbookTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Áo chính:</span>
                <span className="font-semibold text-[#1A1918]">{currentOutfit.outerwear?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Dưới:</span>
                <span className="font-semibold text-[#1A1918]">{currentOutfit.bottom?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Phù hợp:</span>
                <span className="font-semibold text-[#9E2A2B]">{currentOutfit.targetOccasion}</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#1A1918] block">Đánh giá hòa sắc:</span>
                <p className="text-[11px] text-[#57534E] leading-relaxed mt-0.5">{harmonyA.title}</p>
              </div>
            </div>
          </div>

          {/* OPTION B: ALTERNATIVE */}
          <div className="bg-[#FAF9F6] border border-[#E7E2D8] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1918]">
                Phương Án B (Phương Án Thay Thế)
              </span>
              <span className="text-xs font-medium text-[#2D6A4F] bg-[#EBF3ED] px-2.5 py-0.5 rounded">
                {outfitB.targetOccasion}
              </span>
            </div>

            {/* Quick selector for option B outerwear */}
            <div className="flex gap-2 text-xs">
              <select
                value={outfitB.outerwear?.id}
                onChange={(e) => {
                  const item = outerOptions.find((c) => c.id === e.target.value);
                  if (item) setOutfitB((prev) => ({ ...prev, outerwear: item, customColorOuter: item.heroColor }));
                }}
                className="w-full bg-white border border-[#DDD6CA] rounded p-1.5 text-xs font-medium"
              >
                {outerOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full flex items-center justify-center py-2 bg-white rounded-lg border border-[#EDE8DF]">
              <CostumeIllustration
                outerwear={outfitB.outerwear}
                bottom={outfitB.bottom}
                accessory={outfitB.accessory}
                outerColor={outfitB.customColorOuter}
                bottomColor={outfitB.customColorBottom}
                accessoryColor={outfitB.customColorAccessory}
                size="md"
                showMannequin={true}
                gender={currentOutfit.gender || 'Nam'}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Tên bản phối:</span>
                <span className="font-semibold text-[#1A1918]">{outfitB.lookbookTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Áo chính:</span>
                <span className="font-semibold text-[#1A1918]">{outfitB.outerwear?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Dưới:</span>
                <span className="font-semibold text-[#1A1918]">{outfitB.bottom?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDE8DF]">
                <span className="text-[#78716C]">Phù hợp:</span>
                <span className="font-semibold text-[#9E2A2B]">{outfitB.targetOccasion}</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#1A1918] block">Đánh giá hòa sắc:</span>
                <p className="text-[11px] text-[#57534E] leading-relaxed mt-0.5">{harmonyB.title}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onApplyOutfitB(outfitB);
                onClose();
              }}
              className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#9E2A2B] rounded-md transition-colors"
            >
              <span>Áp Dụng Phương Án B Vào Phòng Thử</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
