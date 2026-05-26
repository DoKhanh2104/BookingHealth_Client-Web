import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { specialtyService } from '../../services/specialtyService';
import { clinicService } from '../../services/clinicService';
import type { Doctor, Specialty, Clinic } from '../../types';

export interface FilterState {
  search: string;
  specialtyId: string;
  clinicId: string;
  experienceRange: string; // 'all' | 'under-5' | '5-10' | 'over-10'
  feeRange: string; // 'all' | 'under-200' | '200-500' | 'over-500'
  sortBy: string; // 'rating' | 'experience' | 'fee-asc' | 'fee-desc'
}

const ITEMS_PER_PAGE = 6;

export const useDoctorsHooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Available lists for filters
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // 2. Main data lists
  const [rawDoctors, setRawDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // 3. Current filter values (derived initial state from search params)
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    specialtyId: searchParams.get('specialtyId') || '',
    clinicId: searchParams.get('clinicId') || '',
    experienceRange: searchParams.get('experienceRange') || 'all',
    feeRange: searchParams.get('feeRange') || 'all',
    sortBy: searchParams.get('sortBy') || 'rating',
  });

  // 4. Pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Load Specialties & Clinics once
  useEffect(() => {
    let active = true;

    Promise.all([
      specialtyService.getAll(0, 1000).catch(() => null),
      clinicService.getAll(0, 1000).catch(() => null),
    ])
      .then(([specRes, clinicRes]) => {
        if (!active) return;
        if (specRes?.result?.content) setSpecialties(specRes.result.content);
        if (clinicRes?.result?.content) setClinics(clinicRes.result.content);
      })
      .finally(() => {
        if (active) setLoadingFilters(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Sync state when URL params change (e.g. back/forward navigation or clicking header link)
  useEffect(() => {
    Promise.resolve().then(() => {
      setFilters({
        search: searchParams.get('search') || '',
        specialtyId: searchParams.get('specialtyId') || '',
        clinicId: searchParams.get('clinicId') || '',
        experienceRange: searchParams.get('experienceRange') || 'all',
        feeRange: searchParams.get('feeRange') || 'all',
        sortBy: searchParams.get('sortBy') || 'rating',
      });
      setCurrentPage(0);
    });
  }, [searchParams]);

  // Fetch doctors list when search, specialty or clinic changes
  // We fetch a larger batch of doctors and then apply local filters for fee and experience
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoadingDoctors(true);
    });

    // Call API with search, specialtyId, clinicId (and high limit since page is local filter)
    const apiParams: Record<string, string> = {
      size: '200',
    };
    if (filters.search.trim()) apiParams.search = filters.search.trim();
    if (filters.specialtyId) apiParams.specialtyId = filters.specialtyId;
    if (filters.clinicId) apiParams.clinicId = filters.clinicId;

    doctorService
      .getAll(apiParams)
      .then((res) => {
        if (!active) return;
        if (res?.result?.content) {
          // Fill fallback biography and clinic info if missing (similar to detail page)
          const processed = res.result.content.map((doc) => {
            const docWithFallbacks = { ...doc };
            if (!docWithFallbacks.clinic) {
              docWithFallbacks.clinic = {
                id: 1,
                clinicName: 'Phòng khám Đa khoa Quốc tế BooKingHealth',
                address: 'Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, quận Hai Bà Trưng, Hà Nội',
              };
            }
            if (!docWithFallbacks.biography) {
              docWithFallbacks.biography = `Bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm lâm sàng tại các bệnh viện lớn.`;
            }
            return docWithFallbacks;
          });
          setRawDoctors(processed);
        } else {
          setRawDoctors([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load doctors list', err);
        if (active) setRawDoctors([]);
      })
      .finally(() => {
        if (active) setLoadingDoctors(false);
      });

    return () => {
      active = false;
    };
  }, [filters.search, filters.specialtyId, filters.clinicId]);

  // Handle setting updates and synchronizing to URL
  const updateFilter = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    setCurrentPage(0);

    // Update query params
    const params: Record<string, string> = {};
    if (updated.search) params.search = updated.search;
    if (updated.specialtyId) params.specialtyId = updated.specialtyId;
    if (updated.clinicId) params.clinicId = updated.clinicId;
    if (updated.experienceRange !== 'all') params.experienceRange = updated.experienceRange;
    if (updated.feeRange !== 'all') params.feeRange = updated.feeRange;
    if (updated.sortBy !== 'rating') params.sortBy = updated.sortBy;

    setSearchParams(params);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      specialtyId: '',
      clinicId: '',
      experienceRange: 'all',
      feeRange: 'all',
      sortBy: 'rating',
    });
    setCurrentPage(0);
    setSearchParams({});
  };

  // Client-side filtering & sorting of rawDoctors
  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...rawDoctors];

    // 1. Experience Filter
    if (filters.experienceRange !== 'all') {
      result = result.filter((doc) => {
        const expYears = doc.practiceStartDate
          ? new Date().getFullYear() - new Date(doc.practiceStartDate).getFullYear()
          : 0;

        if (filters.experienceRange === 'under-5') return expYears < 5;
        if (filters.experienceRange === '5-10') return expYears >= 5 && expYears <= 10;
        if (filters.experienceRange === 'over-10') return expYears > 10;
        return true;
      });
    }

    // 2. Fee Filter
    if (filters.feeRange !== 'all') {
      result = result.filter((doc) => {
        const fee = doc.examinationFee || 0;
        if (filters.feeRange === 'under-200') return fee < 200000;
        if (filters.feeRange === '200-500') return fee >= 200000 && fee <= 500000;
        if (filters.feeRange === 'over-500') return fee > 500000;
        return true;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'rating') {
        const ratingA = a.averageRating || 5.0;
        const ratingB = b.averageRating || 5.0;
        return ratingB - ratingA; // High to Low
      }

      if (filters.sortBy === 'experience') {
        const expA = a.practiceStartDate
          ? new Date().getFullYear() - new Date(a.practiceStartDate).getFullYear()
          : 0;
        const expB = b.practiceStartDate
          ? new Date().getFullYear() - new Date(b.practiceStartDate).getFullYear()
          : 0;
        return expB - expA; // High to Low
      }

      if (filters.sortBy === 'fee-asc') {
        const feeA = a.examinationFee || 0;
        const feeB = b.examinationFee || 0;
        return feeA - feeB; // Low to High
      }

      if (filters.sortBy === 'fee-desc') {
        const feeA = a.examinationFee || 0;
        const feeB = b.examinationFee || 0;
        return feeB - feeA; // High to Low
      }

      return 0;
    });

    return result;
  }, [rawDoctors, filters.experienceRange, filters.feeRange, filters.sortBy]);

  // Paginated list of doctors
  const paginatedDoctors = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return filteredAndSortedDoctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedDoctors, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedDoctors.length / ITEMS_PER_PAGE);

  return {
    specialties,
    clinics,
    loadingFilters,
    doctors: paginatedDoctors,
    totalCount: filteredAndSortedDoctors.length,
    loadingDoctors,
    filters,
    currentPage,
    totalPages,
    setCurrentPage,
    updateFilter,
    resetFilters,
  };
};
