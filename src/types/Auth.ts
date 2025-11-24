import { User } from './User';

export interface AuthenticationRequest {
  email: string;
  password: string;
}

// Response từ backend API
export interface APIAuthResponse {
  code?: number;
  message: string;
  result?: AuthenticationResponse;
}

// Response từ backend authentication
export interface AuthenticationResponse {
  token: string;
  userId: string;
  refreshToken?: string;
  authenticated: boolean;
}

// Response đã được xử lý cho frontend
export interface AuthResponse {
  token: string;
  userId: string;
  user?: Omit<User, 'password'>;
  refreshToken?: string;
  authenticated?: boolean;  
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}