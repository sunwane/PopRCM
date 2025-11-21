import { Country } from '@/types/Country';

// Format tên quốc gia
export const formatCountryName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Validate tên quốc gia
export const validateCountryName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Tên quốc gia không được để trống' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Tên quốc gia phải có ít nhất 2 ký tự' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Tên quốc gia không được vượt quá 50 ký tự' };
  }
  
  // Kiểm tra ký tự đặc biệt (cho phép dấu cách và một số ký tự đặc biệt của tên quốc gia)
  const invalidCharsRegex = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?]+/;
  if (invalidCharsRegex.test(name)) {
    return { isValid: false, error: 'Tên quốc gia không được chứa ký tự đặc biệt' };
  }
  
  return { isValid: true };
};

// Sắp xếp quốc gia
export const sortCountries = (countries: Country[], sortBy: 'name' | 'id' = 'id', order: 'asc' | 'desc' = 'asc'): Country[] => {
  return [...countries].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    if (sortBy === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else {
      // Convert string id to number for proper sorting
      aValue = parseInt(a.id) || 0;
      bValue = parseInt(b.id) || 0;
    }
    
    if (order === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  });
};

// Lọc quốc gia theo tên
export const filterCountriesByName = (countries: Country[], searchQuery: string): Country[] => {
  if (!searchQuery.trim()) return countries;
  
  const query = searchQuery.toLowerCase().trim();
  return countries.filter(country => 
    country.name.toLowerCase().includes(query)
  );
};

// Lấy màu cho số lượng phim
export const getMovieCountColor = (count: number): string => {
  if (count === 0) return 'text-gray-500 bg-gray-100';
  if (count < 10) return 'text-yellow-700 bg-yellow-100';
  if (count < 50) return 'text-blue-700 bg-blue-100';
  if (count < 100) return 'text-green-700 bg-green-100';
  return 'text-purple-700 bg-purple-100';
};

// Utility để gọi API với error handling
export const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {
  try {
    console.log('Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Parsed JSON data type:', typeof data);
    
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};