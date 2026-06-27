import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── Component ─── */
const About = () => {
  useEffect(() => {
    document.title = 'Về Chúng Tôi | BookingHealth';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero ─── */}
      <section className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-16">
          <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-widest mb-2">
            BookingHealth
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            Về Chúng Tôi
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-2xl mb-5">
            BookingHealth là nền tảng y tế số kết nối bệnh nhân với bác sĩ uy tín trên toàn quốc,
            giúp việc đặt lịch khám trở nên đơn giản, nhanh chóng và minh bạch hơn bao giờ hết.
          </p>
          <div className="flex flex-wrap gap-5 text-white/60 text-xs">
            <span>Thành lập: 2024</span>
            <span>Trụ sở: TP. Đà Nẵng, Việt Nam</span>
            <span>Giấy phép số: 01/2024/GPKD</span>
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 md:py-16 space-y-14">
        {/* ─── Sứ mệnh & Tầm nhìn ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            Sứ mệnh &amp; Tầm nhìn
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-xl border border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Sứ mệnh
              </p>
              <p className="text-foreground font-semibold text-base leading-relaxed mb-3">
                Xóa bỏ rào cản tiếp cận dịch vụ y tế chất lượng cao
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Chúng tôi tin rằng mỗi người dân Việt Nam đều có quyền tiếp cận dịch vụ y tế một
                cách thuận tiện, minh bạch và đáng tin cậy — dù ở thành thị hay vùng xa.
                BookingHealth ra đời để hiện thực hoá điều đó thông qua công nghệ.
              </p>
            </div>
            <div className="p-6 bg-muted rounded-xl border border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                Tầm nhìn
              </p>
              <p className="text-foreground font-semibold text-base leading-relaxed mb-3">
                Trở thành hệ sinh thái y tế số hàng đầu Đông Nam Á vào 2030
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Chúng tôi hướng tới xây dựng một nền tảng y tế toàn diện — từ đặt lịch khám, quản lý
                hồ sơ sức khoẻ, đến tư vấn trực tuyến và chăm sóc sau khám — phục vụ hàng triệu
                người dùng trên toàn khu vực.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Câu chuyện ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            Câu chuyện của chúng tôi
          </h2>
          <div className="space-y-5 text-muted-foreground text-sm leading-relaxed">
            <p>
              BookingHealth được thành lập năm 2024 bởi một nhóm kỹ sư phần mềm và bác sĩ trẻ tại Đà
              Nẵng, những người đã tận mắt chứng kiến sự bất tiện mà bệnh nhân phải đối mặt hàng
              ngày: xếp hàng nhiều giờ, không biết bác sĩ nào phù hợp, thông tin lịch hẹn thiếu minh
              bạch.
            </p>
            <p>
              Xuất phát từ nhu cầu thực tế đó, chúng tôi bắt đầu xây dựng một nền tảng đơn giản —
              nơi bệnh nhân có thể tìm kiếm bác sĩ theo chuyên khoa, đọc đánh giá từ cộng đồng, và
              đặt lịch chỉ trong vài bước. Nền tảng không ngừng phát triển nhờ phản hồi từ hàng
              nghìn người dùng thực tế.
            </p>
            <p>
              Ngày nay, BookingHealth phục vụ hàng chục nghìn lượt đặt lịch mỗi tháng với đội ngũ
              hơn 50 thành viên và mạng lưới gần 500 bác sĩ, bệnh viện, phòng khám trên cả nước.
            </p>
          </div>
        </section>

        {/* ─── Con số ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            BookingHealth qua các con số
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="text-left p-4 font-semibold">Chỉ số</th>
                  <th className="text-left p-4 font-semibold">Hiện tại</th>
                  <th className="text-left p-4 font-semibold">Mục tiêu 2026</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Bác sĩ và chuyên gia y tế', current: 'Gần 500', target: '2.000+' },
                  { metric: 'Bệnh viện & Phòng khám đối tác', current: '80+', target: '300+' },
                  { metric: 'Lượt đặt lịch mỗi tháng', current: '50.000+', target: '200.000+' },
                  { metric: 'Người dùng đã đăng ký', current: '120.000+', target: '500.000+' },
                  { metric: 'Chuyên khoa có trên nền tảng', current: '35', target: '60+' },
                  {
                    metric: 'Điểm hài lòng trung bình (5 sao)',
                    current: '4,7 / 5',
                    target: '4,8 / 5',
                  },
                ].map((row, i) => (
                  <tr
                    key={row.metric}
                    className={`border-t border-border ${i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                  >
                    <td className="p-4 font-semibold text-foreground">{row.metric}</td>
                    <td className="p-4 text-secondary font-bold">{row.current}</td>
                    <td className="p-4 text-muted-foreground">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Giá trị cốt lõi ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            Giá trị cốt lõi
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Tin cậy',
                desc: 'Mọi bác sĩ trên nền tảng đều được xác minh giấy phép hành nghề, bằng cấp chuyên môn và lịch sử hành nghề. Chúng tôi không đăng tải thông tin chưa được kiểm chứng.',
              },
              {
                title: 'Minh bạch',
                desc: 'Giá khám, thời gian chờ, chính sách huỷ lịch — tất cả được hiển thị rõ ràng trước khi bệnh nhân xác nhận đặt lịch. Không phí ẩn, không điều khoản mập mờ.',
              },
              {
                title: 'Bảo mật dữ liệu y tế',
                desc: 'Hồ sơ sức khoẻ và lịch sử khám của người dùng được mã hoá AES-256, tuân thủ đầy đủ Nghị định 13/2023/NĐ-CP. Dữ liệu y tế không bao giờ được bán hay chia sẻ vì mục đích thương mại.',
              },
              {
                title: 'Lấy bệnh nhân làm trung tâm',
                desc: 'Mọi quyết định thiết kế sản phẩm đều bắt đầu từ câu hỏi: "Điều này có thực sự giúp ích cho bệnh nhân không?" Chúng tôi lắng nghe phản hồi và cải tiến liên tục.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-muted border-b border-border">
                  <p className="font-bold text-foreground">{item.title}</p>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Đội ngũ lãnh đạo ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            Đội ngũ lãnh đạo
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="text-left p-4 font-semibold">Họ và tên</th>
                  <th className="text-left p-4 font-semibold">Chức vụ</th>
                  <th className="text-left p-4 font-semibold">Chuyên môn</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Đỗ Hùng Quốc Khánh',
                    role: 'CEO & Đồng sáng lập',
                    expertise: 'Kỹ sư phần mềm, 10 năm kinh nghiệm trong lĩnh vực y tế số',
                  },
                  {
                    name: 'BS. Võ Mạnh Quang',
                    role: 'Giám đốc Y tế (CMO)',
                    expertise: 'Bác sĩ Nội khoa, cố vấn chuyên môn và đảm bảo chất lượng y tế',
                  },
                  {
                    name: 'Nguyễn Mạnh Tuấn',
                    role: 'CTO & Đồng sáng lập',
                    expertise: 'Kiến trúc hệ thống, bảo mật dữ liệu và hạ tầng đám mây',
                  },
                  {
                    name: 'Trần Đình Việt',
                    role: 'Giám đốc Vận hành (COO)',
                    expertise: 'Quản lý đối tác bệnh viện, quy trình và mở rộng thị trường',
                  },
                ].map((person, i) => (
                  <tr
                    key={person.name}
                    className={`border-t border-border ${i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                  >
                    <td className="p-4 font-semibold text-foreground">{person.name}</td>
                    <td className="p-4">
                      <span className="badge bg-primary/10 text-primary">{person.role}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{person.expertise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Đối tác & Chứng nhận ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            Đối tác &amp; Chứng nhận
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-foreground mb-4">Đối tác y tế tiêu biểu</p>
              <ul className="space-y-3">
                {[
                  'Bệnh viện Đà Nẵng',
                  'Bệnh viện C Đà Nẵng',
                  'Phòng khám Đa khoa Hoàn Mỹ',
                  'Hệ thống phòng khám Thu Cúc',
                  'Bệnh viện Trung ương Huế',
                ].map((partner) => (
                  <li
                    key={partner}
                    className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-foreground font-medium">{partner}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-4">Giấy phép &amp; Chứng nhận</p>
              <div className="space-y-3">
                {[
                  {
                    cert: 'Giấy phép kinh doanh',
                    detail: 'Sở KH&ĐT TP. Đà Nẵng — Số 01/2024/GPKD',
                  },
                  { cert: 'Giấy phép hoạt động y tế', detail: 'Bộ Y tế Việt Nam — Cấp 06/2024' },
                  {
                    cert: 'Chứng nhận bảo mật ISO 27001',
                    detail: 'Tổ chức TÜV Rheinland — Hợp lệ đến 2027',
                  },
                  { cert: 'Tuân thủ PCI DSS Level 2', detail: 'Bảo mật thanh toán thẻ quốc tế' },
                  {
                    cert: 'Nghị định 13/2023/NĐ-CP',
                    detail: 'Bảo vệ dữ liệu cá nhân theo pháp luật VN',
                  },
                ].map((item) => (
                  <div key={item.cert} className="p-4 bg-muted rounded-xl border border-border">
                    <p className="font-semibold text-foreground text-sm">{item.cert}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Thông tin liên hệ ─── */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border">
            Liên hệ với chúng tôi
          </h2>
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-5 bg-muted border-b border-border">
              <p className="font-bold text-foreground text-base">
                BookingHealth — Công ty Cổ phần Công nghệ Y tế Việt
              </p>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  label: 'Trụ sở chính',
                  value: '27 Sơn thủy 2, Ngũ Hành Sơn, TP. Đà Nẵng',
                  href: null,
                },

                {
                  label: 'Email hợp tác',
                  value: 'dokhanhh12.2@gmail.com',
                  href: 'mailto:dokhanhh12.2@gmail.com',
                },
                { label: 'Đường dây miễn phí', value: '1800 1234', href: 'tel:18001234' },
                {
                  label: 'Giờ làm việc',
                  value: 'Thứ Hai – Thứ Sáu: 8:00 – 17:30 (GMT+7)',
                  href: null,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 border-b border-border last:border-0 pb-4 last:pb-0"
                >
                  <p className="text-muted-foreground text-sm min-w-[200px]">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-bold text-primary hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-foreground">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ghi chú bổ sung */}
          <div className="mt-5 bg-primary/5 border-l-4 border-primary rounded-r-xl p-5">
            <p className="font-bold text-foreground mb-1">Hợp tác bác sĩ &amp; Phòng khám</p>
            <p className="text-sm text-muted-foreground">
              Nếu bạn là bác sĩ hoặc cơ sở y tế muốn tham gia mạng lưới BookingHealth, vui lòng gửi
              hồ sơ về{' '}
              <a
                href="mailto:partner@bookinghealth.vn"
                className="text-primary font-semibold underline"
              >
                partner@bookinghealth.vn
              </a>
              . Đội ngũ của chúng tôi sẽ liên hệ trong vòng 3 ngày làm việc.
            </p>
          </div>
        </section>

        {/* ─── Footer Links ─── */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/terms" className="btn btn-primary btn-sm">
              Điều khoản Dịch vụ
            </Link>
            <Link to="/privacy" className="btn btn-outline btn-sm">
              Chính sách Bảo mật
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

export default About;
