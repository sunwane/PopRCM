import { Episode } from '../types/Movies';

// Mock Episodes
export const mockEpisodes: Episode[] = [
  // Episodes for Movie ID 1 (Avengers: Endgame)
  {
    id: 1,
    title: 'Avengers: Endgame',
    episodeNumber: 1,
    createdAt: new Date('2024-01-15'),
    videoUrl: 'https://example.com/videos/avengers-endgame.mp4',
    m3u8Url: 'https://example.com/streams/avengers-endgame.m3u8',
    serverName: 'Server 1'
  },
  
  // Episodes for Movie ID 2 (Stranger Things - Series)
  {
    id: 2,
    title: 'The Vanishing of Will Byers',
    episodeNumber: 1,
    createdAt: new Date('2024-01-20'),
    videoUrl: 'https://example.com/videos/stranger-things-s1e1.mp4',
    m3u8Url: 'https://example.com/streams/stranger-things-s1e1.m3u8',
    serverName: 'Server 1'
  },
  {
    id: 3,
    title: 'The Weirdo on Maple Street',
    episodeNumber: 2,
    createdAt: new Date('2024-01-20'),
    videoUrl: 'https://example.com/videos/stranger-things-s1e2.mp4',
    m3u8Url: 'https://example.com/streams/stranger-things-s1e2.m3u8',
    serverName: 'Server 1'
  },
  {
    id: 4,
    title: 'Holly, Jolly',
    episodeNumber: 3,
    createdAt: new Date('2024-01-20'),
    videoUrl: 'https://example.com/videos/stranger-things-s1e3.mp4',
    m3u8Url: 'https://example.com/streams/stranger-things-s1e3.m3u8',
    serverName: 'Server 2'
  },
  
  // Episodes for Movie ID 5 (Kingdom - Korean Series)
  {
    id: 5,
    title: 'Episode 1',
    episodeNumber: 1,
    createdAt: new Date('2024-02-01'),
    videoUrl: 'https://example.com/videos/kingdom-s1e1.mp4',
    m3u8Url: 'https://example.com/streams/kingdom-s1e1.m3u8',
    serverName: 'Server 1'
  },
  {
    id: 6,
    title: 'Episode 2',
    episodeNumber: 2,
    createdAt: new Date('2024-02-01'),
    videoUrl: 'https://example.com/videos/kingdom-s1e2.mp4',
    m3u8Url: 'https://example.com/streams/kingdom-s1e2.m3u8',
    serverName: 'Server 1'
  },
  {
    id: 7,
    title: 'Episode 3',
    episodeNumber: 3,
    createdAt: new Date('2024-02-01'),
    videoUrl: 'https://example.com/videos/kingdom-s1e3.mp4',
    m3u8Url: 'https://example.com/streams/kingdom-s1e3.m3u8',
    serverName: 'Server 2'
  },
  {
    id: 8,
    title: 'Episode 4',
    episodeNumber: 4,
    createdAt: new Date('2024-02-01'),
    videoUrl: 'https://example.com/videos/kingdom-s1e4.mp4',
    m3u8Url: 'https://example.com/streams/kingdom-s1e4.m3u8',
    serverName: 'Server 2'
  },
  {
    id: 9,
    title: 'Episode 5',
    episodeNumber: 5,
    createdAt: new Date('2024-02-01'),
    videoUrl: 'https://example.com/videos/kingdom-s1e5.mp4',
    m3u8Url: 'https://example.com/streams/kingdom-s1e5.m3u8',
    serverName: 'Server 3'
  },
  {
    id: 10,
    title: 'Episode 6',
    episodeNumber: 6,
    createdAt: new Date('2024-02-01'),
    videoUrl: 'https://example.com/videos/kingdom-s1e6.mp4',
    m3u8Url: 'https://example.com/streams/kingdom-s1e6.m3u8',
    serverName: 'Server 3'
  },
  
  // Episodes for Movie ID 8 (One Piece - Anime Series)
  {
    id: 11,
    title: 'I\'m Luffy! The Man Who\'s Gonna Be King of the Pirates!',
    episodeNumber: 1,
    createdAt: new Date('2024-03-01'),
    videoUrl: 'https://example.com/videos/one-piece-e1.mp4',
    m3u8Url: 'https://example.com/streams/one-piece-e1.m3u8',
    serverName: 'Server 1'
  },
  {
    id: 12,
    title: 'Enter the Great Swordsman!',
    episodeNumber: 2,
    createdAt: new Date('2024-03-01'),
    videoUrl: 'https://example.com/videos/one-piece-e2.mp4',
    m3u8Url: 'https://example.com/streams/one-piece-e2.m3u8',
    serverName: 'Server 1'
  },
  {
    id: 13,
    title: 'Morgan versus Luffy!',
    episodeNumber: 3,
    createdAt: new Date('2024-03-01'),
    videoUrl: 'https://example.com/videos/one-piece-e3.mp4',
    m3u8Url: 'https://example.com/streams/one-piece-e3.m3u8',
    serverName: 'Server 2'
  }
];