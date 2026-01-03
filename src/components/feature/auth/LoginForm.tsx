"use client";
import { useState } from "react";
import { GoogleLogin} from '@react-oauth/google';
import { FormInput } from "@/components/ui/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { LoginRequest } from "@/types/Auth";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword, onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      
      // Lấy idToken từ Google Identity Services
      const idToken = credentialResponse.credential;
      
      if (!idToken) {
        throw new Error('Không nhận được token từ Google');
      }
      
      // Gửi idToken sang backend qua AuthProvider
      await loginWithGoogle(idToken);
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại');
    }
  };

  const handleGoogleError = () => {
    setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
  };

  return (
    <div className="w-full">
      <div className="text-left lg:mb-6 md:mb-6 mb-4">
        <h2 className="lg:text-2xl md:text-2xl text-lg font-extrabold tracking-wide text-white mb-1">Đăng nhập</h2>
        <div className="text-gray-400 flex items-center gap-1 lg:text-sm md:text-sm text-xs">
          <div>Chưa có tài khoản?</div> 
          <button
            onClick={onSwitchToRegister}
            className="text-(--hover) hover:text-blue-400 font-medium transition-colors"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email Input */}
        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        {/* Password Input */}
        <FormInput
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full lg:text-sm md:text-sm text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed mt-1"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-white hover:text-(--hover) lg:text-sm md:text-sm text-xs transition-colors lg:mb-6 md:mb-6 mb-4"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Google Login Button - Phiên bản mặc định với CSS tùy chỉnh */}
        <div className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            shape="pill"
            size="large"
            width="100%"
            text="signin_with"
            logo_alignment="left"
          />
        </div>
      </form>
    </div>
  );
}