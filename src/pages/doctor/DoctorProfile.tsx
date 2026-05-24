import React, { useState } from 'react';
import { toast } from 'sonner';

interface Qualification {
  id: number;
  degreeName: string;
  issueDate: string;
}

const DoctorProfile: React.FC = () => {
  const [bio, setBio] = useState(
    'Bác sĩ nhiều năm kinh nghiệm tại các bệnh viện lớn miền Trung, chuyên chẩn đoán lâm sàng, nội tiêu hóa và nội soi dạ dày.',
  );
  const [experienceYears, setExperienceYears] = useState('14');
  const [clinicName] = useState('Phòng khám Đa khoa Hòa Khánh');
  const [licenseNumber] = useState('0012/ĐNA-GPHĐ');

  // Qualifications list
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { id: 1, degreeName: 'Bác sĩ Đa khoa - Đại học Y Dược Huế', issueDate: '2012-06-15' },
    {
      id: 2,
      degreeName: 'Thạc sĩ Y khoa chuyên ngành Nội khoa - Đại học Y Dược TP.HCM',
      issueDate: '2016-09-20',
    },
    {
      id: 3,
      degreeName: 'Chứng chỉ Nội soi Tiêu hóa Can thiệp - Bệnh viện Chợ Rẫy',
      issueDate: '2018-12-10',
    },
  ]);

  const [newDegreeName, setNewDegreeName] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cập nhật hồ sơ chuyên môn thành công');
  };

  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegreeName.trim() || !newIssueDate) {
      toast.error('Vui lòng điền tên văn bằng và ngày cấp');
      return;
    }
    const newQual: Qualification = {
      id: Date.now(),
      degreeName: newDegreeName,
      issueDate: newIssueDate,
    };
    setQualifications([...qualifications, newQual]);
    setNewDegreeName('');
    setNewIssueDate('');
    toast.success('Thêm văn bằng/chứng chỉ chuyên môn mới thành công. Hồ sơ sẽ được cập nhật.');
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 text-xs">
      {/* General info updates */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-foreground text-sm">Hồ sơ thông tin chuyên khoa</h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Biography */}
            <div className="space-y-1.5">
              <label className="block font-bold text-foreground">
                Giới thiệu bản thân / Tiểu sử
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs leading-relaxed"
              />
            </div>

            {/* Experience & License */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">
                  Số năm kinh nghiệm hành nghề
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">
                  Số chứng chỉ hành nghề (GPHĐ)
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-xl bg-muted/50 text-muted-foreground focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Clinic */}
            <div className="space-y-1.5">
              <label className="block font-bold text-foreground">Phòng khám liên kết</label>
              <input
                type="text"
                value={clinicName}
                disabled
                className="w-full px-3 py-2 border border-border rounded-xl bg-muted/50 text-muted-foreground focus:outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/25 cursor-pointer"
            >
              Cập nhật thông tin
            </button>
          </form>
        </div>

        {/* Credentials / Qualifications list */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-foreground text-sm">
            Văn bằng & Chứng chỉ chuyên khoa
          </h3>
          <div className="divide-y divide-border">
            {qualifications.map((qual) => (
              <div
                key={qual.id}
                className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-foreground">{qual.degreeName}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Ngày cấp: {qual.issueDate}
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  Đã duyệt
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Qualification column */}
      <div className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm h-fit">
        <h3 className="font-extrabold text-foreground text-sm">Thêm văn bằng mới</h3>
        <p className="text-[10px] text-muted-foreground leading-normal">
          Hãy bổ sung bằng cấp, học vị hoặc chứng chỉ đào tạo y khoa mới nhất. Quản trị viên hệ
          thống sẽ xem xét và phê duyệt.
        </p>

        <form onSubmit={handleAddQualification} className="space-y-4 pt-2">
          {/* Name of degree */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Tên văn bằng / Chứng chỉ</label>
            <input
              type="text"
              value={newDegreeName}
              onChange={(e) => setNewDegreeName(e.target.value)}
              placeholder="e.g. Chứng chỉ Siêu âm Tổng quát"
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
            />
          </div>

          {/* Date of issue */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Ngày cấp chứng chỉ</label>
            <input
              type="date"
              value={newIssueDate}
              onChange={(e) => setNewIssueDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/25 transition-all text-xs cursor-pointer"
          >
            Đăng ký thêm văn bằng
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
