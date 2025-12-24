export interface User {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  replies: Comment[];
}

export interface CommentRequest {
  content: string;
  parentId?: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface PaginatedComments {
  content: Comment[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}