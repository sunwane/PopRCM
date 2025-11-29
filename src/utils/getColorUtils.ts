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