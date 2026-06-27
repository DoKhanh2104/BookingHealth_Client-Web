import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { specialtyService } from '../../services/specialtyService';
import { doctorService } from '../../services/doctorService';
import type { Specialty, Doctor } from '../../types';

// Helper chuyển tiếng Việt không dấu để so sánh/tìm kiếm
const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

export const useSpecialtiesHooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Tải danh sách chuyên khoa khi component mount
  useEffect(() => {
    specialtyService
      .getAll(0, 1000)
      .then((res) => {
        if (res?.result?.content) {
          setSpecialties(res.result.content);
        }
      })
      .catch((err) => console.error('Failed to fetch specialties', err))
      .finally(() => {
        setLoadingSpecialties(false);
      });
  }, []);

  // 2. Chuyên khoa đang chọn = SUY RA từ URL (?id / ?name) + danh sách.
  //    Không dùng state + effect (tránh cascading render & gọi API thừa).
  const selectedSpecialty = useMemo<Specialty | null>(() => {
    if (specialties.length === 0) return null;

    const idParam = searchParams.get('id');
    const nameParam = searchParams.get('name');

    if (idParam) {
      return specialties.find((s) => s.id === Number(idParam)) ?? null;
    }
    if (nameParam) {
      const q = removeAccents(nameParam.trim());
      return specialties.find((s) => removeAccents(s.specialtyName).includes(q)) ?? null;
    }
    return null;
  }, [specialties, searchParams]);

  const selectedId = selectedSpecialty?.id ?? null;

  // 3. Tải bác sĩ theo chuyên khoa đang chọn (đồng bộ với API ngoài) — có chống race
  useEffect(() => {
    if (selectedId == null) return;

    let cancelled = false;

    const loadDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await doctorService.getAll({ specialtyId: selectedId, size: 100 });
        if (!cancelled) setDoctors(res?.result?.content ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch doctors', err);
          setDoctors([]);
        }
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    };

    loadDoctors();

    // Huỷ response cũ nếu đổi chuyên khoa trước khi request hoàn tất
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  // Bác sĩ hiển thị: rỗng khi chưa chọn chuyên khoa (suy ra, không setState trong effect)
  const visibleDoctors = selectedId == null ? [] : doctors;

  // Chọn chuyên khoa thủ công: chỉ cần đổi URL, selectedSpecialty tự suy ra ở render kế
  const handleSelectSpecialty = (specialty: Specialty) => {
    setSearchParams({ id: specialty.id.toString() });
  };

  // Lọc danh sách chuyên khoa hiển thị theo từ khóa tìm kiếm
  const filteredSpecialties = specialties.filter((s) =>
    removeAccents(s.specialtyName).includes(removeAccents(searchQuery.trim())),
  );

  return {
    specialties: filteredSpecialties,
    allSpecialtiesCount: specialties.length,
    selectedSpecialty,
    doctors: visibleDoctors,
    loadingSpecialties,
    loadingDoctors,
    searchQuery,
    setSearchQuery,
    handleSelectSpecialty,
  };
};
