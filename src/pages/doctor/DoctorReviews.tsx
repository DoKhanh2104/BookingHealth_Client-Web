import React from 'react';

interface Review {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  treatmentSpecialty: string;
}

const DoctorReviews: React.FC = () => {
  const averageRating = 4.9;
  const totalReviews = 92;

  // Mock distribution of stars
  const distribution = [
    { stars: 5, count: 85, percentage: 92 },
    { stars: 4, count: 5, percentage: 5 },
    { stars: 3, count: 2, percentage: 3 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  // Mock reviews list
  const reviews: Review[] = [
    {
      id: 1,
      patientName: 'Nguyễn Văn Minh',
      rating: 5,
      comment:
        'Bác sĩ khám rất kỹ lưỡng, tư vấn nhiệt tình chu đáo. Đơn thuốc uống 2 ngày đã đỡ hẳn.',
      date: '24/05/2026',
      treatmentSpecialty: 'Tiêu hóa',
    },
    {
      id: 2,
      patientName: 'Võ Hoàng Yến',
      rating: 5,
      comment:
        'Bác sĩ vô cùng thân thiện, giải thích chi tiết cơ chế bệnh án giúp gia đình yên tâm điều trị.',
      date: '20/05/2026',
      treatmentSpecialty: 'Tiêu hóa',
    },
    {
      id: 3,
      patientName: 'Lê Hoàng Nam',
      rating: 4,
      comment:
        'Phòng khám sạch sẽ, bác sĩ tư vấn tốt, tuy nhiên lúc đông bệnh nhân phải chờ hơi lâu một chút.',
      date: '15/05/2026',
      treatmentSpecialty: 'Tiêu hóa',
    },
    {
      id: 4,
      patientName: 'Đặng Minh Ngọc',
      rating: 5,
      comment:
        'Hệ thống đặt lịch tiện lợi, bác sĩ hỗ trợ trực tuyến tận tình sau khi khám xong. Sẽ tiếp tục ủng hộ!',
      date: '10/05/2026',
      treatmentSpecialty: 'Tiêu hóa',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      {/* Top section: stats breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Rating average big card */}
        <div className="bg-background border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-muted-foreground font-semibold text-xs">
            Điểm đánh giá trung bình
          </span>
          <span className="text-5xl font-black text-foreground mt-4">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 text-amber-400 text-lg mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-muted-foreground text-[10px] mt-2">
            Dựa trên {totalReviews} lượt phản hồi
          </span>
        </div>

        {/* Progress bars distribution */}
        <div className="md:col-span-2 bg-background border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <h3 className="font-extrabold text-foreground text-sm mb-4">Chi tiết mức độ hài lòng</h3>
          <div className="space-y-2">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-10 font-bold text-foreground text-right">{item.stars} ★</span>
                <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-muted-foreground text-right">{item.count} lượt</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-foreground text-sm">Danh sách bình luận đánh giá</h3>
        <div className="divide-y divide-border">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{rev.patientName}</span>
                    <span className="text-[9px] bg-muted/50 border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                      Khám: {rev.treatmentSpecialty}
                    </span>
                  </div>
                  <div className="flex text-amber-400 text-xs mt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {[...Array(5 - rev.rating)].map((_, i) => (
                      <span key={i} className="text-muted/30">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-muted-foreground text-[10px]">{rev.date}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-xs pl-0.5">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorReviews;
