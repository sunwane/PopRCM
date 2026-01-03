import { User } from './User';

export interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface ReviewRequest {
  rating: number;
  content: string;
}

export interface PaginatedReviews {
  content: Review[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}