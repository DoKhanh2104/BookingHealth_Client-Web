import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { specialtyService } from '../../services/specialtyService';
import { doctorService } from '../../services/doctorService';
import type { Specialty, Doctor } from '../../types';

export const useSpecialtiesHooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
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

  // Helper chuyển đổi tiếng Việt không dấu để so sánh
  const removeAccents = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  // 2. Lắng nghe tham số URL (?id hoặc ?name) để tự động chọn chuyên khoa tương ứng
  useEffect(() => {
    if (specialties.length === 0) return;

    const idParam = searchParams.get('id');
    const nameParam = searchParams.get('name');

    let matched: Specialty | undefined;

    if (idParam) {
      const id = Number(idParam);
      matched = specialties.find((s) => s.id === id);
    } else if (nameParam) {
      const normalizedQuery = removeAccents(nameParam.trim());
      matched = specialties.find((s) => removeAccents(s.specialtyName).includes(normalizedQuery));
    }

    if (matched && matched.id !== selectedSpecialty?.id) {
      Promise.resolve().then(() => {
        setSelectedSpecialty(matched || null);
      });
    }
  }, [specialties, searchParams, selectedSpecialty]);

  // 3. Tải danh sách bác sĩ khi thay đổi chuyên khoa đã chọn
  useEffect(() => {
    if (!selectedSpecialty) {
      if (doctors.length > 0) {
        Promise.resolve().then(() => {
          setDoctors([]);
        });
      }
      return;
    }

    Promise.resolve().then(() => {
      setLoadingDoctors(true);
    });
    doctorService
      .getAll({ specialtyId: selectedSpecialty.id, size: 100 })
      .then((res) => {
        if (res?.result?.content) {
          setDoctors(res.result.content);
        } else {
          setDoctors([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch doctors', err);
        setDoctors([]);
      })
      .finally(() => setLoadingDoctors(false));
  }, [selectedSpecialty, doctors.length]);

  // Chọn chuyên khoa thủ công trên giao diện
  const handleSelectSpecialty = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    // Cập nhật URL query param để đồng bộ
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
    doctors,
    loadingSpecialties,
    loadingDoctors,
    searchQuery,
    setSearchQuery,
    handleSelectSpecialty,
  };
};
