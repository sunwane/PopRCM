export interface User {
    id: string;
    userName: string;
    fullName: string;
    email: string;
    gender: string;
    avatarUrl?: string;
    createdAt: Date;
    role?: string;
}

// Response từ localhost API  
export interface UserResponse {
    id: string;
    userName: string;
    fullName: string;
    email: string;
    gender: string;
    avatarUrl?: string;
    createdAt: string; // ISO string từ API
    role?: string;
}

export interface ApiResponse<T> {
    code?: number;
    message?: string;
    result: T;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface AvatarUploadResponse {
    id: string;
    avatarUrl: string;
}

export type FilterGender = 'ALL' | 'MALE' | 'FEMALE';
export type FilterRole = 'ALL' | 'ADMIN' | 'USER';