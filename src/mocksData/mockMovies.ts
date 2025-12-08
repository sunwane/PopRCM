import { Movie } from '@/types/Movies';
import { mockGenres } from './mockGenres';
import { mockCountries } from './mockCountries';
import { mockEpisodes } from './mockEpisodes';

// Mock Movies
export const mockMovies: Movie[] = [
  {
    id: "1",
    title: 'Avengers: Endgame',
    originalName: 'Avengers: Endgame',
    description: 'Sau sự kiện tàn khốc trong Infinity War, vũ trụ đang hỗn loạn và bị hủy diệt bởi hành động của Thanos. Với sự trợ giúp của các đồng minh còn lại, Avengers tập hợp một lần nữa để hoàn tác hành động của Thanos và khôi phục lại sự cân bằng của vũ trụ.',
    releaseYear: 2019,
    type: 'single',
    duration: '181 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    thumbnailUrl: 'https://www.baltana.com/files/wallpapers-15/Avengers-Endgame-High-Definition-Wallpaper-39345.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    //rating: 8.4,
    director: 'Anthony Russo, Joe Russo',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-15'),
    view: 254,
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
    id: "2",
    title: 'Stranger Things',
    originalName: 'Stranger Things',
    description: 'Khi một cậu bé mất tích trong thị trấn nhỏ Hawkins, bạn bè của cậu, một cảnh sát trưởng và mẹ của cậu đã hợp sức tìm kiếm cậu và khám phá ra một bí ẩn siêu nhiên đầy nguy hiểm.',
    releaseYear: 2016,
    type: 'series',
    duration: '50 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    thumbnailUrl: 'https://images2.alphacoders.com/879/879599.png',
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
    id: "3",
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
    id: "4",
    title: 'Parasite',
    originalName: '기생충',
    description: 'Gia đình Ki-taek sống trong một căn hầm bẩn thỉu. Họ làm những công việc tạm bợ để kiếm sống, cho đến khi con trai cả Ki-woo được giới thiệu làm gia sư cho con gái của gia đình Park giàu có.',
    releaseYear: 2019,
    type: 'single',
    duration: '132 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    thumbnailUrl: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/10/parasite-poster-thumbnail.jpg?w=1600&h=900&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=SEUXfv87Wpk',
    //rating: 8.5,
    director: 'Bong Joon-ho',
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    modifiedAt: new Date('2024-02-01'),
    view: 130,
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
    id: "5",
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
    view: 34,
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
    id: "6",
    title: 'Spirited Away',
    originalName: '千と千尋の神隠し',
    description: 'Chihiro, một cô bé 10 tuổi, cùng gia đình chuyển đến một thị trấn mới. Trên đường đi, họ lạc vào một thế giới kỳ lạ bị chi phối bởi các thần linh, phù thủy và quái vật, nơi con người bị biến thành động vật.',
    releaseYear: 2001,
    type: 'hoathinh',
    duration: '125 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    thumbnailUrl: 'https://image.tmdb.org',
    trailerUrl: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    //rating: 9.3,
    director: 'Hayao Miyazaki',
    status: 'completed',
    createdAt: new Date('2024-01-05'),
    modifiedAt: new Date('2024-01-05'),
    view: 49,
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
    id: "7",
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
    view: 48,
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
    id: "8",
    title: 'One Piece',
    originalName: 'ワンピース',
    description: 'Monkey D. Luffy, một cậu bé có thể căng giãn cơ thể như cao su sau khi vô tình ăn phải trái ác quỷ, khám phá đại dương Grand Line cùng băng hải tặc Mũ Rơm để tìm kiếm kho báu huyền thoại One Piece.',
    releaseYear: 1999,
    type: 'hoathinh',
    duration: '24 min/ep',
    posterUrl: 'https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg',
    thumbnailUrl: 'https://images2.alphacoders.com/781/thumb-1920-781787.png',
    trailerUrl: 'https://www.youtube.com/watch?v=MCb13lbVGE0',
    totalEpisodes: 3,
    //rating: 9.5,
    director: 'Eiichiro Oda',
    status: 'ongoing',
    createdAt: new Date('2024-03-01'),
    modifiedAt: new Date('2024-10-30'),
    view: 94,
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
    id: "9",
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
    view: 21,
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
    id: "10",
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
    view: 23,
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
    id: "11",
    title: 'Your Name',
    originalName: '君の名は。',
    description: 'Mitsuha sống ở một thị trấn nhỏ ở vùng núi và mơ ước được sống ở Tokyo. Taki là một học sinh trung học ở Tokyo. Hai người chưa bao giờ gặp nhau, nhưng họ bắt đầu hoán đổi cơ thể trong giấc mơ.',
    releaseYear: 2016,
    type: 'hoathinh',
    duration: '106 min',
    posterUrl: 'https://www.lab111.nl/wp-content/uploads/2017/09/Your-Name_ps_1_jpg_sd-high-1-scaled.jpg',
    thumbnailUrl: 'https://wallpapercat.com/w/full/8/a/e/118480-1920x1080-desktop-full-hd-your-name-background-photo.jpg',
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
    id: "12",
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
    id: "13",
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
    id: "14",
    title: 'Spider-Man: Far From Home',
    originalName: 'Spider-Man: Far From Home',
    description: 'Peter Parker và bạn bè đi du lịch châu Âu, nhưng kế hoạch bị phá hỏng khi Nick Fury xuất hiện và nhờ Spider-Man giúp đỡ.',
    releaseYear: 2019,
    type: 'single',
    duration: '129 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg',
    thumbnailUrl: 'https://i.dailymail.co.uk/1s/2019/03/25/15/11430430-0-image-a-66_1553526292895.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Nt9L1jCKGnE',
    //rating: 7.5,
    director: 'Jon Watts',
    status: 'completed',
    createdAt: new Date('2024-01-12'),
    modifiedAt: new Date('2024-01-12'),
    view: 180,
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
    id: "15",
    title: 'Spider-Man: No Way Home',
    originalName: 'Spider-Man: No Way Home',
    description: 'Sau khi danh tính bị lộ, Peter Parker nhờ Doctor Strange giúp đỡ nhưng một phép thuật sai lệch đã mở ra đa vũ trụ.',
    releaseYear: 2021,
    type: 'single',
    duration: '148 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    thumbnailUrl: 'https://images8.alphacoders.com/121/1218962.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    //rating: 8.2,
    director: 'Jon Watts',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-15'),
    view: 250,
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
    id: "16",
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
    view: 20,
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
    id: "17",
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
    id: "18",
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
    view: 50,
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
    id: "19",
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
    id: "20",
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
    view: 18,
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
    id: "21",
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
    view: 19,
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
    id: "22",
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
    view: 21,
    slug: 'john-wick-chapter-3-parabellum',
    tmdbScore: 7.4,
    imdbScore: 7.4,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [], // MovieActors for John Wick: Chapter 3
    genres: [mockGenres[0], mockGenres[7]], // Hành động, Tội phạm
    episodes: [] // No specific episode for this movie
  },

  {
    id: "23",
    title: 'Interstellar',
    originalName: 'Interstellar',
    description: 'Một nhóm phi hành gia thực hiện nhiệm vụ tìm kiếm hành tinh mới cho nhân loại khi Trái Đất đang dần trở nên không thể sống được.',
    releaseYear: 2014,
    type: 'single',
    duration: '169 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/8N0DNa9y5cfYEhU9JGedDg7APdU.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    director: 'Christopher Nolan',
    status: 'completed',
    createdAt: new Date('2024-03-01'),
    modifiedAt: new Date('2024-03-01'),
    view: 30,
    slug: 'interstellar',
    tmdbScore: 8.6,
    imdbScore: 8.6,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[4], mockGenres[5], mockGenres[6]], // Khoa học viễn tưởng, Phiêu lưu, Tâm lý
    episodes: []
  },

  {
    id: "24",
    title: 'Inception',
    originalName: 'Inception',
    description: 'Dom Cobb, một kẻ trộm chuyên nghiệp, được giao nhiệm vụ xâm nhập vào giấc mơ của người khác để đánh cắp thông tin.',
    releaseYear: 2010,
    type: 'single',
    duration: '148 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    director: 'Christopher Nolan',
    status: 'completed',
    createdAt: new Date('2024-03-02'),
    modifiedAt: new Date('2024-03-02'),
    view: 25,
    slug: 'inception',
    tmdbScore: 8.8,
    imdbScore: 8.8,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[4], mockGenres[14], mockGenres[6]], // Khoa học viễn tưởng, Bí ẩn, Tâm lý
    episodes: []
  },

  {
    id: "25",
    title: 'The Matrix',
    originalName: 'The Matrix',
    description: 'Neo, một hacker máy tính, phát hiện ra rằng thế giới mà anh ta đang sống chỉ là một mô phỏng do máy móc tạo ra.',
    releaseYear: 1999,
    type: 'single',
    duration: '136 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/aoiY3b5g2x9F0w3G1GJ4f3Xz.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    director: 'The Wachowskis',
    status: 'completed',
    createdAt: new Date('2024-03-03'),
    modifiedAt: new Date('2024-03-03'),
    view: 40,
    slug: 'the-matrix',
    tmdbScore: 8.7,
    imdbScore: 8.7,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[4], mockGenres[0], mockGenres[14]], // Khoa học viễn tưởng, Hành động, Bí ẩn
    episodes: []
  },

  {
    id: "26",
    title: 'The Godfather',
    originalName: 'The Godfather',
    description: 'Câu chuyện về gia đình mafia Corleone và cuộc đấu tranh quyền lực trong thế giới ngầm.',
    releaseYear: 1972,
    type: 'single',
    duration: '175 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/6xKCYgH16UzM77zZ4UnZ4F3Xz.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=sY1S34973zA',
    director: 'Francis Ford Coppola',
    status: 'completed',
    createdAt: new Date('2024-03-04'),
    modifiedAt: new Date('2024-03-04'),
    view: 50,
    slug: 'the-godfather',
    tmdbScore: 9.2,
    imdbScore: 9.2,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[7], mockGenres[6]], // Tội phạm, Tâm lý
    episodes: []
  },

  {
    id: "27",
    title: 'The Shawshank Redemption',
    originalName: 'The Shawshank Redemption',
    description: 'Andy Dufresne, một người đàn ông bị kết án oan, tìm cách vượt qua cuộc sống trong tù và giành lại tự do.',
    releaseYear: 1994,
    type: 'single',
    duration: '142 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    director: 'Frank Darabont',
    status: 'completed',
    createdAt: new Date('2024-03-05'),
    modifiedAt: new Date('2024-03-05'),
    view: 60,
    slug: 'the-shawshank-redemption',
    tmdbScore: 9.3,
    imdbScore: 9.3,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[6], mockGenres[13]], // Tâm lý, Gia đình
    episodes: []
  },

  {
    id: "28",
    title: 'Titanic',
    originalName: 'Titanic',
    description: 'Câu chuyện tình yêu giữa Jack và Rose trên con tàu Titanic định mệnh.',
    releaseYear: 1997,
    type: 'single',
    duration: '195 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/6VmFqApQRyZZzmiGOQq2C92jyvH.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kVrqfYjkTdQ',
    director: 'James Cameron',
    status: 'completed',
    createdAt: new Date('2024-03-06'),
    modifiedAt: new Date('2024-03-06'),
    view: 70,
    slug: 'titanic',
    tmdbScore: 7.8,
    imdbScore: 7.8,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[3], mockGenres[13]], // Tình cảm, Gia đình
    episodes: []
  },

  {
    id: "29",
    title: 'Avatar',
    originalName: 'Avatar',
    description: 'Jake Sully, một cựu lính thủy đánh bộ, được gửi đến hành tinh Pandora và tham gia vào cuộc chiến bảo vệ người Na\'vi.',
    releaseYear: 2009,
    type: 'single',
    duration: '162 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=5PSNL1qE6VY',
    director: 'James Cameron',
    status: 'completed',
    createdAt: new Date('2024-03-07'),
    modifiedAt: new Date('2024-03-07'),
    view: 80,
    slug: 'avatar',
    tmdbScore: 7.9,
    imdbScore: 7.9,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[4], mockGenres[5], mockGenres[6]], // Khoa học viễn tưởng, Phiêu lưu, Tâm lý
    episodes: []
  },

  {
    id: "30",
    title: 'The Lion King',
    originalName: 'The Lion King',
    description: 'Simba, một chú sư tử trẻ, phải đối mặt với trách nhiệm làm vua sau cái chết của cha mình.',
    releaseYear: 1994,
    type: 'hoathinh',
    duration: '88 min',
    posterUrl: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/2dH8T3OeXxqjPp8aQYV7e7K1x.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=4sj1MT05lAA',
    director: 'Roger Allers, Rob Minkoff',
    status: 'completed',
    createdAt: new Date('2024-03-08'),
    modifiedAt: new Date('2024-03-08'),
    view: 90,
    slug: 'the-lion-king',
    tmdbScore: 8.5,
    imdbScore: 8.5,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[9], mockGenres[13]], // Hoạt hình, Gia đình
    episodes: []
  },

  {
    id: "31",
    title: 'Phi vụ động trời',
    originalName: 'Zootopia',
    description: 'Từ con voi lớn nhất đến Shrew nhỏ nhất, thành phố Zootopia là một đô thị động vật có vú, nơi động vật khác nhau sống và phát triển mạnh. Khi Judy Hopps trở thành con thỏ đầu tiên tham gia lực lượng cảnh sát, cô nhanh chóng học được sự khó khăn như thế nào để thực thi luật pháp. Quyết tâm chứng minh mình, Judy nhảy vào cơ hội để giải quyết một vụ án bí ẩn. Thật không may, điều đó có nghĩa là làm việc với Nick Wilde, một Fily Fox, người khiến công việc của cô ấy trở nên khó khăn hơn nữa.',
    releaseYear: 2016,
    type: 'hoathinh',
    duration: '108 min',
    posterUrl: 'https://img.ophim.live/uploads/movies/phi-vu-dong-troi-thumb.jpg',
    thumbnailUrl: 'https://img.ophim.live/uploads/movies/phi-vu-dong-troi-poster.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=jWM0ct-OLsM',
    director: 'Byron Howard, Rich Moore',
    status: 'completed',
    totalEpisodes: 1,
    currentEpisode: 1,
    createdAt: new Date('2024-06-10'),
    modifiedAt: new Date('2024-06-10'),
    view: 20,
    slug: 'phi-vu-dong-troi',
    tmdbScore: 8.0,
    imdbScore: 8.0,
    PopRating: 8.0,
    lang: 'Vietsub',
    country: [mockCountries[5]], // Hoa Kỳ
    actors: [],
    genres: [mockGenres[9], mockGenres[13], mockGenres[12], mockGenres[10],mockGenres[8], mockGenres[7],mockGenres[6], mockGenres[5], mockGenres[4], mockGenres[2],mockGenres[1], mockGenres[3],], // Hoạt hình, Gia đình
    episodes: []
  }
];