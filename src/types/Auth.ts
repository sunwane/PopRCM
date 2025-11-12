import { User } from './User';

//copy từ dự án cũ sang, chưa chỉnh sửa gì, có thể cần thay đổi sau

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  gender: string; 
  verificationCode?: string; // Optional for registration
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordWithCodeRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface VerifyCodeResponse {
  message: string;
  isValid: boolean;
}

export interface PasswordResetResponse {
  message: string;
}