import React from 'react';
import { CostumeItem } from '../types/vietphuc';

interface CostumeIllustrationProps {
  outerwear?: CostumeItem;
  innerwear?: CostumeItem;
  bottom?: CostumeItem;
  accessory?: CostumeItem;
  footwear?: CostumeItem;
  outerColor?: string;
  customColorOuter?: string;
  innerColor?: string;
  bottomColor?: string;
  accessoryColor?: string;
  footwearColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  showMannequin?: boolean;
  gender?: 'Nam' | 'Nữ';
  displayMode?: 'mannequin' | 'fullAvatar';
  fitOffset?: { x: number; y: number; scale: number };
  customImage?: string;
}

export const CostumeIllustration: React.FC<CostumeIllustrationProps> = ({
  outerwear,
  innerwear,
  bottom,
  accessory,
  footwear,
  outerColor: propOuterColor,
  customColorOuter,
  innerColor = innerwear?.heroColor || '#FAF8F5',
  bottomColor = bottom?.heroColor || '#1A1A1A',
  accessoryColor = accessory?.heroColor || '#D4AF37',
  footwearColor = footwear?.heroColor || '#F8F9FA',
  size = 'md',
  showMannequin = false,
  gender = 'Nam',
  displayMode = 'mannequin',
  fitOffset = { x: 0, y: 0, scale: 1 },
  customImage,
}) => {
  const outerColor = propOuterColor || customColorOuter || outerwear?.heroColor || '#1F3A4B';
  const isFemale = gender === 'Nữ';
  const shoulderLeft = isFemale ? 148 : 134;
  const shoulderRight = isFemale ? 252 : 266;
  const hipLeft = isFemale ? 138 : 152;
  const hipRight = isFemale ? 262 : 248;
  const armPitY = isFemale ? 202 : 206;
  const sizeClasses = {
    xs: 'w-16 h-20',
    sm: 'w-28 h-40',
    md: 'w-48 h-64',
    lg: 'w-72 h-96',
    full: 'w-full h-full max-h-[520px]',
  };

  const activeImage = customImage || outerwear?.imageUrl || bottom?.imageUrl;

  // Direct Photo Display: Up thẳng hình ảnh lên mà không cần có nhân vật
  if (activeImage) {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]}`}>
        <div className="relative w-full h-full max-h-[520px] rounded-2xl overflow-hidden bg-transparent border border-[#E7E2D8] flex items-center justify-center p-3 shadow-xs group">
          <img
            src={activeImage}
            alt={outerwear?.name || bottom?.name || 'Ảnh trang phục'}
            className="w-full h-full object-contain rounded-xl drop-shadow-md transition-transform duration-300 group-hover:scale-102"
          />
          {(outerwear?.name || bottom?.name) && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/65 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold truncate">{outerwear?.name || bottom?.name}</span>
              <span className="text-[10px] text-[#E9C46A] shrink-0 font-medium ml-2">Ảnh Trang Phục</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const outerId = outerwear?.id || 'ao_ngu_than_tay_chen';
  const bottomId = bottom?.id || 'quan_lua_lanh_my_a';
  const accessoryId = accessory?.id;

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]}`}>
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Fabric Gradients */}
          <linearGradient id="silkShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="goldBraid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E9C46A" />
            <stop offset="50%" stopColor="#F4A261" />
            <stop offset="100%" stopColor="#E76F51" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Ambient subtle floor ellipse */}
        <ellipse cx="200" cy="565" rx="110" ry="12" fill="#EAE6DF" opacity="0.6" />

        {/* --- MANNEQUIN BASE --- */}
        {showMannequin && (
          <g id="mannequin" opacity="0.85">
            {/* Head */}
            <ellipse cx="200" cy="95" rx={isFemale ? 24 : 27} ry={isFemale ? 32 : 35} fill="#F4E8DC" />
            {/* Neck */}
            <path d={`M${isFemale ? 193 : 191} 125 L${isFemale ? 193 : 191} 155 L${isFemale ? 207 : 209} 155 L${isFemale ? 207 : 209} 125 Z`} fill="#E6D3C0" />
            {/* Torso Base: Male = broad shoulders (134..266) taper to hips (152..248); Female = narrower shoulders (148..252), slender waist, curvy hips (138..262) */}
            <path
              d={
                isFemale
                  ? `M${shoulderLeft} 160 Q200 152 ${shoulderRight} 160 L242 245 Q262 275 ${hipRight} 305 L${hipLeft} 305 Q138 275 158 245 Z`
                  : `M${shoulderLeft} 160 Q200 148 ${shoulderRight} 160 L254 240 L${hipRight} 300 L${hipLeft} 300 L146 240 Z`
              }
              fill="#E0CAB3"
              opacity="0.4"
            />
            {/* Horizontal Arms (Giơ ngang tay) */}
            <path d={`M${shoulderLeft} 160 L45 168 L48 198 L${shoulderLeft + 2} ${armPitY} Z`} fill="#E6D3C0" />
            <path d={`M${shoulderRight} 160 L355 168 L352 198 L${shoulderRight - 2} ${armPitY} Z`} fill="#E6D3C0" />
            {/* Hands */}
            <ellipse cx="40" cy="183" rx="10" ry="14" fill="#F4E8DC" />
            <ellipse cx="360" cy="183" rx="10" ry="14" fill="#F4E8DC" />
          </g>
        )}

        {/* --- BOTTOM WEAR (QUẦN / VÁY) --- */}
        <g id="bottomLayer" filter="url(#softShadow)">
          {bottom?.imageUrl ? (
            <g id="aiBottomFitted">
              <image
                href={bottom.imageUrl}
                x={80 + (fitOffset?.x || 0)}
                y={290 + (fitOffset?.y || 0)}
                width={240 * (fitOffset?.scale || 1)}
                height={250 * (fitOffset?.scale || 1)}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          ) : bottomId === 'chan_vay_xep_ly_genz' ? (
            // Pleated Skirt (Nữ hông rộng hơn)
            <g>
              <path
                d={`M${isFemale ? 160 : 165} 310 L${isFemale ? 240 : 235} 310 L${isFemale ? 275 : 268} 535 L${isFemale ? 125 : 132} 535 Z`}
                fill={bottomColor}
              />
              <path d={`M${isFemale ? 160 : 165} 310 L${isFemale ? 240 : 235} 310 L${isFemale ? 275 : 268} 535 L${isFemale ? 125 : 132} 535 Z`} fill="url(#silkShine)" />
              {/* Pleat lines */}
              {[148, 165, 182, 200, 218, 235, 252].map((x, i) => (
                <line
                  key={i}
                  x1={170 + (i - 3) * 10}
                  y1="310"
                  x2={x}
                  y2="535"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          ) : bottomId === 'quan_denim_theu_may' ? (
            // Denim with embroidery
            <g>
              {/* Left leg */}
              <path d={`M${hipLeft + 8} 305 L198 310 L194 540 L152 538 Z`} fill={bottomColor} />
              {/* Right leg */}
              <path d={`M202 310 L${hipRight - 8} 305 L248 538 L206 540 Z`} fill={bottomColor} />
              {/* Cloud embroidery details on hem */}
              <path
                d="M158 515 Q168 505 178 515 Q188 505 198 515"
                fill="none"
                stroke="#E9C46A"
                strokeWidth="2"
              />
            </g>
          ) : (
            // Traditional Wide Silk Trousers (Quần lụa suông - hông nữ rộng cong nhẹ)
            <g>
              {/* Left Wide Leg */}
              <path
                d={`M${hipLeft + 6} 295 L198 305 L192 545 L${isFemale ? 135 : 140} 540 Q${isFemale ? 142 : 150} 420 ${hipLeft + 6} 295 Z`}
                fill={bottomColor}
              />
              {/* Right Wide Leg */}
              <path
                d={`M202 305 L${hipRight - 6} 295 Q${isFemale ? 258 : 250} 420 ${isFemale ? 265 : 260} 540 L208 545 L202 305 Z`}
                fill={bottomColor}
              />
              <path
                d={`M${isFemale ? 135 : 140} 540 L192 545 L208 545 L${isFemale ? 265 : 260} 540 L${hipRight - 6} 295 L${hipLeft + 6} 295 Z`}
                fill="url(#silkShine)"
                opacity="0.3"
              />
              {/* Center crease shadow */}
              <line x1="200" y1="315" x2="200" y2="520" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* --- INNER COLLAR (LỚP ÁO LÓT TRẮNG CỔ ĐỨNG TRUYỀN THỐNG) --- */}
        <g id="innerCollar">
          <path
            d="M188 140 C188 135 212 135 212 140 L214 156 L186 156 Z"
            fill={innerColor || '#FAF8F5'}
            stroke="#E5E0D8"
            strokeWidth="1.5"
          />
        </g>

        {/* --- MAIN OUTERWEAR (ÁO NGOÀI) --- */}
        <g id="outerwearLayer" filter="url(#softShadow)">
          {outerwear?.imageUrl ? (
            <g id="aiOuterwearFitted">
              <image
                href={outerwear.imageUrl}
                x={45 + (fitOffset?.x || 0)}
                y={135 + (fitOffset?.y || 0)}
                width={310 * (fitOffset?.scale || 1)}
                height={360 * (fitOffset?.scale || 1)}
                preserveAspectRatio="xMidYMid meet"
                className="transition-all duration-200"
              />
            </g>
          ) : outerId === 'ao_tac_ngu_than' ? (
            // Áo Tấc (Tay Thụng Rộng Quá Đầu Ngón Tay, Giơ Ngang Tay)
            <g>
              {/* Wide flowing horizontal sleeves (Thụng giơ ngang) */}
              {/* Left wide horizontal sleeve */}
              <path
                d={`M${shoulderLeft + 5} 160 L40 162 L35 295 L${shoulderLeft + 5} 235 Z`}
                fill={outerColor}
              />
              {/* Right wide horizontal sleeve */}
              <path
                d={`M${shoulderRight - 5} 160 L360 162 L365 295 L${shoulderRight - 5} 235 Z`}
                fill={outerColor}
              />
              {/* Main Body */}
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 155 Q200 150 ${shoulderRight} 155 L248 245 Q268 285 270 460 Q200 470 130 460 Q132 285 152 245 Z`
                    : `M${shoulderLeft} 155 Q200 148 ${shoulderRight} 155 L260 460 Q200 470 140 460 Z`
                }
                fill={outerColor}
              />
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 155 Q200 150 ${shoulderRight} 155 L248 245 Q268 285 270 460 Q200 470 130 460 Q132 285 152 245 Z`
                    : `M${shoulderLeft} 155 Q200 148 ${shoulderRight} 155 L260 460 Q200 470 140 460 Z`
                }
                fill="url(#silkShine)"
              />
              {/* High standing collar */}
              <path
                d="M186 138 Q200 134 214 138 L216 160 Q200 156 184 160 Z"
                fill={outerColor}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="1"
              />
              {/* Sloping button flap (vạt cài sang phải) */}
              <path
                d="M200 158 Q205 180 235 200 L238 290 L200 465"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              />
              {/* 5 Traditional Buttons (Ngũ Thường) */}
              {[
                { cx: 200, cy: 159 },
                { cx: 215, cy: 175 },
                { cx: 232, cy: 198 },
                { cx: 236, cy: 235 },
                { cx: 237, cy: 275 },
              ].map((btn, idx) => (
                <circle
                  key={idx}
                  cx={btn.cx}
                  cy={btn.cy}
                  r="3.5"
                  fill="#E9C46A"
                  stroke="#5C4033"
                  strokeWidth="1"
                />
              ))}
              {/* Horizontal sleeve cuff gold trim */}
              <path d="M40 162 L35 295" stroke="#E9C46A" strokeWidth="3.5" />
              <path d="M360 162 L365 295" stroke="#E9C46A" strokeWidth="3.5" />
            </g>
          ) : outerId === 'ao_nhat_binh_cung_dinh' ? (
            // Áo Nhật Bình (Cổ Hình Chữ Nhật Đặc Trưng & Tay Giơ Ngang Ngũ Sắc)
            <g>
              {/* Horizontal Sleeves */}
              <path
                d={`M${shoulderLeft + 4} 160 L50 165 L50 240 L${shoulderLeft + 4} 220 Z`}
                fill={outerColor}
              />
              <path
                d={`M${shoulderRight - 4} 160 L350 165 L350 240 L${shoulderRight - 4} 220 Z`}
                fill={outerColor}
              />
              {/* Main Body */}
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 155 L${shoulderRight} 155 L268 450 L132 450 Z`
                    : `M${shoulderLeft} 155 L${shoulderRight} 155 L260 450 L140 450 Z`
                }
                fill={outerColor}
              />
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 155 L${shoulderRight} 155 L268 450 L132 450 Z`
                    : `M${shoulderLeft} 155 L${shoulderRight} 155 L260 450 L140 450 Z`
                }
                fill="url(#silkShine)"
              />

              {/* Iconic Rectangular Collar (Cổ Chữ Nhật Nhật Bình) */}
              <path
                d="M182 145 L218 145 L222 310 L178 310 Z"
                fill="#C1121F"
                stroke="#E9C46A"
                strokeWidth="2.5"
              />
              {/* Five Color bands on cuffs (Ngũ sắc cổ tay giơ ngang) */}
              <g id="nhatBinhCuffs">
                <rect x="46" y="165" width="5" height="75" fill="#C1121F" />
                <rect x="51" y="165" width="5" height="75" fill="#E9C46A" />
                <rect x="56" y="165" width="5" height="75" fill="#1F3A4B" />
                <rect x="349" y="165" width="5" height="75" fill="#C1121F" />
                <rect x="344" y="165" width="5" height="75" fill="#E9C46A" />
                <rect x="339" y="165" width="5" height="75" fill="#1F3A4B" />
              </g>
              {/* Pearl button in collar center */}
              <circle cx="200" cy="230" r="5" fill="#FAF9F6" stroke="#C1121F" strokeWidth="1.5" />
            </g>
          ) : outerId === 'ao_tu_than_bac_bo' ? (
            // Áo Tứ Thân (Tay Giơ Ngang & Vạt Buộc Phía Trước Mộc Mạc)
            <g>
              {/* Horizontal Sleeves */}
              <path d={`M${shoulderLeft + 4} 162 L52 168 L55 218 L${shoulderLeft + 4} 205 Z`} fill={outerColor} />
              <path d={`M${shoulderRight - 4} 162 L348 168 L345 218 L${shoulderRight - 4} 205 Z`} fill={outerColor} />
              {/* Back panel */}
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 160 L${shoulderRight} 160 L262 480 L138 480 Z`
                    : `M${shoulderLeft} 160 L${shoulderRight} 160 L250 480 L150 480 Z`
                }
                fill={outerColor}
              />
              {/* Inner Yếm Visible */}
              <path d="M180 165 L220 165 L200 240 Z" fill="#EE6C4D" />
              {/* Tied Front Panels (Hai vạt trước buộc túm) */}
              <path
                d="M160 180 L195 260 L185 360 L170 365 Z"
                fill={outerColor}
                stroke="rgba(0,0,0,0.2)"
              />
              <path
                d="M240 180 L205 260 L215 360 L230 365 Z"
                fill={outerColor}
                stroke="rgba(0,0,0,0.2)"
              />
              {/* Waist ribbon tie */}
              <ellipse cx="200" cy="262" rx="14" ry="7" fill="#E9C46A" />
              <path d="M194 266 Q190 320 185 350" stroke="#E9C46A" strokeWidth="3" />
              <path d="M206 266 Q210 320 215 350" stroke="#E9C46A" strokeWidth="3" />
            </g>
          ) : (
            // Áo Ngũ Thân Tay Chẽn / Áo Dài Hiện Đại (Tay Giơ Ngang)
            <g>
              {/* Fitted Horizontal Sleeves (Tay Chẽn Giơ Ngang) */}
              <path
                d={`M${shoulderLeft} 160 L48 166 L50 208 L${shoulderLeft + 4} 205 Z`}
                fill={outerColor}
              />
              <path
                d={`M${shoulderRight} 160 L352 166 L350 208 L${shoulderRight - 4} 205 Z`}
                fill={outerColor}
              />
              {/* Sleek Long Tunic Body */}
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 155 Q200 150 ${shoulderRight} 155 L245 240 Q265 285 265 465 Q200 472 135 465 Q135 285 155 240 Z`
                    : `M${shoulderLeft} 155 Q200 148 ${shoulderRight} 155 L255 465 Q200 472 145 465 Z`
                }
                fill={outerColor}
              />
              <path
                d={
                  isFemale
                    ? `M${shoulderLeft} 155 Q200 150 ${shoulderRight} 155 L245 240 Q265 285 265 465 Q200 472 135 465 Q135 285 155 240 Z`
                    : `M${shoulderLeft} 155 Q200 148 ${shoulderRight} 155 L255 465 Q200 472 145 465 Z`
                }
                fill="url(#silkShine)"
              />
              {/* Stand Collar */}
              <path
                d="M186 138 Q200 134 214 138 L216 160 Q200 156 184 160 Z"
                fill={outerColor}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="1"
              />
              {/* Diagonal Button Flap to Right (Hữu nhậm) */}
              <path
                d="M198 158 Q210 180 236 195 L236 280 L200 465"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
              />
              {/* 5 Iconic Buttons */}
              {[
                { cx: 198, cy: 158 },
                { cx: 214, cy: 172 },
                { cx: 232, cy: 195 },
                { cx: 235, cy: 235 },
                { cx: 235, cy: 275 },
              ].map((btn, idx) => (
                <circle
                  key={idx}
                  cx={btn.cx}
                  cy={btn.cy}
                  r="3"
                  fill="#D4A373"
                  stroke="#333"
                  strokeWidth="0.8"
                />
              ))}
            </g>
          )}
        </g>

        {/* --- ACCESSORIES (PHỤ KIỆN) --- */}
        <g id="accessoryLayer">
          {accessoryId === 'khan_dong_ngu_than' ? (
            // Khăn Đóng / Khăn Xếp Quấn Nếp Chữ Nhân
            <g filter="url(#softShadow)">
              <path
                d="M172 85 Q200 70 228 85 L230 102 Q200 90 170 102 Z"
                fill={accessoryColor || '#1A1A1A'}
              />
              {/* Folds lines */}
              <path
                d="M173 88 Q200 74 227 88"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M172 93 Q200 79 228 93"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Central fold peak (Chữ Nhân) */}
              <polygon points="196,82 204,82 200,77" fill="#E9C46A" />
            </g>
          ) : accessoryId === 'kieng_bac_cham_hoa_sen' ? (
            // Kiềng Bạc Chạm Hoa Sen
            <g>
              <ellipse
                cx="200"
                cy="162"
                rx="24"
                ry="9"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3.5"
                filter="url(#softShadow)"
              />
              <circle cx="200" cy="170" r="3.5" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
            </g>
          ) : accessoryId === 'kinh_ram_cyber_oval' ? (
            // Kính Râm Oval Retro Gen Z
            <g filter="url(#softShadow)">
              <rect x="180" y="90" width="16" height="8" rx="4" fill="#1E293B" stroke="#D4A373" strokeWidth="1" />
              <rect x="204" y="90" width="16" height="8" rx="4" fill="#1E293B" stroke="#D4A373" strokeWidth="1" />
              <line x1="196" y1="94" x2="204" y2="94" stroke="#D4A373" strokeWidth="1.5" />
            </g>
          ) : accessoryId === 'non_quai_thao_mini' ? (
            // Nón Ba Tầm Quai Thao
            <g filter="url(#softShadow)">
              <ellipse cx="280" cy="220" rx="34" ry="12" fill="#E8D8C3" stroke="#B89F7D" strokeWidth="2" />
              {/* Quai thao ribbon hanging */}
              <path d="M270 230 Q265 290 260 350" stroke="#7209B7" strokeWidth="3" fill="none" />
              <path d="M290 230 Q285 290 280 350" stroke="#7209B7" strokeWidth="3" fill="none" />
            </g>
          ) : null}
        </g>

        {/* --- FOOTWEAR (GIÀY DÉP) --- */}
        {footwear && (
          <g id="footwearLayer" filter="url(#softShadow)">
            {footwear.id === 'guoc_moc_khac_hoa' ? (
              <g>
                <ellipse cx="168" cy="548" rx="18" ry="6" fill={footwearColor || '#5C4033'} />
                <path d="M156 546 Q168 538 180 546" stroke="#1A1A1A" strokeWidth="3" fill="none" />
                <ellipse cx="232" cy="548" rx="18" ry="6" fill={footwearColor || '#5C4033'} />
                <path d="M220 546 Q232 538 244 546" stroke="#1A1A1A" strokeWidth="3" fill="none" />
              </g>
            ) : (
              <g>
                <rect x="150" y="540" width="36" height="12" rx="5" fill={footwearColor || '#F8F9FA'} stroke="#DDD6CA" strokeWidth="1" />
                <line x1="150" y1="548" x2="186" y2="548" stroke="#1A1A1A" strokeWidth="1.5" />
                <rect x="214" y="540" width="36" height="12" rx="5" fill={footwearColor || '#F8F9FA'} stroke="#DDD6CA" strokeWidth="1" />
                <line x1="214" y1="548" x2="250" y2="548" stroke="#1A1A1A" strokeWidth="1.5" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
