export interface User {
    id: string;
    username: string;
    fullname: string;
    email: string;
    gender: string;
    avatarUrl?: string;
    createdAt: Date;
    role?: String;
}

export type FilterGender = 'all' | 'male' | 'female';
export type FilterRole = 'all' | 'Admin' | 'User';