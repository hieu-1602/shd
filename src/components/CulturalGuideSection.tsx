import React, { useState } from 'react';
import { BookOpen, AlertTriangle, ShieldCheck, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

export const CulturalGuideSection: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const guideItems = [
    {
      title: '1. Quy Tắc Vàng: Cài Cúc Sang Bên Phải (Hữu Nhậm)',
      summary: 'Quy chuẩn sinh tử phân minh trong cổ phục của người Việt.',
      content:
        'Tất cả các loại áo cổ truyền Việt Nam (Giao lĩnh, Ngũ thân, Áo tấc, Áo Nhật bình, Áo dài) đều cài cúc hoặc vắt vạt sang bên nách phải (Hữu nhậm - 右衽). Tuyệt đối KHÔNG cài cúc hoặc đè vạt sang bên trái (Tả nhậm), vì theo phong tục ngàn năm, chỉ có y phục người quá cố (đồ khâm liệm/đồ tang) mới cài sang trái. Đây là lỗi sai cấm kỵ hàng đầu mà người trẻ cần nắm vững.',
    },
    {
      title: '2. Phân Biệt Áo Ngũ Thân Tay Chẽn và Áo Tấc',
      summary: 'Hai biến thể cùng một hệ thống nhưng công năng hoàn toàn khác nhau.',
      content:
        'Cả hai đều có cấu trúc 5 thân, 5 cúc cài. Tuy nhiên: Áo Ngũ Thân Tay Chẽn có ống tay áo ôm gọn gàng từ khuỷu tay đến cổ tay, dùng trong đời sống thường nhật, công sở, dạo phố năng động. Ngược lại, Áo Tấc là áo ngũ thân có ống tay thụng rộng, dài bằng hoặc quá đầu ngón tay khi buông xuôi, là thường lễ phục trang trọng dùng trong các dịp cưới hỏi, tế lễ, lễ tốt nghiệp, bái tổ đường.',
    },
    {
      title: '3. Áo Nhật Bình: Nét Quý Phái Cung Đình & Hoa Văn Chữ Nhật',
      summary: 'Trang phục triều đình với dải cổ chữ nhật và ngũ sắc đặc trưng.',
      content:
        'Áo Nhật Bình là thường phục của Hoàng hậu, Công chúa và Cung tần triều Nguyễn. Đặc điểm nhận dạng là dải cổ áo hình chữ nhật viền trước ngực, phối các dải hoa văn ngũ hành ở cổ tay. Khi phối kiểu Gen Z (như mặc khoác ngoài hoặc phối cùng váy suông), người mặc cần giữ nguyên vẹn hoa văn viền cổ, không đính ghim hoặc phụ kiện rườm rà làm che khuất dải chữ nhật linh thiêng này.',
    },
    {
      title: '4. Ý Nghĩa Của 5 Thân Áo & 5 Nút Cài (Ngũ Thường)',
      summary: 'Triết lý gia đình và nhân cách làm người được dệt thành tấm áo.',
      content:
        'Năm thân áo tượng trưng cho Tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ vợ/chồng) che chở cho thân con bên trong (chính là người mặc). Năm chiếc cúc áo tượng trưng cho 5 đức tính nền tảng của con người: NHÂN (yêu thương), LỄ (cung kính lễ phép), NGHĨA (chính trực), TRÍ (sáng suốt), TÍN (giữ lời hứa). Khi mặc áo ngũ thân, người trẻ khoác lên mình cả đạo lý làm người sâu sắc.',
    },
    {
      title: '5. Cách Phối Gen Z Tôn Trọng Di Sản (Do & Don’t)',
      summary: 'Tự do sáng tạo phong cách nhưng không đánh mất cốt cách văn hóa.',
      content:
        'NÊN: Phối áo ngũ thân với giày sneaker trắng tối giản, quần tây ống suông hoặc chân váy xếp ly; kết hợp túi tote dệt lụa, kính mắt retro cho buổi dạo phố, chụp ảnh kỷ yếu. KHÔNG NÊN: Xuyên thấu hở hang không mặc áo lót; mặc áo tấc lễ phục đến những nơi bar/pub ồn ào; biến dạng phom dáng cổ áo; in thêu hoa văn linh vật (rồng, phượng, kỳ lân) sai quy cách.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="pb-8 border-b border-[#EAE6DF]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E2A2B]">
          Di Sản Văn Hóa & Lịch Sử
        </span>
        <h2 className="text-3xl md:text-4xl font-normal text-[#1A1918] font-display mt-1">
          Cẩm Nang Quy Chuẩn Cổ Phục
        </h2>
        <p className="text-sm text-[#57534E] mt-1.5 max-w-2xl leading-relaxed">
          Sáng tạo đương đại chỉ thực sự có giá trị khi được xây dựng trên sự thấu hiểu và tôn trọng.
          Dưới đây là các nguyên tắc cốt lõi giúp tất cả mọi người tự tin mặc đẹp và chuẩn mực.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Column: Interactive Accordion Guide */}
        <div className="lg:col-span-8 space-y-3">
          {guideItems.map((item, index) => {
            const isOpen = openAccordion === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#E7E2D8] rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenAccordion(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors"
                >
                  <div>
                    <h3 className="text-base font-bold text-[#1A1918] font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#78716C] mt-1">{item.summary}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#78716C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#9E2A2B]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-[#57534E] leading-relaxed border-t border-[#F2EFE9] bg-[#FAF9F6]">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Quick Etiquette Box & Cultural Safeguard Commitment */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#9E2A2B]">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold text-[#1A1918]">Cam Kết Bảo Tồn Bản Sắc</h4>
            </div>

            <p className="text-xs text-[#57534E] leading-relaxed">
              Trang web "Cổ Phục Remix" hoạt động với tôn chỉ giáo dục và quảng bá di sản. Mọi
              thông tin đều được đối chiếu từ các nguồn khảo cứu uy tín (khảo cứu của học giả
              Trần Đình Sơn, nhà nghiên cứu Trịnh Bách, trang phục triều Nguyễn của Trung tâm Bảo tồn
              Di tích Cố đô Huế).
            </p>

            <div className="pt-3 border-t border-[#EAE6DF] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#2D6A4F]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Tôn trọng phom dáng và đường kim mũi chỉ truyền thống</span>
              </div>
              <div className="flex items-start gap-2 text-[#2D6A4F]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Không thương mại hóa hay trục lợi từ văn hóa dân tộc</span>
              </div>
              <div className="flex items-start gap-2 text-[#2D6A4F]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Đồng hành cùng mọi thế hệ trong hành trình tìm về văn hóa cội nguồn</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E7E2D8] rounded-xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Ghi Nhớ Khi Thử Đồ</span>
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Khi thử phối đồ tại Studio, hệ thống sẽ tự động quét màu sắc và phụ kiện để đưa ra lời
              nhắc nhở nếu bản phối có nguy cơ xung đột với nghi lễ trang nghiêm. Hãy xem đây là bạn
              đồng hành hỗ trợ bạn tự tin nhất!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
