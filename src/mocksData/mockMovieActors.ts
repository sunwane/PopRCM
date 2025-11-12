import { MovieActor } from '@/types/Actor';

// Mock MovieActors relationship data with IDs only
export const mockMovieActors: MovieActor[] = [
  // Avengers: Endgame (Movie ID: 1)
  {
    id: 'ma-001',
    movieId: 1,
    actorId: '1', // Robert Downey Jr.
    characterName: 'Tony Stark / Iron Man'
  },
  {
    id: 'ma-002',
    movieId: 1,
    actorId: '2', // Scarlett Johansson
    characterName: 'Natasha Romanoff / Black Widow'
  },
  {
    id: 'ma-003',
    movieId: 1,
    actorId: '5', // Leonardo DiCaprio
    characterName: 'Steve Rogers / Captain America'
  },

  // Stranger Things (Movie ID: 2)
  {
    id: 'ma-004',
    movieId: 2,
    actorId: '12', // Winona Ryder
    characterName: 'Joyce Byers'
  },
  {
    id: 'ma-005',
    movieId: 2,
    actorId: '9', // Jennifer Lawrence
    characterName: 'Eleven'
  },

  // Mắt Biếc (Movie ID: 3)
  {
    id: 'ma-006',
    movieId: 3,
    actorId: '3', // Tom Holland
    characterName: 'Ngạn'
  },
  {
    id: 'ma-007',
    movieId: 3,
    actorId: '4', // Emma Stone
    characterName: 'Hà Lan'
  },

  // Parasite (Movie ID: 4)
  {
    id: 'ma-008',
    movieId: 4,
    actorId: '7', // Tom Hanks
    characterName: 'Ki-taek'
  },
  {
    id: 'ma-009',
    movieId: 4,
    actorId: '8', // Willem Dafoe
    characterName: 'Ki-woo'
  },

  // Kingdom (Movie ID: 5)
  {
    id: 'ma-010',
    movieId: 5,
    actorId: '6', // Anne Hathaway
    characterName: 'Crown Prince Lee Chang'
  },
  {
    id: 'ma-011',
    movieId: 5,
    actorId: '10', // Tom Cruise
    characterName: 'Seo-bi'
  },

  // Spirited Away (Movie ID: 6)
  {
    id: 'ma-012',
    movieId: 6,
    actorId: '11', // Keanu Reeves
    characterName: 'Haku (Voice)'
  },
  {
    id: 'ma-013',
    movieId: 6,
    actorId: '12', // Winona Ryder
    characterName: 'Chihiro (Voice)'
  },

  // The Dark Knight (Movie ID: 7)
  {
    id: 'ma-014',
    movieId: 7,
    actorId: '1', // Robert Downey Jr.
    characterName: 'Bruce Wayne / Batman'
  },
  {
    id: 'ma-015',
    movieId: 7,
    actorId: '8', // Willem Dafoe
    characterName: 'The Joker'
  },

  // One Piece (Movie ID: 8)
  {
    id: 'ma-016',
    movieId: 8,
    actorId: '3', // Tom Holland
    characterName: 'Monkey D. Luffy (Voice)'
  },
  {
    id: 'ma-017',
    movieId: 8,
    actorId: '5', // Leonardo DiCaprio
    characterName: 'Roronoa Zoro (Voice)'
  },

  // Cô Ba Sài Gòn (Movie ID: 9)
  {
    id: 'ma-018',
    movieId: 9,
    actorId: '2', // Scarlett Johansson
    characterName: 'Cô Ba'
  },
  {
    id: 'ma-019',
    movieId: 9,
    actorId: '9', // Jennifer Lawrence
    characterName: 'Cậu Tư'
  },

  // Train to Busan (Movie ID: 10)
  {
    id: 'ma-020',
    movieId: 10,
    actorId: '7', // Tom Hanks
    characterName: 'Seok-woo'
  },
  {
    id: 'ma-021',
    movieId: 10,
    actorId: '10', // Tom Cruise
    characterName: 'Sang-hwa'
  },

  // Your Name (Movie ID: 11)
  {
    id: 'ma-022',
    movieId: 11,
    actorId: '4', // Emma Stone
    characterName: 'Mitsuha (Voice)'
  },
  {
    id: 'ma-023',
    movieId: 11,
    actorId: '6', // Anne Hathaway
    characterName: 'Taki (Voice)'
  },

  // Squid Game (Movie ID: 12)
  {
    id: 'ma-024',
    movieId: 12,
    actorId: '11', // Keanu Reeves
    characterName: 'Seong Gi-hun'
  },
  {
    id: 'ma-025',
    movieId: 12,
    actorId: '12', // Winona Ryder
    characterName: 'Kang Sae-byeok'
  },

  // Spider-Man: Homecoming (Movie ID: 13)
  {
    id: 'ma-026',
    movieId: 13,
    actorId: '3', // Tom Holland
    characterName: 'Peter Parker / Spider-Man'
  },
  {
    id: 'ma-027',
    movieId: 13,
    actorId: '4', // Emma Stone
    characterName: 'MJ'
  },

  // Spider-Man: Far From Home (Movie ID: 14)
  {
    id: 'ma-028',
    movieId: 14,
    actorId: '3', // Tom Holland
    characterName: 'Peter Parker / Spider-Man'
  },
  {
    id: 'ma-029',
    movieId: 14,
    actorId: '9', // Jennifer Lawrence
    characterName: 'MJ'
  },

  // Spider-Man: No Way Home (Movie ID: 15)
  {
    id: 'ma-030',
    movieId: 15,
    actorId: '3', // Tom Holland
    characterName: 'Peter Parker / Spider-Man'
  },
  {
    id: 'ma-031',
    movieId: 15,
    actorId: '1', // Robert Downey Jr.
    characterName: 'Tony Stark / Iron Man'
  },

  // The Fast and the Furious (Movie ID: 16)
  {
    id: 'ma-032',
    movieId: 16,
    actorId: '7', // Tom Hanks
    characterName: 'Dominic Toretto'
  },
  {
    id: 'ma-033',
    movieId: 16,
    actorId: '10', // Tom Cruise
    characterName: 'Brian O\'Conner'
  },

  // Fast & Furious 6 (Movie ID: 17)
  {
    id: 'ma-034',
    movieId: 17,
    actorId: '7', // Tom Hanks
    characterName: 'Dominic Toretto'
  },
  {
    id: 'ma-035',
    movieId: 17,
    actorId: '10', // Tom Cruise
    characterName: 'Brian O\'Conner'
  },

  // Gia Đình Là Số 1 - Phần 1 (Movie ID: 18)
  {
    id: 'ma-036',
    movieId: 18,
    actorId: '2', // Scarlett Johansson
    characterName: 'Mẹ Linh'
  },
  {
    id: 'ma-037',
    movieId: 18,
    actorId: '4', // Emma Stone
    characterName: 'Lam Chi'
  },

  // Gia Đình Là Số 1 - Phần 2 (Movie ID: 19)
  {
    id: 'ma-038',
    movieId: 19,
    actorId: '2', // Scarlett Johansson
    characterName: 'Mẹ Linh'
  },
  {
    id: 'ma-039',
    movieId: 19,
    actorId: '4', // Emma Stone
    characterName: 'Lam Chi'
  },

  // John Wick (Movie ID: 20)
  {
    id: 'ma-040',
    movieId: 20,
    actorId: '11', // Keanu Reeves
    characterName: 'John Wick'
  },
  {
    id: 'ma-041',
    movieId: 20,
    actorId: '8', // Willem Dafoe
    characterName: 'Marcus'
  },

  // John Wick: Chapter 2 (Movie ID: 21)
  {
    id: 'ma-042',
    movieId: 21,
    actorId: '11', // Keanu Reeves
    characterName: 'John Wick'
  },
  {
    id: 'ma-043',
    movieId: 21,
    actorId: '8', // Willem Dafoe
    characterName: 'Marcus'
  },

  // John Wick: Chapter 3 - Parabellum (Movie ID: 22)
  {
    id: 'ma-044',
    movieId: 22,
    actorId: '11', // Keanu Reeves
    characterName: 'John Wick'
  },
  {
    id: 'ma-045',
    movieId: 22,
    actorId: '8', // Willem Dafoe
    characterName: 'Winston'
  }
];

export default mockMovieActors;