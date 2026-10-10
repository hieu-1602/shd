import React from 'react';
import { CostumeItem } from '../types/vietphuc';

interface CostumeItemVisualProps {
  item: CostumeItem;
  color?: string;
  className?: string;
}

export const CostumeItemVisual: React.FC<CostumeItemVisualProps> = ({
  item,
  color,
  className = 'w-14 h-16 sm:w-16 sm:h-18',
}) => {
  const activeColor = color || item.heroColor || '#9E2A2B';
  const id = item.id;
  const category = item.category;
  const displayImg = (item.imageUrls && item.imageUrls.length > 0) ? item.imageUrls[0] : item.imageUrl;

  // If user uploaded an image or imageUrl is present
  if (displayImg) {
    return (
      <div
        className={`relative shrink-0 rounded-lg overflow-hidden bg-transparent border border-[#E7E2D8] flex items-center justify-center shadow-2xs ${className}`}
      >
        <img
          src={displayImg}
          alt={item.name}
          className="w-full h-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
        />
        {/* Subtle color badge indicator on top right */}
        <div
          className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
          style={{ backgroundColor: activeColor }}
          title={`Màu: ${activeColor}`}
        />
      </div>
    );
  }

  // Visual SVG illustrations for each garment piece
  return (
    <div
      className={`relative shrink-0 rounded-lg overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#F2EFE9] border border-[#E7E2D8] flex items-center justify-center p-1 shadow-2xs select-none transition-all duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 100 110"
        className="w-full h-full drop-shadow-2xs transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`sheen_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* 0. BỘ TRANG PHỤC (CẢ BỘ ĐỒ) */}
        {category === 'bo_trang_phuc' && (
          <g>
            {/* Áo dài / Áo ngoài */}
            <path d="M26 26 L12 34 L10 68 L28 56 Z" fill={activeColor} />
            <path d="M74 26 L88 34 L90 68 L72 56 Z" fill={activeColor} />
            <path d="M28 24 Q50 22 72 24 L78 86 Q50 88 22 86 Z" fill={activeColor} />
            <path d="M28 24 Q50 22 72 24 L78 86 Q50 88 22 86 Z" fill={`url(#sheen_${id})`} />
            {/* Cổ áo vạt ngũ thân & cúc ngọc */}
            <path d="M42 18 Q50 16 58 18 L60 26 Q50 24 40 26 Z" fill={activeColor} stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
            <path d="M50 26 Q54 36 62 44 L64 68" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            <circle cx="62" cy="44" r="1.5" fill="#E9C46A" />
            <circle cx="63" cy="54" r="1.5" fill="#E9C46A" />
            {/* Quần bên dưới lấp ló */}
            <path d="M30 86 L26 104 L46 104 L48 87 Z" fill="#FAF8F5" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
            <path d="M52 87 L54 104 L74 104 L70 86 Z" fill="#FAF8F5" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
          </g>
        )}

        {/* 1. ÁO CHÍNH (MẶT TRƯỚC) */}
        {(category === 'ao_ngoai' || category === 'ao_ngoai_truoc') && (
          <g>
            {id === 'ao_tac_ngu_than' ? (
              // Áo Tấc (Tay thụng rộng)
              <g>
                {/* Tay thụng rộng 2 bên */}
                <path d="M28 28 L10 32 L8 70 L30 58 Z" fill={activeColor} />
                <path d="M72 28 L90 32 L92 70 L70 58 Z" fill={activeColor} />
                {/* Thân áo */}
                <path d="M30 26 Q50 24 70 26 L76 96 Q50 99 24 96 Z" fill={activeColor} />
                <path d="M30 26 Q50 24 70 26 L76 96 Q50 99 24 96 Z" fill={`url(#sheen_${id})`} />
                {/* Cổ đứng */}
                <path d="M44 20 Q50 17 56 20 L58 28 Q50 26 42 28 Z" fill={activeColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                {/* Vạt cài nút hữu nhậm */}
                <path d="M50 28 Q54 40 64 50 L65 75 L50 98" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" />
                <circle cx="64" cy="50" r="1.5" fill="#E9C46A" />
                <circle cx="64.5" cy="62" r="1.5" fill="#E9C46A" />
              </g>
            ) : id === 'ao_nhat_binh_cung_dinh' ? (
              // Áo Nhật Bình (Dải cổ nhật bình chữ nhật ngũ sắc)
              <g>
                {/* Tay áo lửng vừa */}
                <path d="M28 28 L14 34 L12 65 L28 54 Z" fill={activeColor} />
                <path d="M72 28 L86 34 L88 65 L72 54 Z" fill={activeColor} />
                {/* Dải ngũ hành cổ tay */}
                <path d="M12 60 L14 65 L28 54 L26 49 Z" fill="#E9C46A" />
                <path d="M88 60 L86 65 L72 54 L74 49 Z" fill="#9E2A2B" />
                {/* Thân áo */}
                <path d="M28 26 Q50 24 72 26 L75 96 Q50 98 25 96 Z" fill={activeColor} />
                <path d="M28 26 Q50 24 72 26 L75 96 Q50 98 25 96 Z" fill={`url(#sheen_${id})`} />
                {/* Cổ nhật bình hình chữ nhật viền trước ngực */}
                <rect x="42" y="24" width="16" height="35" rx="1" fill="#E9C46A" stroke="#9E2A2B" strokeWidth="1" />
                <rect x="45" y="27" width="10" height="30" rx="0.5" fill="#2A9D8F" />
                {/* Dải ngọc bội / hoa sen giữa */}
                <circle cx="50" cy="66" r="2" fill="#E76F51" />
              </g>
            ) : id === 'ao_tu_than_bac_bo' ? (
              // Áo Tứ Thân (2 vạt buộc túm trước bụng)
              <g>
                {/* Tay chẽn mộc */}
                <path d="M28 28 L14 36 L16 58 L28 50 Z" fill={activeColor} />
                <path d="M72 28 L86 36 L84 58 L72 50 Z" fill={activeColor} />
                {/* Lưng áo & 2 vạt sau buông dài */}
                <path d="M28 26 Q50 24 72 26 L74 94 Q50 96 26 94 Z" fill={activeColor} />
                {/* Vạt trước buộc túm */}
                <path d="M38 32 L48 68 L42 90 L34 90 Z" fill={activeColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                <path d="M62 32 L52 68 L58 90 L66 90 Z" fill={activeColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                {/* Nút buộc túm vạt */}
                <ellipse cx="50" cy="68" rx="4" ry="3" fill="#E9C46A" />
                {/* Lộ chút yếm đỏ bên trong */}
                <polygon points="46,30 54,30 50,38" fill="#EE6C4D" />
              </g>
            ) : id === 'ao_giao_linh_dai_viet' ? (
              // Áo Giao Lĩnh (Vạt chéo giao nhau)
              <g>
                {/* Tay thụng vừa */}
                <path d="M28 28 L12 36 L14 66 L28 55 Z" fill={activeColor} />
                <path d="M72 28 L88 36 L86 66 L72 55 Z" fill={activeColor} />
                {/* Thân */}
                <path d="M28 26 Q50 24 72 26 L76 96 Q50 99 24 96 Z" fill={activeColor} />
                {/* Vạt chéo giao lĩnh trái đè phải */}
                <path d="M36 24 L68 58 L68 96" fill="none" stroke="#E0FBFC" strokeWidth="2.5" />
                <path d="M64 24 L48 44" fill="none" stroke="#E0FBFC" strokeWidth="1.5" />
                {/* Dải thắt lưng buộc */}
                <rect x="36" y="56" width="28" height="5" fill="#293241" rx="1" />
              </g>
            ) : id === 'ao_dai_tan_thoi_remix' ? (
              // Áo Dài Tối Giản Gen Z
              <g>
                {/* Tay áo ôm thanh mảnh */}
                <path d="M32 28 L18 36 L20 60 L32 50 Z" fill={activeColor} />
                <path d="M68 28 L82 36 L80 60 L68 50 Z" fill={activeColor} />
                {/* Thân áo thon thả, tà xẻ cao */}
                <path d="M34 26 Q50 24 66 26 L64 54 L70 98 Q50 96 30 98 L36 54 Z" fill={activeColor} />
                <path d="M34 26 Q50 24 66 26 L64 54 L70 98 Q50 96 30 98 L36 54 Z" fill={`url(#sheen_${id})`} />
                {/* Cổ trụ thanh lịch */}
                <path d="M45 20 Q50 18 55 20 L56 26 Q50 24 44 26 Z" fill={activeColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                {/* Đường xẻ tà 2 bên */}
                <line x1="36" y1="54" x2="33" y2="98" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                <line x1="64" y1="54" x2="67" y2="98" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
              </g>
            ) : (
              // Mặc định: Áo Ngũ Thân Tay Chẽn
              <g>
                {/* Tay chẽn đứng phom */}
                <path d="M30 28 L15 35 L17 62 L29 52 Z" fill={activeColor} />
                <path d="M70 28 L85 35 L83 62 L71 52 Z" fill={activeColor} />
                {/* 5 Thân áo */}
                <path d="M30 26 Q50 24 70 26 L74 96 Q50 98 26 96 Z" fill={activeColor} />
                <path d="M30 26 Q50 24 70 26 L74 96 Q50 98 26 96 Z" fill={`url(#sheen_${id})`} />
                {/* Cổ đứng chuẩn mực */}
                <path d="M44 20 Q50 17 56 20 L57 28 Q50 26 43 28 Z" fill={activeColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                {/* 5 Cúc vàng ngũ thường */}
                <path d="M49 28 Q52 38 62 48 L63 76 L50 96" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                <circle cx="50" cy="27" r="1.5" fill="#D4A373" stroke="#333" strokeWidth="0.4" />
                <circle cx="57" cy="38" r="1.5" fill="#D4A373" stroke="#333" strokeWidth="0.4" />
                <circle cx="62" cy="48" r="1.5" fill="#D4A373" stroke="#333" strokeWidth="0.4" />
                <circle cx="62.5" cy="58" r="1.5" fill="#D4A373" stroke="#333" strokeWidth="0.4" />
                <circle cx="63" cy="68" r="1.5" fill="#D4A373" stroke="#333" strokeWidth="0.4" />
              </g>
            )}
          </g>
        )}

        {/* ÁO CHÍNH (MẶT SAU) */}
        {category === 'ao_ngoai_sau' && (
          <g>
            {/* Lưng áo chính mặt sau */}
            <g>
              {/* Tay áo buông suông hai bên */}
              <path d="M28 28 L10 32 L8 70 L30 58 Z" fill={activeColor} />
              <path d="M72 28 L90 32 L92 70 L70 58 Z" fill={activeColor} />
              {/* Thân lưng áo thẳng tắp liền mạch */}
              <path d="M30 26 Q50 24 70 26 L76 96 Q50 99 24 96 Z" fill={activeColor} />
              <path d="M30 26 Q50 24 70 26 L76 96 Q50 99 24 96 Z" fill={`url(#sheen_${id})`} />
              {/* Cổ sau kín đáo */}
              <path d="M44 20 Q50 22 56 20 L58 26 Q50 28 42 26 Z" fill={activeColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
              {/* Đường sống lưng áo chạy dọc chính giữa biểu trưng cho tính chính trực */}
              <line x1="50" y1="26" x2="50" y2="98" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" strokeDasharray="3 2" />
            </g>
          </g>
        )}

        {/* 2. ÁO PHỤ */}
        {category === 'ao_trong' && (
          <g>
            {id === 'ao_yem_lua_theu_hoa' ? (
              // Áo Yếm Thêu Hoa Sen (Quả trám / tam giác)
              <g>
                {/* Dây yếm quàng cổ */}
                <path d="M38 18 Q50 10 62 18" fill="none" stroke={activeColor} strokeWidth="2.5" />
                {/* Thân yếm hình quả trám */}
                <polygon points="50,22 80,56 50,88 20,56" fill={activeColor} />
                <polygon points="50,22 80,56 50,88 20,56" fill={`url(#sheen_${id})`} />
                {/* Dải dây buộc lưng 2 bên */}
                <line x1="20" y1="56" x2="8" y2="64" stroke={activeColor} strokeWidth="2" />
                <line x1="80" y1="56" x2="92" y2="64" stroke={activeColor} strokeWidth="2" />
                {/* Bông hoa sen thêu chỉ vàng giữa ngực */}
                <circle cx="50" cy="55" r="5" fill="#FAF8F5" opacity="0.9" />
                <path d="M46 55 Q50 47 54 55 Q50 63 46 55 Z" fill="#9E2A2B" />
                <circle cx="50" cy="55" r="2" fill="#E9C46A" />
              </g>
            ) : (
              // Áo Lót Cánh Sen Trắng Ngà
              <g>
                {/* Thân áo lót ôm */}
                <path d="M34 32 Q50 30 66 32 L64 88 Q50 90 36 88 Z" fill={activeColor} stroke="#E5E0D8" strokeWidth="1" />
                {/* Cổ cánh sen tròn thanh khiết */}
                <path d="M44 22 C44 17 56 17 56 22 L58 34 Q50 32 42 34 Z" fill={activeColor} stroke="#DDD6CA" strokeWidth="1.2" />
                {/* Nẹp viền trắng ngà */}
                <line x1="50" y1="34" x2="50" y2="88" stroke="#E5E0D8" strokeWidth="1" />
              </g>
            )}
          </g>
        )}

        {/* 3. THÂN DƯỚI (QUẦN & CHÂN VÁY) */}
        {category === 'quan_vay' && (
          <g>
            {id === 'chan_vay_xep_ly_genz' ? (
              // Chân Váy Xếp Ly Dài
              <g>
                {/* Cạp váy */}
                <rect x="36" y="24" width="28" height="5" fill="#1A1918" rx="1" />
                {/* Thân váy xòe chữ A xếp nếp */}
                <path d="M36 29 L20 96 L80 96 L64 29 Z" fill={activeColor} />
                <path d="M36 29 L20 96 L80 96 L64 29 Z" fill={`url(#sheen_${id})`} />
                {/* Các đường ly thanh mảnh */}
                {[26, 33, 40, 47, 53, 60, 67, 74].map((x, i) => (
                  <line
                    key={i}
                    x1={38 + (i * 3)}
                    y1="29"
                    x2={x}
                    y2="96"
                    stroke="rgba(0,0,0,0.18)"
                    strokeWidth="1.2"
                  />
                ))}
              </g>
            ) : id === 'quan_denim_theu_may' ? (
              // Quần Denim Thêu Mây Sóng Cổ
              <g>
                {/* Cạp quần */}
                <rect x="34" y="22" width="32" height="6" fill="#1A1A1A" rx="1" />
                {/* Ống quần trái */}
                <path d="M34 28 L48 30 L46 95 L26 95 Z" fill={activeColor} />
                {/* Ống quần phải */}
                <path d="M52 30 L66 28 L74 95 L54 95 Z" fill={activeColor} />
                {/* Họa tiết thêu mây sóng ở gấu quần */}
                <path d="M28 88 Q34 82 40 88 Q46 82 52 88" fill="none" stroke="#E9C46A" strokeWidth="1.5" />
                {/* Xắn gấu cá tính */}
                <rect x="25" y="93" width="22" height="3" fill="#E8DED1" />
                <rect x="53" y="93" width="22" height="3" fill="#E8DED1" />
              </g>
            ) : (
              // Quần Lụa Lãnh Mỹ A Ống Rộng Mờ
              <g>
                {/* Cạp lụa */}
                <rect x="35" y="22" width="30" height="5" fill="#2B2B2B" rx="1" />
                {/* Ống rộng bay bổng */}
                <path d="M35 27 L48 30 L44 96 L22 96 Z" fill={activeColor} />
                <path d="M52 30 L65 27 L78 96 L56 96 Z" fill={activeColor} />
                <path d="M35 27 L48 30 L44 96 L22 96 Z" fill={`url(#sheen_${id})`} />
                <path d="M52 30 L65 27 L78 96 L56 96 Z" fill={`url(#sheen_${id})`} />
                {/* Nếp rủ óng ả */}
                <line x1="33" y1="35" x2="30" y2="92" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="67" y1="35" x2="70" y2="92" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </g>
            )}
          </g>
        )}

        {/* 4. PHỤ KIỆN */}
        {category === 'phu_kien' && (
          <g>
            {id === 'khan_dong_ngu_than' ? (
              // Khăn Đóng Nếp Quấn Chữ Nhân
              <g>
                {/* Phom khăn xếp hình bán nguyệt quấn nếp */}
                <path d="M25 45 Q50 20 75 45 L78 68 Q50 48 22 68 Z" fill={activeColor} />
                {/* Các lớp nếp quấn the mỏng */}
                <path d="M26 49 Q50 26 74 49" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M25 55 Q50 32 75 55" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M24 61 Q50 38 76 61" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                {/* Đỉnh chóp chữ Nhân */}
                <polygon points="46,36 54,36 50,28" fill="#E9C46A" />
              </g>
            ) : id === 'kieng_bac_cham_hoa_sen' ? (
              // Kiềng Bạc Chạm Hoa Sen Cổ
              <g>
                {/* Vòng kiềng cổ tròn chạm trổ */}
                <circle cx="50" cy="50" r="30" fill="none" stroke={activeColor === '#CBD5E1' ? '#CBD5E1' : activeColor} strokeWidth="7" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                {/* Mặt kiềng hoa sen chạm khắc nổi */}
                <circle cx="50" cy="80" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                <circle cx="50" cy="80" r="3" fill="#D4AF37" />
              </g>
            ) : id === 'kinh_ram_cyber_oval' ? (
              // Kính Râm Oval Retro
              <g>
                {/* Mắt kính trái */}
                <ellipse cx="32" cy="54" rx="14" ry="9" fill="#1E293B" stroke={activeColor} strokeWidth="2" />
                {/* Mắt kính phải */}
                <ellipse cx="68" cy="54" rx="14" ry="9" fill="#1E293B" stroke={activeColor} strokeWidth="2" />
                {/* Cầu kính */}
                <path d="M46 54 Q50 50 54 54" fill="none" stroke={activeColor} strokeWidth="2" />
                {/* Gọng kính vintage kéo dài */}
                <path d="M18 53 L10 50" stroke={activeColor} strokeWidth="2" />
                <path d="M82 53 L90 50" stroke={activeColor} strokeWidth="2" />
              </g>
            ) : id === 'non_quai_thao_mini' ? (
              // Nón Ba Tầm Quai Thao
              <g>
                {/* Vành nón tròn xoe */}
                <ellipse cx="50" cy="46" rx="38" ry="16" fill={activeColor} stroke="#B89F7D" strokeWidth="2" />
                <ellipse cx="50" cy="46" rx="20" ry="8" fill="#E8D8C3" opacity="0.5" />
                {/* Dải quai thao rủ tím mộng mơ */}
                <path d="M38 52 Q32 75 28 96" stroke="#7209B7" strokeWidth="3" fill="none" />
                <path d="M62 52 Q68 75 72 96" stroke="#7209B7" strokeWidth="3" fill="none" />
              </g>
            ) : (
              // Phụ kiện mặc định
              <g>
                <circle cx="50" cy="50" r="26" fill={activeColor} />
                <circle cx="50" cy="50" r="14" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
              </g>
            )}
          </g>
        )}

        {/* 5. GIÀY DÉP */}
        {category === 'giay_dep' && (
          <g>
            {id === 'guoc_moc_khac_hoa' ? (
              // Guốc Mộc Sơn Mài Quai Nhung
              <g>
                {/* Đế gỗ sơn mài uốn cong */}
                <path d="M18 64 Q32 58 50 64 L80 66 Q84 72 82 78 L20 78 Q16 72 18 64 Z" fill={activeColor} stroke="#3D2B1F" strokeWidth="1" />
                {/* Gót guốc cao thanh thoát */}
                <rect x="22" y="78" width="16" height="12" rx="2" fill="#3D2B1F" />
                <rect x="66" y="78" width="14" height="12" rx="2" fill="#3D2B1F" />
                {/* Quai nhung cong ôm chân */}
                <path d="M36 64 Q50 48 64 64" fill="none" stroke="#1A1A1A" strokeWidth="5" />
                <path d="M36 64 Q50 48 64 64" fill="none" stroke="#D4AF37" strokeWidth="1" />
              </g>
            ) : (
              // Sneaker Chunky Trắng Ngà Đế Dày
              <g>
                {/* Thân giày sneaker hiện đại */}
                <path d="M15 68 Q25 50 48 50 L68 56 Q85 64 86 76 L15 76 Z" fill={activeColor} stroke="#DDD6CA" strokeWidth="1.2" />
                {/* Đế giày chunky đệm dày */}
                <rect x="12" y="76" width="76" height="14" rx="4" fill="#F0EDE6" stroke="#C4BDB0" strokeWidth="1" />
                {/* Rãnh đế gợn sóng */}
                <line x1="26" y1="83" x2="38" y2="83" stroke="#8C857B" strokeWidth="2" />
                <line x1="48" y1="83" x2="60" y2="83" stroke="#8C857B" strokeWidth="2" />
                <line x1="70" y1="83" x2="80" y2="83" stroke="#8C857B" strokeWidth="2" />
                {/* Dây giày & chi tiết thân */}
                <path d="M42 52 L54 64" stroke="#1A1918" strokeWidth="1.5" />
                <path d="M48 52 L60 64" stroke="#1A1918" strokeWidth="1.5" />
                <path d="M26 66 Q45 60 72 66" fill="none" stroke="#9E2A2B" strokeWidth="1.5" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
