import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, CheckIcon, XIcon } from '../../components/icons';

/* ─── Types ─── */
interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

/* ─── Chevron Icon ─── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <ChevronDownIcon
    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
  />
);

/* ─── Data ─── */
const sections: Section[] = [
  {
    id: 'acceptance',
    title: '1. Chấp nhận Điều khoản',
    content: (
      <div className="space-y-4">
        <p>
          Bằng cách truy cập và sử dụng nền tảng <strong>BookingHealth</strong> (bao gồm website tại{' '}
          <span className="text-primary font-medium">bookinghealth.vn</span> và ứng dụng di động),
          bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này.
        </p>
        <p>
          Nếu bạn không đồng ý với bất kỳ điều khoản nào trong tài liệu này, vui lòng không sử dụng
          dịch vụ của chúng tôi. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận mọi
          điều khoản hiện hành.
        </p>
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-5">
          <p className="font-bold text-foreground mb-1">Lưu ý quan trọng</p>
          <p>
            BookingHealth là nền tảng <strong>kết nối</strong> bệnh nhân với bác sĩ. Chúng tôi không
            cung cấp dịch vụ y tế trực tiếp và không chịu trách nhiệm về chất lượng khám chữa bệnh
            của bác sĩ.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'services',
    title: '2. Mô tả Dịch vụ',
    content: (
      <div className="space-y-4">
        <p>BookingHealth cung cấp các dịch vụ sau đây:</p>
        <ul className="space-y-3">
          {[
            {
              title: 'Đặt lịch khám trực tuyến',
              desc: 'Đặt lịch hẹn với bác sĩ một cách nhanh chóng, không cần xếp hàng.',
            },
            {
              title: 'Tìm kiếm bác sĩ',
              desc: 'Tìm bác sĩ theo chuyên khoa, khu vực, đánh giá và lịch trống.',
            },
            {
              title: 'AI Sàng lọc sức khoẻ',
              desc: 'Mô tả triệu chứng và nhận gợi ý chuyên khoa phù hợp từ hệ thống AI.',
            },
            {
              title: 'Chat sau khám',
              desc: 'Liên lạc trực tiếp với bác sĩ sau buổi khám qua hệ thống nhắn tin tích hợp.',
            },
            {
              title: 'Hồ sơ sức khoẻ cá nhân',
              desc: 'Lưu trữ và quản lý lịch sử khám bệnh, đơn thuốc và kết quả xét nghiệm.',
            },
            {
              title: 'Nhắc nhở lịch hẹn',
              desc: 'Thông báo tự động qua email và tin nhắn trước các lịch hẹn quan trọng.',
            },
          ].map((item) => (
            <li
              key={item.title}
              className="flex gap-4 p-4 bg-muted rounded-xl border border-border"
            >
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'eligibility',
    title: '3. Điều kiện sử dụng',
    content: (
      <div className="space-y-5">
        <div>
          <p className="font-semibold text-foreground mb-3">
            Để sử dụng BookingHealth, bạn phải đáp ứng các yêu cầu sau:
          </p>
          <ul className="space-y-2">
            {[
              'Từ 18 tuổi trở lên, hoặc có sự đồng ý của cha mẹ/người giám hộ hợp pháp.',
              'Cung cấp thông tin cá nhân chính xác, đầy đủ và cập nhật khi đăng ký tài khoản.',
              'Không sử dụng dịch vụ cho bất kỳ mục đích gian lận hoặc bất hợp pháp nào.',
              'Không chia sẻ thông tin đăng nhập tài khoản với bất kỳ bên thứ ba nào.',
              'Tuân thủ toàn bộ quy định pháp luật của nước Cộng hoà Xã hội Chủ nghĩa Việt Nam.',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-muted-foreground">
                <span className="w-5 h-5 rounded-full border-2 border-primary text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-3">Các hành vi nghiêm cấm:</p>
          <ul className="space-y-2">
            {[
              'Đặt lịch với mục đích quấy rối hoặc gây phiền toái cho bác sĩ và nhân viên y tế.',
              'Sử dụng thông tin y tế của người khác mà không có sự ủy quyền hợp lệ.',
              'Cố tình can thiệp, phá hoại hoặc làm gián đoạn hoạt động hệ thống.',
              'Đăng tải, chia sẻ thông tin sai lệch, giả mạo trên nền tảng.',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-muted-foreground">
                <span className="w-5 h-5 rounded-full border-2 border-red-400 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XIcon className="w-3 h-3" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'accounts',
    title: '4. Tài khoản người dùng',
    content: (
      <div className="space-y-4">
        <p>
          Khi đăng ký tài khoản trên BookingHealth, bạn có trách nhiệm duy trì tính bảo mật của
          thông tin đăng nhập. Bạn đồng ý thông báo ngay cho chúng tôi về bất kỳ hành vi truy cập
          trái phép nào vào tài khoản của bạn.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5">
          <p className="font-bold text-amber-800 mb-3">Khuyến nghị bảo mật tài khoản</p>
          <ul className="space-y-1.5 text-amber-700">
            <li>— Sử dụng mật khẩu mạnh, kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
            <li>— Không chia sẻ mật khẩu với bất kỳ ai, kể cả nhân viên BookingHealth.</li>
            <li>— Đăng xuất sau khi sử dụng trên các thiết bị dùng chung hoặc công cộng.</li>
            <li>— Bật xác thực 2 lớp (2FA) để tăng cường bảo mật nếu tính năng được hỗ trợ.</li>
          </ul>
        </div>
        <p>
          BookingHealth có quyền tạm dừng hoặc chấm dứt tài khoản nếu phát hiện hành vi vi phạm điều
          khoản dịch vụ, hoạt động gian lận, hoặc bất kỳ hành vi nào gây hại cho người dùng khác
          hoặc hệ thống.
        </p>
      </div>
    ),
  },
  {
    id: 'bookings',
    title: '5. Đặt lịch và Huỷ lịch',
    content: (
      <div className="space-y-5">
        <p>
          Khi đặt lịch khám qua BookingHealth, bạn đồng ý tuân thủ chính sách đặt lịch và hoàn tiền
          như sau:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="text-left p-4 font-semibold">Thời gian huỷ trước giờ hẹn</th>
                <th className="text-left p-4 font-semibold">Chính sách</th>
                <th className="text-left p-4 font-semibold">Hoàn tiền</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  time: 'Trước 24 giờ',
                  policy: 'Huỷ miễn phí hoàn toàn',
                  refund: '100%',
                  color: 'text-green-600',
                },
                {
                  time: 'Từ 4 đến 24 giờ',
                  policy: 'Áp dụng phí huỷ 20%',
                  refund: '80%',
                  color: 'text-amber-600',
                },
                {
                  time: 'Trong vòng 4 giờ',
                  policy: 'Áp dụng phí huỷ 50%',
                  refund: '50%',
                  color: 'text-orange-600',
                },
                {
                  time: 'Sau giờ hẹn',
                  policy: 'Không được hoàn tiền',
                  refund: '0%',
                  color: 'text-red-600',
                },
              ].map((row, i) => (
                <tr
                  key={row.time}
                  className={`border-t border-border ${i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                >
                  <td className="p-4 font-medium text-foreground">{row.time}</td>
                  <td className="p-4 text-muted-foreground">{row.policy}</td>
                  <td className={`p-4 font-bold ${row.color}`}>{row.refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Trong trường hợp bác sĩ là người huỷ lịch hẹn, bạn sẽ được hoàn tiền 100% và có quyền đặt
          lại lịch với bác sĩ khác mà không phát sinh bất kỳ chi phí nào.
        </p>
      </div>
    ),
  },
  {
    id: 'payments',
    title: '6. Thanh toán',
    content: (
      <div className="space-y-4">
        <p>
          BookingHealth hỗ trợ nhiều phương thức thanh toán an toàn và tiện lợi. Tất cả giao dịch
          được mã hoá theo tiêu chuẩn bảo mật <strong>PCI DSS</strong>. Chúng tôi không lưu trữ
          thông tin thẻ thanh toán trực tiếp trên hệ thống.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Thẻ ngân hàng nội địa (ATM)',
            'Thẻ quốc tế Visa / Mastercard',
            'Ví điện tử Momo, ZaloPay, VNPay',
            'Chuyển khoản ngân hàng',
          ].map((method) => (
            <div
              key={method}
              className="flex items-center gap-3 p-4 bg-muted rounded-xl border border-border"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="font-medium text-foreground">{method}</span>
            </div>
          ))}
        </div>
        <p>
          Giá dịch vụ sẽ được hiển thị rõ ràng trước khi bạn xác nhận đặt lịch. Chúng tôi không chịu
          trách nhiệm về các khoản phí giao dịch phát sinh từ phía ngân hàng hoặc ví điện tử của
          bạn.
        </p>
      </div>
    ),
  },
  {
    id: 'medical-disclaimer',
    title: '7. Tuyên bố Y tế',
    content: (
      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="font-bold text-red-700 mb-2">Cảnh báo khẩn cấp</p>
          <p className="text-red-600">
            BookingHealth <strong>KHÔNG PHẢI</strong> là dịch vụ y tế khẩn cấp. Trong trường hợp cấp
            cứu, hãy gọi ngay <strong>115</strong> hoặc đến cơ sở y tế gần nhất.
          </p>
        </div>
        <p>
          Nội dung thông tin y tế được cung cấp trên nền tảng chỉ mang tính chất tham khảo và không
          thể thay thế lời khuyên, chẩn đoán hoặc điều trị từ bác sĩ có chuyên môn. Chúng tôi luôn
          khuyến khích bạn tham khảo ý kiến chuyên gia y tế cho mọi vấn đề sức khoẻ.
        </p>
        <p>BookingHealth không chịu trách nhiệm pháp lý về:</p>
        <ul className="space-y-2">
          {[
            'Chất lượng dịch vụ y tế và kết quả điều trị của bác sĩ trên nền tảng.',
            'Thông tin y tế không chính xác từ bên thứ ba.',
            'Quyết định y tế bạn đưa ra dựa trên kết quả gợi ý của AI Sàng lọc.',
            'Bất kỳ tác hại nào phát sinh từ việc sử dụng thông tin y tế trên nền tảng.',
          ].map((item) => (
            <li key={item} className="flex gap-3 text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'privacy',
    title: '8. Quyền riêng tư',
    content: (
      <div className="space-y-4">
        <p>
          Việc thu thập và xử lý dữ liệu cá nhân của bạn được điều chỉnh bởi{' '}
          <Link
            to="/privacy"
            className="text-primary font-semibold underline hover:text-primary-hover"
          >
            Chính sách Bảo mật
          </Link>{' '}
          của BookingHealth — là một phần không tách rời của Điều khoản Dịch vụ này.
        </p>
        <p>
          Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu y tế của bạn theo các tiêu chuẩn bảo
          mật cao nhất, tuân thủ đầy đủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân tại Việt
          Nam.
        </p>
      </div>
    ),
  },
  {
    id: 'ip',
    title: '9. Sở hữu trí tuệ',
    content: (
      <div className="space-y-4">
        <p>
          Toàn bộ nội dung, thiết kế, logo, nhãn hiệu, phần mềm và tài liệu trên nền tảng
          BookingHealth là tài sản trí tuệ thuộc sở hữu của BookingHealth và được bảo vệ theo pháp
          luật Việt Nam về sở hữu trí tuệ.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 bg-muted rounded-xl border border-border">
            <p className="font-bold text-foreground mb-3">Được phép</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>— Sử dụng dịch vụ cho mục đích cá nhân, phi thương mại.</li>
              <li>— Chia sẻ liên kết đến các trang trên website.</li>
              <li>— In ấn nội dung để sử dụng cá nhân.</li>
            </ul>
          </div>
          <div className="p-5 bg-red-50 rounded-xl border border-red-100">
            <p className="font-bold text-red-700 mb-3">Không được phép</p>
            <ul className="space-y-1.5 text-red-600">
              <li>— Sao chép, tái bản nội dung để khai thác thương mại.</li>
              <li>— Dịch ngược, giải mã hoặc phân tích mã nguồn phần mềm.</li>
              <li>— Sử dụng logo, nhãn hiệu BookingHealth khi chưa được cấp phép.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'termination',
    title: '10. Chấm dứt Dịch vụ',
    content: (
      <div className="space-y-4">
        <p>
          BookingHealth có quyền, theo quyết định riêng của mình, tạm dừng hoặc chấm dứt quyền truy
          cập dịch vụ của bạn mà không cần thông báo trước trong các trường hợp: vi phạm Điều khoản
          Dịch vụ, hành vi gian lận, hoặc hành vi gây hại đến người dùng khác hay hệ thống.
        </p>
        <p>
          Bạn có thể yêu cầu xoá tài khoản và toàn bộ dữ liệu của mình bất cứ lúc nào bằng cách liên
          hệ với chúng tôi qua email{' '}
          <a
            href="mailto:support@bookinghealth.vn"
            className="text-primary font-semibold underline hover:text-primary-hover"
          >
            support@bookinghealth.vn
          </a>
          . Chúng tôi sẽ xử lý yêu cầu trong vòng 30 ngày làm việc.
        </p>
      </div>
    ),
  },
  {
    id: 'changes',
    title: '11. Thay đổi Điều khoản',
    content: (
      <div className="space-y-4">
        <p>
          Chúng tôi có quyền sửa đổi Điều khoản Dịch vụ này bất cứ lúc nào. Khi có thay đổi quan
          trọng ảnh hưởng đến quyền lợi của bạn, chúng tôi sẽ thông báo qua email đã đăng ký hoặc
          hiển thị thông báo nổi bật trên nền tảng trước ít nhất 15 ngày.
        </p>
        <p>
          Việc tiếp tục sử dụng dịch vụ sau ngày có hiệu lực đồng nghĩa với việc bạn chấp nhận Điều
          khoản mới. Phiên bản mới nhất luôn được cập nhật tại trang này kèm theo ngày có hiệu lực.
        </p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '12. Liên hệ',
    content: (
      <div className="space-y-4">
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Dịch vụ này, vui lòng liên hệ với chúng tôi:
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Email pháp lý',
              value: 'legal@bookinghealth.vn',
              href: 'mailto:legal@bookinghealth.vn',
            },
            { label: 'Đường dây miễn phí', value: '1800 1234', href: 'tel:18001234' },
            { label: 'Địa chỉ văn phòng', value: 'TP. Đà Nẵng, Việt Nam', href: null },
          ].map((item) => (
            <div key={item.label} className="p-5 bg-muted rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="font-bold text-primary hover:underline">
                  {item.value}
                </a>
              ) : (
                <p className="font-bold text-foreground">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

/* ─── Component ─── */
const TermsOfService = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['acceptance']));

  useEffect(() => {
    document.title = 'Điều khoản Dịch vụ | BookingHealth';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(sections.map((s) => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero ─── */}
      <section className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-16">
          <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-widest mb-2">
            BookingHealth
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            Điều khoản
            <br />
            Dịch vụ
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-2xl mb-5">
            Vui lòng đọc kỹ trước khi sử dụng dịch vụ. Bằng cách đăng ký tài khoản và sử dụng nền
            tảng, bạn đồng ý tuân thủ toàn bộ các điều khoản dưới đây.
          </p>
          <div className="flex flex-wrap gap-5 text-white/60 text-xs">
            <span>Cập nhật lần cuối: 09/06/2026</span>
            <span>Phiên bản 2.0</span>
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{sections.length}</span> điều khoản
          </p>
          <div className="flex gap-3">
            <button
              onClick={expandAll}
              className="text-sm font-semibold text-primary hover:underline cursor-pointer"
            >
              Mở tất cả
            </button>
            <span className="text-border">|</span>
            <button
              onClick={collapseAll}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
            >
              Đóng tất cả
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => {
            const isOpen = openSections.has(section.id);
            return (
              <div
                key={section.id}
                id={section.id}
                className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? 'border-primary/30 shadow-sm' : 'border-border'
                }`}
              >
                {/* Header */}
                <button
                  id={`terms-toggle-${section.id}`}
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer transition-colors duration-200 ${
                    isOpen ? 'bg-primary/5' : 'bg-background hover:bg-muted/60'
                  }`}
                >
                  <h2
                    className={`text-sm font-bold leading-snug transition-colors duration-200 ${
                      isOpen ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {section.title}
                  </h2>
                  <ChevronIcon open={isOpen} />
                </button>

                {/* Body */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-4 border-t border-border text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-4">
            Có thắc mắc? Liên hệ{' '}
            <a
              href="mailto:legal@bookinghealth.vn"
              className="text-primary font-semibold underline"
            >
              legal@bookinghealth.vn
            </a>{' '}
            hoặc gọi{' '}
            <a href="tel:18001234" className="text-primary font-semibold underline">
              1800 1234
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/privacy" className="btn btn-primary btn-sm">
              Xem Chính sách Bảo mật
            </Link>
            <Link to="/" className="btn btn-outline btn-sm">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
