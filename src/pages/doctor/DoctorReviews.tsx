import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { userService } from '../../services/userService';
import type { Doctor, DoctorReview } from '../../types';
import { toast } from 'sonner';

const DoctorReviews: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);

  useEffect(() => {
    let active = true;
    userService
      .getProfile()
      .then((res) => {
        if (!active) return;
        const docId = res.result?.doctorId;
        if (docId) {
          return Promise.all([
            doctorService.getById(docId),
            doctorService.getReviews(docId, 0, 100),
          ]);
        } else {
          toast.error('Không tìm thấy thông tin tài khoản bác sĩ!');
          setLoading(false);
          return null;
        }
      })
      .then((data) => {
        if (!active || !data) return;
        const [doctorRes, reviewsRes] = data;
        if (doctorRes.result) {
          setDoctor(doctorRes.result);
        }
        if (reviewsRes.result?.content) {
          setReviews(reviewsRes.result.content);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        toast.error('Không thể tải thông tin đánh giá!');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating) as 5 | 4 | 3 | 2 | 1;
    if (starCounts[star] !== undefined) {
      starCounts[star]++;
    }
  });

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = starCounts[stars as 5 | 4 | 3 | 2 | 1];
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr || '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const treatmentSpecialty =
    doctor?.specialties?.map((s) => s.specialtyName).join(', ') || 'Chuyên khoa';

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
              <span
                key={i}
                className={i < Math.round(averageRating) ? 'text-amber-400' : 'text-muted/30'}
              >
                ★
              </span>
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
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Chưa có đánh giá nào từ bệnh nhân.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {rev.patientName || 'Bệnh nhân'}
                      </span>
                      <span className="text-[9px] bg-muted/50 border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                        Khám: {treatmentSpecialty}
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
                  <span className="text-muted-foreground text-[10px]">{formatDate(rev.date)}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-xs pl-0.5">
                  {rev.comment || 'Không có bình luận.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;
