import { Comment, Review } from "@/types/CommentReview";
import { mockUsers } from "./mockUser";
import { mockMovies } from "./mockMovies";
import { mockEpisodes } from "./mockEpisodes";

// Lấy 10 tập phim khác nhau (ưu tiên các tập có movieId khác nhau nếu có)
const uniqueEpisodes = mockEpisodes.slice(0, 10);
// Lấy 10 phim khác nhau
const uniqueMovies = mockMovies.slice(0, 10);

// 20 comments cho 10 tập phim (mỗi tập 2 comment)
export const mockComments: Comment[] = Array.from({ length: 20 }, (_, i) => {
  const episode = uniqueEpisodes[i % uniqueEpisodes.length];
  const user = mockUsers[i % mockUsers.length];
  return {
    id: `cmt${i + 1}`,
    user,
    episodeId: episode.id,
    content: [
      `Tập ${episode.episodeNumber} của "${episode.title}" quá hấp dẫn! User [${user.userName}] rất thích đoạn cao trào.`,
      `User [${user.userName}] nhận xét: Diễn xuất trong tập "${episode.title}" thật tuyệt vời!`,
      `Tôi đã cười rất nhiều ở tập này. User [${user.userName}] highly recommends!`,
      `Tập này plot twist quá mạnh, User [${user.userName}] không thể rời mắt.`,
      `User [${user.userName}] thấy âm nhạc trong tập "${episode.title}" rất cuốn hút.`,
      `Một tập phim xuất sắc, User [${user.userName}] cho 10 điểm!`,
      `User [${user.userName}] thích cảnh hành động ở tập này nhất.`,
      `Tập "${episode.title}" khiến User [${user.userName}] xúc động.`,
      `User [${user.userName}] mong chờ tập tiếp theo sau khi xem tập này.`,
      `Tập này có nhiều chi tiết hài hước, User [${user.userName}] rất thích.`
    ][i % 10],
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    likeCount: Math.floor(Math.random() * 50),
    likedByCurrentUser: Math.random() > 0.5,
    replies: [],
  };
});

// 20 reviews cho 10 phim (mỗi phim 2 review)
export const mockReviews: Review[] = Array.from({ length: 20 }, (_, i) => {
  const movie = uniqueMovies[i % uniqueMovies.length];
  const user = mockUsers[(i + 2) % mockUsers.length];
  return {
    id: `review${i + 1}`,
    user,
    movieId: movie.id,
    rating: Math.floor(Math.random() * 5) + 6, // 6-10 điểm
    content: [
      `User [${user.userName}] đánh giá "${movie.title}": Nội dung sâu sắc, hình ảnh đẹp, rất đáng xem!`,
      `Một bộ phim tuyệt vời! User [${user.userName}] thích nhất phần kết của "${movie.title}".`,
      `User [${user.userName}] cảm nhận: "${movie.title}" có diễn xuất xuất sắc và nhạc phim ấn tượng.`,
      `Phim "${movie.title}" khiến User [${user.userName}] suy nghĩ rất nhiều về cuộc sống.`,
      `User [${user.userName}] cho rằng "${movie.title}" là một trong những phim hay nhất năm nay.`,
      `Tôi đã xem đi xem lại "${movie.title}". User [${user.userName}] highly recommend!`,
      `User [${user.userName}] thích cách xây dựng nhân vật trong "${movie.title}".`,
      `Cốt truyện của "${movie.title}" rất cuốn hút, User [${user.userName}] không thể rời mắt.`,
      `User [${user.userName}] đánh giá cao thông điệp nhân văn của phim "${movie.title}".`,
      `Một trải nghiệm điện ảnh tuyệt vời với "${movie.title}" - User [${user.userName}].`
    ][i % 10],
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 2).toISOString(),
  };
});