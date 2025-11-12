import { Movie} from '@/types/Movies';
import { mockGenres } from './mockGenres';
import { mockCountries } from './mockCountries';
import { mockEpisodes } from './mockEpisodes';

// Mock Movies
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Avengers: Endgame',
    originalName: 'Avengers: Endgame',
    description: 'Sau sự kiện tàn khốc trong Infinity War, vũ trụ đang hỗn loạn và bị hủy diệt bởi hành động của Thanos. Với sự trợ giúp của các đồng minh còn lại, Avengers tập hợp một lần nữa để hoàn tác hành động của Thanos và khôi phục lại sự cân bằng của vũ trụ.',
    releaseYear: 2019,
    type: 'single',
    duration: '181 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    //rating: 8.4,
    director: 'Anthony Russo, Joe Russo',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-15'),
    view: 2547,
    slug: 'avengers-endgame',
    tmdbScore: 8.3,
    imdbScore: 8.4,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // Remove actors array - will be populated by service
    genres: [mockGenres[0], mockGenres[4], mockGenres[5]], // Hành động, Khoa học viễn tưởng, Phiêu lưu
    episodes: [mockEpisodes[0]] // Avengers: Endgame episode
  },
  
  {
    id: 2,
    title: 'Stranger Things',
    originalName: 'Stranger Things',
    description: 'Khi một cậu bé mất tích trong thị trấn nhỏ Hawkins, bạn bè của cậu, một cảnh sát trưởng và mẹ của cậu đã hợp sức tìm kiếm cậu và khám phá ra một bí ẩn siêu nhiên đầy nguy hiểm.',
    releaseYear: 2016,
    type: 'series',
    duration: '50 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    totalEpisodes: 3,
    //rating: 8.7,
    director: 'The Duffer Brothers',
    status: 'ongoing',
    createdAt: new Date('2024-01-20'),
    modifiedAt: new Date('2024-01-25'),
    view: 184,
    slug: 'stranger-things',
    tmdbScore: 8.6,
    imdbScore: 8.7,
    lang: 'Thuyết minh',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[1], mockGenres[4], mockGenres[6]], // Kinh dị, Khoa học viễn tưởng, Tâm lý
    episodes: [mockEpisodes[1], mockEpisodes[2], mockEpisodes[3]] // Stranger Things 3 episodes
  },
  
  {
    id: 3,
    title: 'Mắt Biếc',
    originalName: 'Mắt Biếc',
    description: 'Dựa trên tiểu thuyết cùng tên của nhà văn Nguyễn Nhật Ánh, phim kể về câu chuyện tình đầu trong sáng của Ngạn và cô bạn thơ ấu Hà Lan mắt biếc trong khung cảnh nông thôn Việt Nam.',
    releaseYear: 2019,
    type: 'single',
    duration: '117 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/uOw5JD8IlD546nI7CZRLVWsePGr.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kBY2k3G6LsM',
    //rating: 7.2,
    director: 'Victor Vũ',
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-10'),
    view: 89,
    slug: 'mat-biec',
    tmdbScore: 7.1,
    imdbScore: 7.2,
    lang: 'Vietsub',
    country: [mockCountries[0]], // Việt Nam
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[3], mockGenres[13]], // Tình cảm, Gia đình
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 4,
    title: 'Parasite',
    originalName: '기생충',
    description: 'Gia đình Ki-taek sống trong một căn hầm bẩn thỉu. Họ làm những công việc tạm bợ để kiếm sống, cho đến khi con trai cả Ki-woo được giới thiệu làm gia sư cho con gái của gia đình Park giàu có.',
    releaseYear: 2019,
    type: 'single',
    duration: '132 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/TU9NIjwzjoKPwQHoHshkBcQZFjB.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=SEUXfv87Wpk',
    //rating: 8.5,
    director: 'Bong Joon-ho',
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    modifiedAt: new Date('2024-02-01'),
    view: 13,
    slug: 'parasite',
    tmdbScore: 8.5,
    imdbScore: 8.6,
    lang: 'Vietsub',
    country: [mockCountries[1]], // Hàn Quốc
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[6], mockGenres[14]], // Tâm lý, Bí ẩn
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 5,
    title: 'Kingdom',
    originalName: '킹덤',
    description: 'Trong thời Joseon, thái tử Lee Chang phải điều tra về một dịch bệnh bí ẩn lan rộng khắp vương quốc. Anh khám phá ra một âm mưu chính trị đen tối đứng sau đại dịch zombie này.',
    releaseYear: 2019,
    type: 'series',
    duration: '50 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qAWAULdKb5jAoRdJjRdEg3gJMKH.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/sBiBzDNFUjYEr8pXjOdhQGuBNXm.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=4l-yByZpaaM',
    totalEpisodes: 6,
    //rating: 8.3,
    director: 'Kim Seong-hun',
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    modifiedAt: new Date('2024-02-15'),
    view: 2134,
    slug: 'kingdom',
    tmdbScore: 8.2,
    imdbScore: 8.3,
    lang: 'Vietsub',
    country: [mockCountries[1]], // Hàn Quốc
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[0], mockGenres[1], mockGenres[12]], // Hành động, Kinh dị, Lịch sử
    episodes: [mockEpisodes[4], mockEpisodes[5], mockEpisodes[6], mockEpisodes[7], mockEpisodes[8], mockEpisodes[9]] // Kingdom 6 episodes
  },
  
  {
    id: 6,
    title: 'Spirited Away',
    originalName: '千と千尋の神隠し',
    description: 'Chihiro, một cô bé 10 tuổi, cùng gia đình chuyển đến một thị trấn mới. Trên đường đi, họ lạc vào một thế giới kỳ lạ bị chi phối bởi các thần linh, phù thủy và quái vật, nơi con người bị biến thành động vật.',
    releaseYear: 2001,
    type: 'single',
    duration: '125 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    thumbnailUrl: 'https://image.tmdb.org',
    trailerUrl: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    //rating: 9.3,
    director: 'Hayao Miyazaki',
    status: 'completed',
    createdAt: new Date('2024-01-05'),
    modifiedAt: new Date('2024-01-05'),
    view: 349,
    slug: 'spirited-away',
    tmdbScore: 9.2,
    imdbScore: 9.3,
    lang: 'Thuyết minh',
    country: [mockCountries[3]], // Nhật Bản
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[9], mockGenres[5], mockGenres[13]], // Hoạt hình, Phiêu lưu, Gia đình
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 7,
    title: 'The Dark Knight',
    originalName: 'The Dark Knight',
    description: 'Batman phải chấp nhận một trong những thử thách tâm lý và thể chất lớn nhất trong cuộc chiến chống tội phạm khi đối mặt với một thiên tài tội phạm được biết đến với cái tên Joker.',
    releaseYear: 2008,
    type: 'single',
    duration: '152 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    //rating: 9.0,
    director: 'Christopher Nolan',
    status: 'completed',
    createdAt: new Date('2024-03-10'),
    modifiedAt: new Date('2024-03-10'),
    view: 480,
    slug: 'the-dark-knight',
    tmdbScore: 8.9,
    imdbScore: 9.0,
    lang: 'Vietsub',
    country: [mockCountries[5], mockCountries[6]], // Hoa Kỳ, Anh
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[0], mockGenres[6], mockGenres[14]], // Hành động, Tâm lý, Bí ẩn
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 8,
    title: 'One Piece',
    originalName: 'ワンピース',
    description: 'Monkey D. Luffy, một cậu bé có thể căng giãn cơ thể như cao su sau khi vô tình ăn phải trái ác quỷ, khám phá đại dương Grand Line cùng băng hải tặc Mũ Rơm để tìm kiếm kho báu huyền thoại One Piece.',
    releaseYear: 1999,
    type: 'series',
    duration: '24 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/e3NBjKqVT2BjWpAdb2CReqKEDbJ.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=MCb13lbVGE0',
    totalEpisodes: 3,
    //rating: 9.5,
    director: 'Eiichiro Oda',
    status: 'ongoing',
    createdAt: new Date('2024-03-01'),
    modifiedAt: new Date('2024-10-30'),
    view: 943,
    slug: 'one-piece',
    tmdbScore: 9.4,
    imdbScore: 9.5,
    lang: 'Vietsub',
    country: [mockCountries[3]], // Nhật Bản
    actors: [], // Empty - will be populated by service
    genres: [mockGenres[9], mockGenres[0], mockGenres[5]], // Hoạt hình, Hành động, Phiêu lưu
    episodes: [mockEpisodes[10], mockEpisodes[11], mockEpisodes[12]] // One Piece 3 episodes
  },
  
  {
    id: 9,
    title: 'Cô Ba Sài Gòn',
    originalName: 'Cô Ba Sài Gòn',
    description: 'Câu chuyện về cô Ba - một cô gái xinh đẹp, tài năng trong thời kỳ Sài Gòn thập niên 1960, giữa tình yêu đôi lứa và những xung đột của thời đại.',
    releaseYear: 2017,
    type: 'single',
    duration: '122 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/aOW8uNLIaW2d9fJkz7syIyY3Fbo.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/5y0VGrVjHPkeLqmTiXD8Nqnw3xm.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kXrjw8K2I1k',
    //rating: 7.8,
    director: 'Kay Nguyễn',
    status: 'completed',
    createdAt: new Date('2024-02-20'),
    modifiedAt: new Date('2024-02-20'),
    view: 621,
    slug: 'co-ba-sai-gon',
    tmdbScore: 7.7,
    imdbScore: 7.8,
    lang: 'Vietsub',
    country: [mockCountries[0]], // Việt Nam
    actors: [], // MovieActors for Cô Ba Sài Gòn
    genres: [mockGenres[3], mockGenres[12], mockGenres[10]], // Tình cảm, Lịch sử, Âm nhạc
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 10,
    title: 'Train to Busan',
    originalName: '부산행',
    description: 'Một dịch bệnh virus zombie bùng phát trên toàn Hàn Quốc. Seok-woo và con gái Soo-an đang trên chuyến tàu đến Busan, khi zombie tấn công tàu hỏa. Những hành khách phải chiến đấu để sống sót.',
    releaseYear: 2016,
    type: 'single',
    duration: '118 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1ovPJNdrJ4rnfcGRlxfI0B1PrJJ.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/SmjuegVdYArOEeZQZb0dZrBjKJE.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=pyWuHv2-Abk',
    //rating: 7.6,
    director: 'Yeon Sang-ho',
    status: 'completed',
    createdAt: new Date('2024-02-25'),
    modifiedAt: new Date('2024-02-25'),
    view: 234,
    slug: 'train-to-busan',
    tmdbScore: 7.5,
    imdbScore: 7.6,
    lang: 'Vietsub',
    country: [mockCountries[1]], // Hàn Quốc
    actors: [], // MovieActors for Train to Busan
    genres: [mockGenres[0], mockGenres[1], mockGenres[6]], // Hành động, Kinh dị, Tâm lý
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 11,
    title: 'Your Name',
    originalName: '君の名は。',
    description: 'Mitsuha sống ở một thị trấn nhỏ ở vùng núi và mơ ước được sống ở Tokyo. Taki là một học sinh trung học ở Tokyo. Hai người chưa bao giờ gặp nhau, nhưng họ bắt đầu hoán đổi cơ thể trong giấc mơ.',
    releaseYear: 2016,
    type: 'single',
    duration: '106 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/xq1Ugd62d23K2knRUx6xxuALTZB.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=xU47nhruN-Q',
    //rating: 8.2,
    director: 'Makoto Shinkai',
    status: 'completed',
    createdAt: new Date('2024-03-05'),
    modifiedAt: new Date('2024-03-05'),
    view: 187,
    slug: 'your-name',
    tmdbScore: 8.1,
    imdbScore: 8.2,
    lang: 'Vietsub',
    country: [mockCountries[3]], // Nhật Bản
    actors: [], // MovieActors for Your Name
    genres: [mockGenres[9], mockGenres[3], mockGenres[4]], // Hoạt hình, Tình cảm, Khoa học viễn tưởng
    episodes: [] // No specific episode for this movie
  },
  
  {
    id: 12,
    title: 'Squid Game',
    originalName: '오징어 게임',
    description: 'Một nhóm người mắc nợ tham gia vào một game show bí ẩn để giành giải thưởng khổng lồ. Nhưng họ sớm phát hiện ra rằng cái giá phải trả cho việc thua cuộc là mạng sống của họ.',
    releaseYear: 2021,
    type: 'series',
    duration: '60 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/sgxawbFB5Vi5OkPWQLNfl3dvkNJ.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
    totalEpisodes: 9,
    //rating: 8.0,
    director: 'Hwang Dong-hyuk',
    status: 'completed',
    createdAt: new Date('2024-03-15'),
    modifiedAt: new Date('2024-03-20'),
    view: 54,
    slug: 'squid-game',
    tmdbScore: 7.9,
    imdbScore: 8.0,
    lang: 'Vietsub',
    country: [mockCountries[1]], // Hàn Quốc
    actors: [], // MovieActors for Squid Game
    genres: [mockGenres[6], mockGenres[1], mockGenres[14]], // Tâm lý, Kinh dị, Bí ẩn
    episodes: [] // No specific episodes for Squid Game in mockEpisodes
  },

  {
    id: 13,
    title: 'Spider-Man: Homecoming',
    originalName: 'Spider-Man: Homecoming',
    description: 'Peter Parker cân bằng cuộc sống học đường với việc trở thành siêu anh hùng Spider-Man khi anh phải đối mặt với Vulture.',
    releaseYear: 2017,
    type: 'single',
    duration: '133 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/vc8bCGjdVp0UbMNLzHnHSLRbBWQ.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=rk-dF1lIbIg',
    //rating: 7.4,
    director: 'Jon Watts',
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-10'),
    view: 15,
    slug: 'spider-man-homecoming',
    tmdbScore: 7.4,
    imdbScore: 7.4,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for Spider-Man: Homecoming
    genres: [mockGenres[0], mockGenres[4], mockGenres[5]], // Hành động, Khoa học viễn tưởng, Phiêu lưu
    episodes: [] // No specific episode for this movie
  },

  {
    id: 14,
    title: 'Spider-Man: Far From Home',
    originalName: 'Spider-Man: Far From Home',
    description: 'Peter Parker và bạn bè đi du lịch châu Âu, nhưng kế hoạch bị phá hỏng khi Nick Fury xuất hiện và nhờ Spider-Man giúp đỡ.',
    releaseYear: 2019,
    type: 'single',
    duration: '129 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/5BwqwxMEjeFtdknRV792Svo0K1v.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Nt9L1jCKGnE',
    //rating: 7.5,
    director: 'Jon Watts',
    status: 'completed',
    createdAt: new Date('2024-01-12'),
    modifiedAt: new Date('2024-01-12'),
    view: 18,
    slug: 'spider-man-far-from-home',
    tmdbScore: 7.5,
    imdbScore: 7.5,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for Spider-Man: Far From Home
    genres: [mockGenres[0], mockGenres[4], mockGenres[5]], // Hành động, Khoa học viễn tưởng, Phiêu lưu
    episodes: [] // No specific episode for this movie
  },

  {
    id: 15,
    title: 'Spider-Man: No Way Home',
    originalName: 'Spider-Man: No Way Home',
    description: 'Sau khi danh tính bị lộ, Peter Parker nhờ Doctor Strange giúp đỡ nhưng một phép thuật sai lệch đã mở ra đa vũ trụ.',
    releaseYear: 2021,
    type: 'single',
    duration: '148 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    //rating: 8.2,
    director: 'Jon Watts',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-15'),
    view: 25,
    slug: 'spider-man-no-way-home',
    tmdbScore: 8.2,
    imdbScore: 8.2,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for Spider-Man: No Way Home
    genres: [mockGenres[0], mockGenres[4], mockGenres[5]], // Hành động, Khoa học viễn tưởng, Phiêu lưu
    episodes: [] // No specific episode for this movie
  },

  {
    id: 16,
    title: 'The Fast and the Furious',
    originalName: 'The Fast and the Furious',
    description: 'Một cảnh sát chìm phải thâm nhập vào thế giới đua xe bất hợp pháp để điều tra một loạt vụ cướp xe tải.',
    releaseYear: 2001,
    type: 'single',
    duration: '106 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/gLTHGdHDNZtLo4zOT5Db5eRkzHf.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=2TAOizOnNPo',
    //rating: 6.8,
    director: 'Rob Cohen',
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    modifiedAt: new Date('2024-02-01'),
    view: 2000,
    slug: 'the-fast-and-the-furious',
    tmdbScore: 0,
    imdbScore: 2,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for The Fast and the Furious
    genres: [mockGenres[0], mockGenres[7]], // Hành động, Tội phạm
    episodes: [] // No specific episode for this movie
  },

  {
    id: 17,
    title: 'Fast & Furious 6',
    originalName: 'Fast & Furious 6',
    description: 'Hobbs nhờ Dom và nhóm của anh ta giúp đỡ để bắt một tổ chức tội phạm lái xe khéo léo ở London.',
    releaseYear: 2013,
    type: 'single',
    duration: '130 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/b9gTJKLdSbwcQRKzmqMq3dMfRwI.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/jE2Dj1sTWp8cdJVUCQEhMJKLrJD.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dKi5XoeTN0k',
    //rating: 7.0,
    director: 'Justin Lin',
    status: 'completed',
    createdAt: new Date('2024-02-05'),
    modifiedAt: new Date('2024-02-05'),
    view: 22,
    slug: 'fast-and-furious-6',
    tmdbScore: 7.0,
    imdbScore: 7.0,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for Fast & Furious 6
    genres: [mockGenres[0], mockGenres[7]], // Hành động, Tội phạm
    episodes: [] // No specific episode for this movie
  },

  {
    id: 18,
    title: 'Gia Đình Là Số 1 - Phần 1',
    originalName: 'Gia Đình Là Số 1 - Phần 1',
    description: 'Phần đầu tiên của loạt phim sitcom nổi tiếng về cuộc sống hài hước của một gia đình đa thế hệ.',
    releaseYear: 2019,
    type: 'series',
    duration: '30 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/placeholder-gia-dinh-la-so-1-p1.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/placeholder-gia-dinh-la-so-1-p1-thumb.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=placeholder1',
    totalEpisodes: 120,
    //rating: 8.5,
    director: 'Đạo diễn Việt Nam',
    status: 'completed',
    createdAt: new Date('2024-03-01'),
    modifiedAt: new Date('2024-03-01'),
    view: 500,
    slug: 'gia-dinh-la-so-1-phan-1',
    tmdbScore: 0,
    imdbScore: 0,
    lang: 'Vietsub',
    country: [mockCountries[0]], // Việt Nam
    actors: [], // singleActors for Gia Đình Là Số 1 - Phần 1
    genres: [mockGenres[8], mockGenres[13]], // Hài, Gia đình
    episodes: [] // No specific episodes for this series in mockEpisodes
  },

  {
    id: 19,
    title: 'Gia Đình Là Số 1 - Phần 2',
    originalName: 'Gia Đình Là Số 1 - Phần 2',
    description: 'Phần tiếp theo với những câu chuyện hài hước mới của gia đình và những nhân vật quen thuộc.',
    releaseYear: 2020,
    type: 'series',
    duration: '30 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/placeholder-gia-dinh-la-so-1-p2.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/placeholder-gia-dinh-la-so-1-p2-thumb.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=placeholder2',
    totalEpisodes: 100,
    //rating: 8.3,
    director: 'Đạo diễn Việt Nam',
    status: 'completed',
    createdAt: new Date('2024-03-10'),
    modifiedAt: new Date('2024-03-10'),
    view: 45,
    slug: 'gia-dinh-la-so-1-phan-2',
    tmdbScore: 8.3,
    imdbScore: 8.3,
    lang: 'Vietsub',
    country: [mockCountries[0]], // Việt Nam
    actors: [], // MovieActors for Gia Đình Là Số 1 - Phần 2
    genres: [mockGenres[8], mockGenres[13]], // Hài, Gia đình
    episodes: [] // No specific episodes for this series in mockEpisodes
  },

  {
    id: 20,
    title: 'John Wick',
    originalName: 'John Wick',
    description: 'Một sát thủ đã về hưu phải trở lại thế giới ngầm để trả thù cho cái chết của con chó yêu quý.',
    releaseYear: 2014,
    type: 'single',
    duration: '101 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/b5D1UzBLqZjzADzweKZAw8KgQQM.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=C0BMx-qxsP4',
    //rating: 7.4,
    director: 'Chad Stahelski',
    status: 'completed',
    createdAt: new Date('2024-02-10'),
    modifiedAt: new Date('2024-02-10'),
    view: 180,
    slug: 'john-wick',
    tmdbScore: 7.4,
    imdbScore: 7.4,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for John Wick
    genres: [mockGenres[0], mockGenres[7]], // Hành động, Tội phạm
    episodes: [] // No specific episode for this movie
  },

  {
    id: 21,
    title: 'John Wick: Chapter 2',
    originalName: 'John Wick: Chapter 2',
    description: 'John Wick bị buộc phải trở lại để thực hiện một lời thề máu cũ, dẫn anh ta đến Rome.',
    releaseYear: 2017,
    type: 'single',
    duration: '122 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/hXWBc0ioZP3cN4zCu6SN3YHXZVO.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/h7kIJBNjrKaRWJFw3nqBdJqPqdt.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=XGk2EfbD_Ps',
    //rating: 7.5,
    director: 'Chad Stahelski',
    status: 'completed',
    createdAt: new Date('2024-02-12'),
    modifiedAt: new Date('2024-02-12'),
    view: 1900,
    slug: 'john-wick-chapter-2',
    tmdbScore: 7.5,
    imdbScore: 7.5,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for John Wick: Chapter 2
    genres: [mockGenres[0], mockGenres[7]], // Hành động, Tội phạm
    episodes: [] // No specific episode for this movie
  },

  {
    id: 22,
    title: 'John Wick: Chapter 3 - Parabellum',
    originalName: 'John Wick: Chapter 3 - Parabellum',
    description: 'John Wick đang chạy trốn với mức tiền thưởng 14 triệu đô la trên đầu và một đội quân sát thủ đang săn lùng anh ta.',
    releaseYear: 2019,
    type: 'single',
    duration: '130 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/dD7aKRxC7hOHFUwdJ9aPyTiCPzh.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=M7XM597XO94',
    //rating: 7.4,
    director: 'Chad Stahelski',
    status: 'completed',
    createdAt: new Date('2024-02-15'),
    modifiedAt: new Date('2024-02-15'),
    view: 2100,
    slug: 'john-wick-chapter-3-parabellum',
    tmdbScore: 7.4,
    imdbScore: 7.4,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for John Wick: Chapter 3
    genres: [mockGenres[0], mockGenres[7]], // Hành động, Tội phạm
    episodes: [] // No specific episode for this movie
  }
];