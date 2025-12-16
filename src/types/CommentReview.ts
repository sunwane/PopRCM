import { User } from "@/types/User";

export interface Comment {
  id: string;
  user: User;
  episodeId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  likedByCurrentUser?: boolean;
  replies?: Comment[];
}

export interface Review {
  id: string;
  user: User;
  movieId?: string;
  rating: number; // Rating từ 1 đến 10
  content: string;
  createdAt: string;
}