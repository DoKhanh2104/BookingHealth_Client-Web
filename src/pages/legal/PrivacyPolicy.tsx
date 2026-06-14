import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── Types ─── */
interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

/* ─── Chevron Icon ─── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

/* ─── Data ─── */
const sections: Section[] = [
  {
    id: 'overview',
    title: '1. Tổng quan',
    content: (
      <div className="space-y-4">
        <p>
          Chính sách Bảo mật này mô tả cách <strong>BookingHealth</strong> thu thập, sử dụng, lưu
          trữ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng nền tảng của chúng tôi tại{' '}
          <span className="text-secondary font-medium">bookinghealth.vn</span> và ứng dụng di động.
        </p>
        <p>
          Chúng tôi cam kết bảo vệ quyền riêng tư và tuân thủ đầy đủ{' '}
          <strong>Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân</strong> và các quy định pháp
          luật Việt Nam hiện hành. Sự tin tưởng của bạn là ưu tiên hàng đầu của chúng tôi.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Mã hoá AES-256',
              desc: 'Mọi dữ liệu nhạy cảm được mã hoá theo chuẩn ngân hàng quốc tế.',
            },
            {
              title: 'Tuân thủ pháp luật',
              desc: 'Nghị định 13/2023/NĐ-CP và quy định bảo vệ dữ liệu Việt Nam.',
            },
            {
              title: 'Quyền xoá dữ liệu',
              desc: 'Bạn có thể yêu cầu xoá toàn bộ dữ liệu bất kỳ lúc nào.',
            },
          ].map((item) => (
            <div key={item.title} className="p-5 bg-muted rounded-xl border border-border">
              <p className="font-bold text-foreground mb-2">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'data-collected',
    title: '2. Thông tin chúng tôi thu thập',
    content: (
      <div className="space-y-6">
        <div>
          <p className="font-bold text-foreground mb-4 text-lg">
            A. Thông tin bạn cung cấp trực tiếp
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="text-left p-4 font-semibold">Loại thông tin</th>
                  <th className="text-left p-4 font-semibold">Ví dụ cụ thể</th>
                  <th className="text-left p-4 font-semibold">Mục đích sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: 'Thông tin định danh',
                    example: 'Họ tên, ngày sinh, CCCD/Hộ chiếu',
                    purpose: 'Xác minh danh tính',
                  },
                  {
                    type: 'Thông tin liên lạc',
                    example: 'Email, số điện thoại, địa chỉ nhà',
                    purpose: 'Thông báo lịch hẹn',
                  },
                  {
                    type: 'Thông tin y tế',
                    example: 'Triệu chứng, tiền sử bệnh, dị ứng thuốc',
                    purpose: 'Hỗ trợ chẩn đoán',
                  },
                  {
                    type: 'Thông tin thanh toán',
                    example: 'Số thẻ (mã hoá), lịch sử giao dịch',
                    purpose: 'Xử lý thanh toán',
                  },
                ].map((row, i) => (
                  <tr
                    key={row.type}
                    className={`border-t border-border ${i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                  >
                    <td className="p-4 font-semibold text-foreground">{row.type}</td>
                    <td className="p-4 text-muted-foreground">{row.example}</td>
                    <td className="p-4">
                      <span className="bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {row.purpose}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="font-bold text-foreground mb-4 text-lg">B. Thông tin thu thập tự động</p>
          <ul className="space-y-3">
            {[
              {
                label: 'Thông tin thiết bị',
                desc: 'Loại thiết bị, hệ điều hành, trình duyệt, phiên bản ứng dụng.',
              },
              {
                label: 'Địa chỉ IP',
                desc: 'Phục vụ mục đích bảo mật và phát hiện truy cập gian lận.',
              },
              { label: 'Vị trí địa lý', desc: 'Giúp gợi ý bác sĩ và phòng khám gần bạn nhất.' },
              {
                label: 'Hành vi sử dụng',
                desc: 'Trang đã xem, tính năng đã dùng — để cải thiện trải nghiệm.',
              },
            ].map((item) => (
              <li
                key={item.label}
                className="flex gap-4 p-4 bg-muted rounded-xl border border-border"
              >
                <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2" />
                <div>
                  <span className="font-semibold text-foreground">{item.label}: </span>
                  <span className="text-muted-foreground">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'data-use',
    title: '3. Cách chúng tôi sử dụng thông tin',
    content: (
      <div className="space-y-5">
        <p>Chúng tôi chỉ sử dụng thông tin của bạn cho các mục đích đã được nêu rõ dưới đây:</p>
        <div className="space-y-4">
          {[
            {
              heading: 'Cung cấp và vận hành dịch vụ',
              items: [
                'Kết nối bạn với bác sĩ và phòng khám phù hợp.',
                'Xác nhận, quản lý và nhắc nhở lịch hẹn.',
                'Xử lý giao dịch thanh toán an toàn.',
                'Hỗ trợ chức năng AI Sàng lọc sức khoẻ.',
              ],
            },
            {
              heading: 'Cải thiện và phát triển dịch vụ',
              items: [
                'Phân tích hành vi sử dụng để tối ưu hoá trải nghiệm.',
                'Nghiên cứu và phát triển các tính năng mới.',
                'Đào tạo mô hình AI với dữ liệu đã được ẩn danh hoá.',
              ],
            },
            {
              heading: 'Liên lạc và hỗ trợ',
              items: [
                'Gửi nhắc nhở lịch hẹn qua email và SMS.',
                'Thông báo cập nhật chính sách và tính năng mới.',
                'Phản hồi yêu cầu hỗ trợ và khiếu nại.',
              ],
            },
            {
              heading: 'Tuân thủ pháp lý',
              items: [
                'Phát hiện và ngăn chặn gian lận, lạm dụng dịch vụ.',
                'Tuân thủ yêu cầu hợp pháp từ cơ quan có thẩm quyền.',
                'Giải quyết tranh chấp và bảo vệ quyền lợi hợp pháp.',
              ],
            },
          ].map((group) => (
            <div key={group.heading} className="border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-muted font-bold text-foreground border-b border-border">
                {group.heading}
              </div>
              <ul className="p-5 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'data-sharing',
    title: '4. Chia sẻ thông tin với bên thứ ba',
    content: (
      <div className="space-y-5">
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
          <p className="font-bold text-green-800 mb-1">Cam kết không bán dữ liệu</p>
          <p className="text-green-700">
            BookingHealth <strong>KHÔNG BAO GIỜ</strong> bán, cho thuê hoặc trao đổi dữ liệu cá nhân
            của bạn cho bên thứ ba vì mục đích thương mại dưới bất kỳ hình thức nào.
          </p>
        </div>
        <p>Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp giới hạn sau đây:</p>
        <ul className="space-y-3">
          {[
            {
              who: 'Bác sĩ và cơ sở y tế',
              why: 'Chia sẻ thông tin cần thiết (triệu chứng, tiền sử bệnh) để bác sĩ có thể cung cấp dịch vụ khám chữa bệnh hiệu quả.',
            },
            {
              who: 'Đối tác thanh toán',
              why: 'Xử lý giao dịch tài chính. BookingHealth không lưu trữ số thẻ tại hệ thống của mình.',
            },
            {
              who: 'Nhà cung cấp dịch vụ kỹ thuật',
              why: 'Hosting, gửi email, phân tích dữ liệu. Tất cả đều ký Thoả thuận Bảo mật (NDA) với chúng tôi.',
            },
            {
              who: 'Cơ quan pháp luật Việt Nam',
              why: 'Khi có lệnh của tòa án hoặc cơ quan nhà nước có thẩm quyền theo đúng quy định pháp luật.',
            },
          ].map((item) => (
            <li key={item.who} className="p-5 bg-muted rounded-xl border border-border">
              <p className="font-bold text-foreground mb-1.5">{item.who}</p>
              <p className="text-muted-foreground">{item.why}</p>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'data-security',
    title: '5. Bảo mật dữ liệu',
    content: (
      <div className="space-y-5">
        <p>
          Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và quy trình tổ chức tiên tiến nhất để
          bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát, tiết lộ hoặc bị phá huỷ.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Mã hoá AES-256',
              desc: 'Mọi dữ liệu nhạy cảm được mã hoá theo chuẩn bảo mật ngân hàng quốc tế.',
            },
            {
              title: 'HTTPS / TLS 1.3',
              desc: 'Toàn bộ dữ liệu truyền qua mạng được bảo vệ bằng giao thức bảo mật cao nhất.',
            },
            {
              title: 'Xác thực 2 lớp (2FA)',
              desc: 'Tài khoản được bảo vệ bằng lớp xác minh danh tính bổ sung.',
            },
            {
              title: 'Kiểm tra bảo mật định kỳ',
              desc: 'Pentest và audit bảo mật hàng quý bởi đơn vị độc lập chuyên nghiệp.',
            },
            {
              title: 'Giám sát 24/7',
              desc: 'Hệ thống phát hiện xâm nhập và cảnh báo tự động hoạt động liên tục.',
            },
            {
              title: 'Sao lưu dữ liệu tự động',
              desc: 'Backup hàng ngày với khả năng phục hồi nhanh trong trường hợp sự cố.',
            },
          ].map((item) => (
            <div key={item.title} className="p-5 bg-muted rounded-xl border border-border">
              <p className="font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5">
          <p className="font-bold text-amber-800 mb-1">Thông báo sự cố bảo mật</p>
          <p className="text-amber-700">
            Dù áp dụng mọi biện pháp bảo mật, không có hệ thống nào được bảo mật 100%. Trong trường
            hợp xảy ra vi phạm dữ liệu nghiêm trọng, chúng tôi sẽ thông báo cho bạn trong vòng{' '}
            <strong>72 giờ</strong> theo quy định pháp luật.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: '6. Cookie và Công nghệ theo dõi',
    content: (
      <div className="space-y-5">
        <p>
          BookingHealth sử dụng cookie và các công nghệ theo dõi tương tự để cải thiện trải nghiệm
          sử dụng. Bạn có thể kiểm soát việc sử dụng cookie thông qua cài đặt trình duyệt của mình.
        </p>
        <div className="space-y-3">
          {[
            {
              type: 'Cookie thiết yếu',
              badge: 'Bắt buộc',
              badgeCls: 'bg-red-100 text-red-700',
              desc: 'Cần thiết cho các chức năng cơ bản như đăng nhập và bảo mật phiên làm việc. Không thể tắt.',
              examples: 'Session token, CSRF protection token.',
            },
            {
              type: 'Cookie chức năng',
              badge: 'Tuỳ chọn',
              badgeCls: 'bg-blue-100 text-blue-700',
              desc: 'Ghi nhớ các tuỳ chỉnh và sở thích cá nhân của bạn giữa các phiên làm việc.',
              examples: 'Ngôn ngữ hiển thị, múi giờ, chế độ giao diện.',
            },
            {
              type: 'Cookie phân tích',
              badge: 'Tuỳ chọn',
              badgeCls: 'bg-green-100 text-green-700',
              desc: 'Thu thập dữ liệu ẩn danh để chúng tôi hiểu cách bạn sử dụng nền tảng và cải thiện.',
              examples: 'Google Analytics (dữ liệu ẩn danh, không nhận dạng cá nhân).',
            },
            {
              type: 'Cookie quảng cáo',
              badge: 'Tuỳ chọn',
              badgeCls: 'bg-purple-100 text-purple-700',
              desc: 'Hiển thị nội dung và quảng cáo phù hợp với sở thích và hành vi của bạn.',
              examples: 'Remarketing, content personalization.',
            },
          ].map((item) => (
            <div key={item.type} className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 bg-muted border-b border-border">
                <p className="font-bold text-foreground">{item.type}</p>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.badgeCls}`}>
                  {item.badge}
                </span>
              </div>
              <div className="px-5 py-4 space-y-1">
                <p className="text-muted-foreground">{item.desc}</p>
                <p className="text-sm text-muted-foreground/70">
                  <strong className="text-muted-foreground">Ví dụ:</strong> {item.examples}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'retention',
    title: '7. Thời gian lưu trữ dữ liệu',
    content: (
      <div className="space-y-4">
        <p>
          Chúng tôi chỉ lưu trữ dữ liệu của bạn trong thời gian cần thiết để cung cấp dịch vụ và
          thực hiện các nghĩa vụ pháp lý. Dưới đây là thời gian lưu trữ cụ thể cho từng loại dữ
          liệu:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="text-left p-4 font-semibold">Loại dữ liệu</th>
                <th className="text-left p-4 font-semibold">Thời gian lưu trữ</th>
                <th className="text-left p-4 font-semibold">Căn cứ pháp lý</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  type: 'Thông tin tài khoản',
                  duration: 'Trong thời gian sử dụng + 3 năm',
                  basis: 'Hợp đồng dịch vụ',
                },
                { type: 'Hồ sơ và lịch sử y tế', duration: '10 năm', basis: 'Luật Khám chữa bệnh' },
                { type: 'Giao dịch thanh toán', duration: '5 năm', basis: 'Luật Kế toán Việt Nam' },
                { type: 'Nhật ký hoạt động (log)', duration: '1 năm', basis: 'Bảo mật hệ thống' },
                {
                  type: 'Cookie phân tích',
                  duration: '13 tháng',
                  basis: 'Phân tích hành vi người dùng',
                },
              ].map((row, i) => (
                <tr
                  key={row.type}
                  className={`border-t border-border ${i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                >
                  <td className="p-4 font-semibold text-foreground">{row.type}</td>
                  <td className="p-4 text-secondary font-semibold">{row.duration}</td>
                  <td className="p-4 text-muted-foreground">{row.basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Sau khi hết thời hạn lưu trữ, dữ liệu sẽ được xoá vĩnh viễn hoặc ẩn danh hoá hoàn toàn để
          không thể nhận dạng lại.
        </p>
      </div>
    ),
  },
  {
    id: 'rights',
    title: '8. Quyền của bạn đối với dữ liệu cá nhân',
    content: (
      <div className="space-y-5">
        <p>
          Theo pháp luật Việt Nam (Nghị định 13/2023/NĐ-CP) và các tiêu chuẩn quốc tế, bạn có đầy đủ
          các quyền sau đây đối với dữ liệu cá nhân của mình:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              right: 'Quyền truy cập',
              desc: 'Yêu cầu nhận bản sao toàn bộ dữ liệu cá nhân của bạn đang được lưu trữ.',
              action: 'Tải xuống từ trang Hồ sơ cá nhân.',
            },
            {
              right: 'Quyền chỉnh sửa',
              desc: 'Yêu cầu cập nhật thông tin không chính xác hoặc không còn phù hợp.',
              action: 'Chỉnh sửa trực tiếp trong trang Hồ sơ.',
            },
            {
              right: 'Quyền xoá',
              desc: 'Yêu cầu xoá toàn bộ dữ liệu cá nhân khi không còn cần thiết.',
              action: 'Gửi yêu cầu qua privacy@bookinghealth.vn.',
            },
            {
              right: 'Quyền hạn chế xử lý',
              desc: 'Yêu cầu tạm dừng hoặc hạn chế cách chúng tôi sử dụng dữ liệu của bạn.',
              action: 'Gửi yêu cầu qua email.',
            },
            {
              right: 'Quyền di chuyển dữ liệu',
              desc: 'Nhận dữ liệu của bạn dưới định dạng có thể đọc được để chuyển sang dịch vụ khác.',
              action: 'Xuất dữ liệu từ phần Cài đặt tài khoản.',
            },
            {
              right: 'Quyền phản đối',
              desc: 'Từ chối để dữ liệu được xử lý cho mục đích tiếp thị trực tiếp.',
              action: 'Huỷ đăng ký nhận thông báo tiếp thị.',
            },
          ].map((item) => (
            <div key={item.right} className="p-5 bg-muted rounded-xl border border-border">
              <p className="font-bold text-foreground mb-2">{item.right}</p>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{item.desc}</p>
              <p className="text-xs bg-secondary/10 text-secondary font-semibold px-3 py-1.5 rounded-lg inline-block">
                Cách thực hiện: {item.action}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-secondary/5 border-l-4 border-secondary rounded-r-xl p-5">
          <p className="font-bold text-foreground mb-1">Thời hạn phản hồi: 30 ngày làm việc</p>
          <p className="text-muted-foreground">
            Chúng tôi cam kết phản hồi mọi yêu cầu liên quan đến quyền dữ liệu trong vòng{' '}
            <strong>30 ngày làm việc</strong>. Các trường hợp phức tạp có thể gia hạn thêm tối đa 60
            ngày — và chúng tôi sẽ thông báo trước cho bạn.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'children',
    title: '9. Bảo vệ trẻ em và vị thành niên',
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="font-bold text-blue-800 mb-1">Bảo vệ đặc biệt dành cho trẻ em</p>
          <p className="text-blue-700">
            BookingHealth không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi mà không có
            sự đồng ý rõ ràng từ cha mẹ hoặc người giám hộ hợp pháp.
          </p>
        </div>
        <p>
          Đối với người dùng từ 13 đến 17 tuổi, cha mẹ hoặc người giám hộ phải đọc và đồng ý với
          Điều khoản Dịch vụ và Chính sách Bảo mật này thay cho trẻ trước khi bắt đầu sử dụng.
        </p>
        <p>
          Nếu bạn là cha mẹ/người giám hộ và phát hiện con bạn đã cung cấp thông tin cá nhân mà
          không có sự đồng ý của bạn, hãy liên hệ ngay:{' '}
          <a
            href="mailto:privacy@bookinghealth.vn"
            className="text-secondary font-semibold underline hover:text-secondary-hover"
          >
            privacy@bookinghealth.vn
          </a>
          . Chúng tôi sẽ xoá thông tin đó trong vòng 72 giờ.
        </p>
      </div>
    ),
  },
  {
    id: 'transfers',
    title: '10. Chuyển dữ liệu quốc tế',
    content: (
      <div className="space-y-4">
        <p>
          Về nguyên tắc, BookingHealth ưu tiên lưu trữ dữ liệu tại các máy chủ đặt trên lãnh thổ{' '}
          <strong>Việt Nam</strong>. Trong một số trường hợp sử dụng dịch vụ đám mây quốc tế, chúng
          tôi đảm bảo các biện pháp bảo vệ sau:
        </p>
        <ul className="space-y-3">
          {[
            'Chỉ chuyển dữ liệu đến các quốc gia có tiêu chuẩn bảo vệ dữ liệu tương đương hoặc cao hơn Việt Nam.',
            'Ký Hợp đồng Xử lý Dữ liệu (DPA) với tất cả nhà cung cấp dịch vụ có nhận dữ liệu.',
            'Áp dụng Điều khoản Hợp đồng Tiêu chuẩn (SCC) theo yêu cầu pháp lý quốc tế.',
            'Mã hoá toàn bộ dữ liệu trước khi chuyển ra ngoài lãnh thổ Việt Nam.',
          ].map((item) => (
            <li
              key={item}
              className="flex gap-3 p-4 bg-muted rounded-xl border border-border text-muted-foreground"
            >
              <span className="w-5 h-5 rounded-full border-2 border-secondary text-secondary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'changes',
    title: '11. Thay đổi Chính sách Bảo mật',
    content: (
      <div className="space-y-4">
        <p>
          Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian để phản ánh những thay đổi
          trong dịch vụ, yêu cầu pháp lý hoặc thực tiễn bảo mật. Khi có thay đổi quan trọng, chúng
          tôi sẽ:
        </p>
        <ul className="space-y-2">
          {[
            'Gửi email thông báo đến địa chỉ đã đăng ký trước ít nhất 15 ngày.',
            'Hiển thị thông báo nổi bật trên trang chủ và ứng dụng.',
            'Cập nhật ngày "Cập nhật lần cuối" tại đầu trang Chính sách Bảo mật.',
            'Lưu trữ lịch sử các phiên bản cũ để bạn có thể xem lại khi cần.',
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 p-4 bg-muted rounded-xl border border-border"
            >
              <span className="w-7 h-7 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '12. Liên hệ và Cán bộ Bảo vệ Dữ liệu (DPO)',
    content: (
      <div className="space-y-5">
        <p>
          Nếu bạn có câu hỏi, khiếu nại hoặc yêu cầu liên quan đến Chính sách Bảo mật và dữ liệu cá
          nhân, hãy liên hệ với <strong>Cán bộ Bảo vệ Dữ liệu (DPO)</strong> của chúng tôi:
        </p>
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-secondary/10 to-primary/5 border-b border-border">
            <p className="font-bold text-foreground text-lg">
              Phòng Bảo vệ Dữ liệu — BookingHealth DPO
            </p>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                label: 'Email bảo mật',
                value: 'privacy@bookinghealth.vn',
                href: 'mailto:privacy@bookinghealth.vn',
              },
              { label: 'Đường dây hỗ trợ (miễn phí)', value: '1800 1234', href: 'tel:18001234' },
              { label: 'Địa chỉ văn phòng', value: 'TP. Đà Nẵng, Việt Nam', href: null },
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
                  <a href={item.href} className="font-bold text-secondary hover:underline">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-semibold text-foreground">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Nếu bạn không hài lòng với cách chúng tôi xử lý khiếu nại, bạn có quyền gửi khiếu nại đến{' '}
          <strong className="text-foreground">Cục An toàn Thông tin (AIS)</strong> — Bộ Thông tin và
          Truyền thông Việt Nam theo quy định của pháp luật.
        </p>
      </div>
    ),
  },
];

/* ─── Component ─── */
const PrivacyPolicy = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['overview']));

  useEffect(() => {
    document.title = 'Chính sách Bảo mật | BookingHealth';
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
      <section className="bg-gradient-to-br from-secondary via-secondary/90 to-primary/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-16">
          <p className="text-secondary-foreground/70 text-xs font-semibold uppercase tracking-widest mb-2">
            BookingHealth
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            Chính sách
            <br />
            Bảo mật
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-2xl mb-5">
            Sự riêng tư của bạn là ưu tiên hàng đầu của BookingHealth. Chúng tôi minh bạch hoàn toàn
            về cách thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.
          </p>
          <div className="flex flex-wrap gap-5 text-white/60 text-xs">
            <span>Cập nhật lần cuối: 09/06/2026</span>
            <span>Phiên bản 2.0</span>
            <span>Tuân thủ Nghị định 13/2023/NĐ-CP</span>
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        {/* Quick Rights Banner */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 mb-8">
          <p className="font-bold text-foreground mb-3">Quyền của bạn — tóm tắt</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              'Xem dữ liệu',
              'Sửa thông tin',
              'Xoá dữ liệu',
              'Xuất dữ liệu',
              'Hạn chế xử lý',
              'Từ chối tiếp thị',
            ].map((right) => (
              <div
                key={right}
                className="flex items-center justify-center text-center p-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground"
              >
                {right}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs mt-3">
            Để thực hiện bất kỳ quyền nào, liên hệ:{' '}
            <a
              href="mailto:privacy@bookinghealth.vn"
              className="text-secondary font-semibold underline"
            >
              privacy@bookinghealth.vn
            </a>
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{sections.length}</span> điều khoản
          </p>
          <div className="flex gap-3">
            <button
              onClick={expandAll}
              className="text-sm font-semibold text-secondary hover:underline cursor-pointer"
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
                className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? 'border-secondary/30 shadow-sm shadow-secondary/10' : 'border-border'
                }`}
              >
                {/* Header */}
                <button
                  id={`privacy-toggle-${section.id}`}
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer transition-colors duration-200 ${
                    isOpen ? 'bg-secondary/5' : 'bg-background hover:bg-muted/60'
                  }`}
                >
                  <h2
                    className={`text-sm font-bold leading-snug transition-colors duration-200 ${
                      isOpen ? 'text-secondary' : 'text-foreground'
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
            Câu hỏi về bảo mật? Liên hệ DPO tại{' '}
            <a
              href="mailto:privacy@bookinghealth.vn"
              className="text-secondary font-semibold underline"
            >
              privacy@bookinghealth.vn
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/terms"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors"
            >
              Xem Điều khoản Dịch vụ
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
