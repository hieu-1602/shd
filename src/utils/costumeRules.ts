import { CostumeItem, EventOccasion, ColorHarmonyResult, CulturalCheckResult } from '../types/vietphuc';

// Ngũ Hành Mapping for Colors
// Kim: Trắng, Xám, Bạc, Vàng kim
// Thủy: Đen, Xanh lam, Xanh chàm, Xanh biển
// Mộc: Xanh lá, Xanh ngọc, Rêu
// Hỏa: Đỏ, Cam, Hồng, Tím
// Thổ: Nâu, Vàng đất, Be, Cát

export function analyzeColorHarmony(
  color1: string,
  color2: string,
  color3?: string
): ColorHarmonyResult {
  // Simple heuristic algorithm based on RGB delta, lightness and harmony types
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  // Compute contrast ratio
  const lum1 = (0.299 * c1.r + 0.587 * c1.g + 0.114 * c1.b) / 255;
  const lum2 = (0.299 * c2.r + 0.587 * c2.g + 0.114 * c2.b) / 255;
  const contrast = Math.abs(lum1 - lum2);

  let score = 88;
  let title = 'Bảng Màu Hài Hòa & Thanh Lịch';
  let elementTheory = 'Tương Sinh Ngũ Hành & Cân Bằng Âm Dương';
  const recommendations: string[] = [];

  if (contrast > 0.45) {
    score = 96;
    title = 'Tương Phản Đẳng Cấp (High Contrast Editorial)';
    elementTheory = 'Thấu triệt nguyên lý "Âm - Dương bổ trợ": Nền tối làm bừng sáng chi tiết rực rỡ, hoặc áo sáng kết hợp quần tối màu tôn vinh phom dáng cao ráo.';
    recommendations.push('Độ tương phản cao tạo ấn tượng thị giác mạnh mẽ cho các bức ảnh thời trang và sân khấu.');
    recommendations.push('Khuyên dùng thêm phụ kiện ánh bạc hoặc vàng nhạt để kết nối hai mảng màu liền mạch.');
  } else if (contrast < 0.2) {
    score = 92;
    title = 'Đồng Điệu Tinh Tế (Tone-Sur-Tone / Monochromatic)';
    elementTheory = 'Phối màu đơn sắc truyền thống: Phong cách quý phái của cung đình xưa, nơi màu áo và màu quần cùng sắc độ để tạo sự trang trọng, quyền uy.';
    recommendations.push('Phù hợp cho không gian tiệc cưới, lễ tốt nghiệp hoặc những dịp trang trọng đòi hỏi sự nhã nhặn.');
    recommendations.push('Nên phối chất liệu khác biệt (như gấm nhám đi cùng lụa bóng) để tạo chiều sâu thị giác.');
  } else {
    score = 90;
    title = 'Bổ Trợ Nhã Nhặn (Harmonious Modern)';
    elementTheory = 'Màu sắc thiên nhiên mộc mạc: Gợi liên tưởng đến sắc màu củ nâu, cỏ cây, nước phù sa và nắng vàng mùa gặt Bắc Bộ.';
    recommendations.push('Rất tôn da người Việt và mang lại cảm giác ấm áp, thân thiện khi dạo phố.');
  }

  return {
    score,
    title,
    assessment: `Sự kết hợp giữa gam màu chủ đạo (${color1}) và màu bổ trợ (${color2}) đạt chuẩn mực thẩm mỹ cao.`,
    elementTheory,
    recommendations,
  };
}

export function auditCulturalEtiquette(
  outerwear?: CostumeItem,
  bottom?: CostumeItem,
  accessory?: CostumeItem,
  footwear?: CostumeItem,
  occasion?: EventOccasion | string
): CulturalCheckResult {
  const warnings: string[] = [];
  const praises: string[] = [];
  const etiquetteTips: string[] = [];

  // Default praises
  if (outerwear) {
    praises.push(`Bạn đã chọn "${outerwear.name}", một di sản quý báu từ ${outerwear.era}.`);
  }

  // Specific rule checks
  if (outerwear?.id === 'ao_ngu_than_tay_chen') {
    etiquetteTips.push('Cài cúc vạt sang bên phải (cổ áo cài sang phải). Tuyệt đối tránh cài cúc sang trái.');
    if (footwear?.id === 'sneaker_chunky_minimal') {
      praises.push('Phối Áo Ngũ Thân với Sneaker trắng ngà là bản phối Gen Z tiêu biểu được đánh giá cao về tính năng động mà vẫn giữ được sự lịch sự.');
    }
  }

  if (outerwear?.id === 'ao_tac_ngu_than') {
    etiquetteTips.push('Áo Tấc là thường lễ phục nghiêm trang. Khi đứng chụp ảnh hoặc làm lễ, hãy khép nhẹ hai tay đan trước bụng để ống tay áo buông tự nhiên.');
    if (occasion === 'Dạo Phố & Cafe') {
      warnings.push('Áo Tấc có tay thụng dài dễ chạm vào bàn hoặc đồ ăn khi đi cà phê; nếu dạo phố, Áo Ngũ Thân tay chẽn sẽ thuận tiện di chuyển hơn.');
    } else {
      praises.push(`Áo Tấc cực kỳ chuẩn mực và được tôn vinh khi diện trong "${occasion}".`);
    }
  }

  if (outerwear?.id === 'ao_nhat_binh_cung_dinh') {
    etiquetteTips.push('Áo Nhật Bình có điểm nhấn cốt lõi là hoa văn dải cổ hình chữ nhật trước ngực. Tránh cài hoa cài áo đè lên dải cổ này.');
    if (accessory?.id === 'kinh_ram_cyber_oval' && occasion === 'Tiệc Cưới & Dự Lễ') {
      warnings.push('Kính râm thời trang phù hợp cho dạo phố/chụp ảnh kỷ yếu ngoài trời, nhưng khi dự tiệc cưới trang nghiêm nên tháo kính để giữ sự lịch thiệp.');
    }
  }

  if (outerwear?.id === 'ao_tu_than_bac_bo') {
    etiquetteTips.push('Hai vạt trước của Áo Tứ Thân buộc nhẹ trước bụng, vạt áo buông rủ mộc mạc. Không nên buộc quá cao hở phần eo.');
    if (accessory?.id === 'non_quai_thao_mini') {
      praises.push('Sự đồng điệu tuyệt vời giữa Áo Tứ Thân và Nón Quai Thao đặc trưng vùng văn hóa Kinh Bắc.');
    }
  }

  // Bottom wear checks
  if (bottom?.id === 'chan_vay_xep_ly_genz' && outerwear?.id === 'ao_ngu_than_tay_chen') {
    praises.push('Cách điệu phá cách giữa áo ngũ thân và chân váy xếp ly tạo nét uyển chuyển bay bổng, thanh lịch.');
  }

  // Default etiquette if empty
  if (etiquetteTips.length === 0) {
    etiquetteTips.push('Tôn trọng phom dáng nguyên bản của cổ phục; tự tin thể hiện cá tính hiện đại mà không làm biến dạng cấu trúc văn hóa.');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    praises,
    etiquetteTips,
  };
}
