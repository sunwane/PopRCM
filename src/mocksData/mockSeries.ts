import { Series, SeriesMovie } from '@/types/Series';

// Mock SeriesMovies relationship data (without movie objects to avoid circular dependency)
export const mockSeriesMovies: SeriesMovie[] = [
  // Marvel Cinematic Universe
  { id: 'sm-001', movieId: 1, seriesId: 'series-001', seasonNumber: 1 }, // Avengers: Endgame
  { id: 'sm-002', movieId: 13, seriesId: 'series-001', seasonNumber: 2 }, // Spider-Man: Homecoming
  { id: 'sm-003', movieId: 14, seriesId: 'series-001', seasonNumber: 3 }, // Spider-Man: Far From Home
  { id: 'sm-004', movieId: 15, seriesId: 'series-001', seasonNumber: 4 }, // Spider-Man: No Way Home

  // Fast & Furious Franchise
  { id: 'sm-005', movieId: 16, seriesId: 'series-002', seasonNumber: 1 }, // The Fast and the Furious
  { id: 'sm-006', movieId: 17, seriesId: 'series-002', seasonNumber: 2 }, // Fast & Furious 6

  // Gia Đình Là Số 1
  { id: 'sm-007', movieId: 18, seriesId: 'series-003', seasonNumber: 1 }, // Phần 1
  { id: 'sm-008', movieId: 19, seriesId: 'series-003', seasonNumber: 2 }, // Phần 2

  // John Wick Series
  { id: 'sm-009', movieId: 20, seriesId: 'series-004', seasonNumber: 1 }, // John Wick
  { id: 'sm-010', movieId: 21, seriesId: 'series-004', seasonNumber: 2 }, // John Wick: Chapter 2
  { id: 'sm-011', movieId: 22, seriesId: 'series-004', seasonNumber: 3 }, // John Wick: Chapter 3

  // Stranger Things Universe
  { id: 'sm-012', movieId: 2, seriesId: 'series-005', seasonNumber: 1 }, // Stranger Things

  // Korean Horror Collection
  { id: 'sm-013', movieId: 5, seriesId: 'series-006', seasonNumber: 1 }, // Kingdom
  { id: 'sm-014', movieId: 10, seriesId: 'series-006', seasonNumber: 2 }, // Train to Busan
  { id: 'sm-015', movieId: 12, seriesId: 'series-006', seasonNumber: 3 }, // Squid Game

  // Studio Ghibli Masterpieces
  { id: 'sm-016', movieId: 6, seriesId: 'series-007', seasonNumber: 1 }, // Spirited Away
  { id: 'sm-017', movieId: 11, seriesId: 'series-007', seasonNumber: 2 }, // Your Name

  // Vietnamese Cinema Collection
  { id: 'sm-018', movieId: 3, seriesId: 'series-008', seasonNumber: 1 }, // Mắt Biếc
  { id: 'sm-019', movieId: 9, seriesId: 'series-008', seasonNumber: 2 }, // Cô Ba Sài Gòn
  { id: 'sm-020', movieId: 18, seriesId: 'series-008', seasonNumber: 3 }, // Gia Đình Là Số 1 - Phần 1
  { id: 'sm-021', movieId: 19, seriesId: 'series-008', seasonNumber: 4 }, // Gia Đình Là Số 1 - Phần 2

  // Anime Legends
  { id: 'sm-022', movieId: 8, seriesId: 'series-009', seasonNumber: 1 }, // One Piece

  // Christopher Nolan Collection
  { id: 'sm-023', movieId: 7, seriesId: 'series-010', seasonNumber: 1 }, // The Dark Knight
];

// Mock Series (without populated seriesMovies to avoid circular dependency)
export const mockSeries: Series[] = [
  {
    id: 'series-001',
    name: 'Marvel Cinematic Universe',
    description: 'Vũ trụ điện ảnh Marvel với các siêu anh hùng như Avengers, Spider-Man và nhiều nhân vật khác trong một thế giới được kết nối.',
    status: 'Ongoing',
    releaseYear: '2008',
    posterUrl: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_9_14_638302830316996578_top-phim-marvel.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-002',
    name: 'Fast & Furious Franchise',
    description: 'Loạt phim hành động về đua xe, gia đình và những cuộc phiêu lưu vòng quanh thế giới với Dominic Toretto và nhóm của anh ta.',
    status: 'Ongoing',
    releaseYear: '2001',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGY2ZWIzYWYtOTMxZi00ODhkLTkxYzktYzA3YTJjNTQyOTE3XkEyXkFqcGc@._V1_QL75_UX500_CR0,47,500,281_.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-003',
    name: 'Gia Đình Là Số 1',
    description: 'Loạt phim sitcom hài hước của Việt Nam về cuộc sống thường ngày của một gia đình đa thế hệ với những tình huống dở khóc dở cười.',
    status: 'Completed',
    releaseYear: '2019',
    posterUrl: 'https://static2.vieon.vn/vieplay-image/carousel_web_v4/2022/12/19/bb68h6gt_1920x1080-giadinhlaso1-p1.png', // Placeholder horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-004',
    name: 'John Wick Series',
    description: 'Câu chuyện về John Wick, một sát thủ huyền thoại trong thế giới ngầm, với những pha hành động mãn nhãn và võ thuật đỉnh cao.',
    status: 'Ongoing',
    releaseYear: '2014',
    posterUrl: 'https://sm.mashable.com/t/mashable_in/photo/default/john-wick-copy_up57.1248.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-005',
    name: 'Stranger Things Universe',
    description: 'Thế giới kinh dị supernatural với những bí ẩn ở thị trấn Hawkins và thế giới Upside Down đầy nguy hiểm.',
    status: 'Completed',
    releaseYear: '2016',
    posterUrl: 'https://preview.redd.it/question-what-can-you-see-sharing-the-same-universe-as-v0-5d6qpgc6ev5b1.jpg?width=640&crop=smart&auto=webp&s=0a4e96c439b2feac4873a27da529c32450204ebe', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-006',
    name: 'Korean Horror Collection',
    description: 'Bộ sưu tập những tác phẩm kinh dị xuất sắc của điện ảnh Hàn Quốc, từ zombie đến thriller tâm lý.',
    status: 'Ongoing',
    releaseYear: '2016',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qAWAULdKb5jAoRdJjRdEg3gJMKH.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-007',
    name: 'Studio Ghibli Masterpieces',
    description: 'Những kiệt tác hoạt hình của Studio Ghibli với thế giới phép thuật tuyệt đẹp và câu chuyện cảm động.',
    status: 'Ongoing',
    releaseYear: '2001',
    posterUrl: 'https://i0.wp.com/yumetwinsblog.wpcomstaging.com/wp-content/uploads/2023/07/studio-ghibli-common-themes-thumbnail.png?fit=1024%2C576&ssl=1', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-008',
    name: 'Vietnamese Cinema Collection',
    description: 'Tuyển tập những bộ phim hay nhất của điện ảnh Việt Nam, từ tình cảm lãng mạn đến sitcom hài hước.',
    status: 'Ongoing',
    releaseYear: '2017',
    posterUrl: 'https://image.tmdb.org/t/p/w780/uOw5JD8IlD546nI7CZRLVWsePGr.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-009',
    name: 'Anime Legends',
    description: 'Những series anime huyền thoại với câu chuyện epic và nhân vật đáng nhớ, từ adventure đến action.',
    status: 'Ongoing',
    releaseYear: '1999',
    posterUrl: 'https://cmavn.com/wp-content/uploads/2017/03/100-nam-hoat-hinh-nhat-ban-khang-dinh-vi-tri-cua-anime-tren-ban-do-hoat-hinh-the-gioi.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  },
  {
    id: 'series-010',
    name: 'Christopher Nolan Collection',
    description: 'Bộ sưu tập các tác phẩm đình đám của đạo diễn Christopher Nolan với những cốt truyện phức tạp và hình ảnh ấn tượng.',
    status: 'Ongoing',
    releaseYear: '2008',
    posterUrl: 'https://w0.peakpx.com/wallpaper/510/951/HD-wallpaper-batman-the-batman-dc-comics-the-batman-movie-thumbnail.jpg', // Horizontal thumbnail
    seriesMovies: [] // Will be populated by service
  }
];

export default mockSeries;