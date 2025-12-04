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
      return 'Full';
    case 'ongoing':
      return 'Ongoing';
    case 'trailer':
      return 'Upcoming';
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

export const getViewDisplayText = (view: number): string => {
  if (view >= 1000000) {
    return (view / 1000000).toFixed(1) + 'M';
  } else if (view >= 1000) {
    return (view / 1000).toFixed(1) + 'K';
  } else {
    return view.toString();
  }
};