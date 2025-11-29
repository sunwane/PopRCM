export const getStatusLabelColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500 text-white font-bold';
    case 'ongoing':
      return 'bg-blue-500 text-white font-bold';
    case 'trailer':
      return 'bg-yellow-500 text-white font-bold';
    default:
      return 'bg-gray-500 text-white font-bold';
  }
};