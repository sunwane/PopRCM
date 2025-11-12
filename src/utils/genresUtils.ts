import { Genre, OphimGenreResponse } from '@/types/Genres';

// Format tên thể loại
export const formatGenreName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Validate tên thể loại
export const validateGenreName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Tên thể loại không được để trống' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Tên thể loại phải có ít nhất 2 ký tự' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Tên thể loại không được vượt quá 50 ký tự' };
  }
  
  // Kiểm tra ký tự đặc biệt
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(name)) {
    return { isValid: false, error: 'Tên thể loại không được chứa ký tự đặc biệt' };
  }
  
  return { isValid: true };
};

// Sắp xếp thể loại
export const sortGenres = (genres: Genre[], sortBy: 'name' | 'id' = 'name', order: 'asc' | 'desc' = 'asc'): Genre[] => {
  return [...genres].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    if (sortBy === 'name') {
      aValue = a.genresName.toLowerCase();
      bValue = b.genresName.toLowerCase();
    } else {
      aValue = Number(a.id);
      bValue = Number(b.id);
    }
    
    if (order === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  });
};

// Lọc thể loại theo tên
export const filterGenresByName = (genres: Genre[], searchQuery: string): Genre[] => {
  if (!searchQuery.trim()) return genres;
  
  const query = searchQuery.toLowerCase().trim();
  return genres.filter(genre => 
    genre.genresName.toLowerCase().includes(query)
  );
};

// Lấy màu cho số lượng phim
export const getMovieCountColor = (count: number): string => {
  if (count === 0) return 'text-gray-500 bg-gray-100';
  if (count < 5) return 'text-yellow-700 bg-yellow-100';
  if (count < 20) return 'text-blue-700 bg-blue-100';
  if (count < 50) return 'text-green-700 bg-green-100';
  return 'text-purple-700 bg-purple-100';
};

// Chuyển đổi từ API response sang Genre type
export const normalizeGenreFromApi = (apiGenre: OphimGenreResponse, index: number): Genre => {
  return {
    id: (index + 1).toString(), // Vì API không có id số, ta tạo id từ index
    genresName: apiGenre.name,
  };
};

// Chuyển đổi danh sách genres từ API - CẬP NHẬT với validation tốt hơn
export const normalizeGenresFromApi = (apiGenres: OphimGenreResponse[]): Genre[] => {
  // Kiểm tra nếu apiGenres không phải là array
  if (!Array.isArray(apiGenres)) {
    console.error('Expected array but got:', typeof apiGenres, apiGenres);
    throw new Error('API response items is not an array');
  }
  
  console.log('Normalizing', apiGenres.length, 'genres from API');
  
  return apiGenres.map((apiGenre, index) => {
    // Validate từng item
    if (!apiGenre || typeof apiGenre !== 'object') {
      console.warn('Invalid genre item at index', index, ':', apiGenre);
      return {
        id: (index + 1).toString(),
        genresName: 'Unknown Genre'
      };
    }
    
    if (!apiGenre.name) {
      console.warn('Genre missing name at index', index, ':', apiGenre);
      return {
        id: (index + 1).toString(),
        genresName: 'Unnamed Genre'
      };
    }
    
    return normalizeGenreFromApi(apiGenre, index);
  });
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
    console.log('Has data property:', 'data' in data);
    console.log('Has items in data:', data.data && 'items' in data.data);
    
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};