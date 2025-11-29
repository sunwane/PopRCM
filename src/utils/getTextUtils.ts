export const getMovieTypesText = (type: string): string => {
  switch (type) {
    case 'single':
      return 'Phim lẻ';
    case 'series':
      return 'Phim bộ';
    case 'tvshow':
      return 'Chương trình truyền hình';
    case 'hoathinh':
      return 'Hoạt hình';
    default:
      return type;
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'ongoing':
      return 'Đang chiếu';
    case 'trailer':
      return 'Sắp chiếu';
    default:
      return status;
  }
};

export const getGenderText = (gender: string): string => {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    case 'other':
      return 'Khác';
    default:
      return 'Không rõ';
  }
};