export const getStatusLabelColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-700 text-white';
    case 'ongoing':
      return 'bg-blue-700 text-white';
    case 'trailer':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getViewLabelColor = (view: number): string => {
  if (view >= 200) {
    return 'bg-linear-to-tr from-yellow-500 via-orange-500 to-red-600 text-black';
  } else if (view >= 100) {
    return 'bg-linear-to-tr from-yellow-500 to-orange-600 text-black';
  } else if (view >= 50) {
    return 'bg-linear-to-tr from-blue-400 to-green-600 text-black';
  } else if (view >= 20) {
    return 'bg-linear-to-tr from-green-300 to-green-600 text-black';
  } else {
    return 'bg-linear-to-tr from-gray-100 to-gray-400 text-black';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-600/30 text-green-400';
    case 'ongoing':
      return 'bg-blue-600/30 text-blue-400';
    case 'trailer':
      return 'bg-orange-500/25 text-orange-400';
    default:
      return 'bg-gray-400/30 text-gray-200';
  }
};
