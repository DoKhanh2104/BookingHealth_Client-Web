import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import { doctorService } from '../../services/doctorService';
import { uploadService } from '../../services/uploadService';
import DatePicker from '../../components/DatePicker';
import { todayYMD } from '../../utils/date';

interface Qualification {
  id: number;
  degree: string;
  issueDate: string;
  attachmentUrl?: string;
  status: number;
}

const DoctorProfile: React.FC = () => {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // General Info States
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('0');
  const [clinicName, setClinicName] = useState('Đang cập nhật...');
  const [licenseNumber, setLicenseNumber] = useState('Đang cập nhật...');

  // Qualifications State
  const [qualifications, setQualifications] = useState<Qualification[]>([]);

  // New Qualification Form
  const [newDegreeName, setNewDegreeName] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    // Lấy profile user -> doctorId -> thông tin chi tiết bác sĩ
    userService
      .getProfile()
      .then((res) => {
        const u = res.result;
        if (u.doctorId) {
          setDoctorId(u.doctorId);
          return doctorService.getById(u.doctorId);
        }
        throw new Error('User is not a doctor');
      })
      .then((docRes) => {
        const doc = docRes.result;
        setBio(doc.biography || '');
        setClinicName(doc.clinic?.clinicName || 'Đang cập nhật...');
        setLicenseNumber(doc.practiceLicenseNumber || 'Đang cập nhật...');
        if (doc.practiceStartDate) {
          const startYear = new Date(doc.practiceStartDate).getFullYear();
          const currentYear = new Date().getFullYear();
          setExperienceYears(String(currentYear - startYear));
        }
        if (doc.qualifications) {
          setQualifications(doc.qualifications as unknown as Qualification[]);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Không thể lấy thông tin bác sĩ');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;
    doctorService
      .updateProfile(doctorId, { biography: bio })
      .then(() => toast.success('Cập nhật hồ sơ chuyên môn thành công'))
      .catch(() => toast.error('Lỗi khi cập nhật hồ sơ'));
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.code === 1000 && res.result) {
        setAttachmentUrl(res.result);
        toast.success('Tải lên tệp đính kèm thành công');
      } else {
        toast.error(res.message || 'Lỗi tải lên tệp đính kèm');
      }
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi khi tải lên tệp');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegreeName.trim() || !newIssueDate) {
      toast.error('Vui lòng điền tên văn bằng và ngày cấp');
      return;
    }
    if (!doctorId) return;

    doctorService
      .addQualification(doctorId, {
        degree: newDegreeName,
        issueDate: newIssueDate,
        attachmentUrl: attachmentUrl,
      })
      .then((res) => {
        const newQual = res.result as unknown as Qualification;
        setQualifications([...qualifications, newQual]);
        setNewDegreeName('');
        setNewIssueDate('');
        setAttachmentUrl('');
        toast.success('Thêm văn bằng/chứng chỉ chuyên môn mới thành công. Hệ thống sẽ phê duyệt.');
      })
      .catch(() => {
        toast.error('Lỗi khi đăng ký thêm văn bằng');
      });
  };

  if (loading) return <div className="text-center p-8">Đang tải hồ sơ...</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6 text-xs">
      {/* General info updates */}
      <div className="md:col-span-2 space-y-6">
        <div className="card p-6 space-y-4 shadow-sm">
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
                className="input-field leading-relaxed"
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
                  disabled
                  className="input-field bg-muted/50 text-muted-foreground"
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
                  className="input-field bg-muted/50 text-muted-foreground"
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
                className="input-field bg-muted/50 text-muted-foreground"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-md">
              Cập nhật thông tin
            </button>
          </form>
        </div>

        {/* Credentials / Qualifications list */}
        <div className="card p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-foreground text-sm">
            Văn bằng & Chứng chỉ chuyên khoa
          </h3>
          <div className="divide-y divide-border">
            {qualifications.map((qual) => (
              <div
                key={qual.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-foreground">{qual.degree}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Ngày cấp: {qual.issueDate ? qual.issueDate.substring(0, 10) : 'Chưa rõ'}
                  </div>
                  {qual.attachmentUrl && (
                    <a
                      href={qual.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-primary hover:underline mt-1 block"
                    >
                      Xem tệp đính kèm
                    </a>
                  )}
                </div>
                <div>
                  {qual.status === 1 && (
                    <span className="badge bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 whitespace-nowrap">
                      Đã duyệt
                    </span>
                  )}
                  {qual.status === 0 && (
                    <span className="badge bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">
                      Chờ duyệt
                    </span>
                  )}
                  {qual.status === 2 && (
                    <span className="badge bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">
                      Từ chối
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Qualification column */}
      <div className="card p-6 space-y-4 shadow-sm h-fit">
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
              className="input-field"
            />
          </div>

          {/* Date of issue */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Ngày cấp chứng chỉ</label>
            <DatePicker value={newIssueDate} onChange={setNewIssueDate} max={todayYMD()} />
          </div>

          {/* Attachment upload */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Bản sao (PDF/Ảnh) chứng chỉ</label>
            <label className="btn btn-outline btn-md btn-block">
              {uploadingFile ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Đang tải lên...
                </div>
              ) : (
                'Chọn tệp tải lên'
              )}
              <input
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleUploadAttachment}
                disabled={uploadingFile}
              />
            </label>
            {attachmentUrl && (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-[10px] hover:underline truncate block"
              >
                Đã tải lên tệp: Nhấn để xem
              </a>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-md btn-block">
            Đăng ký thêm văn bằng
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
