"use client";
import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
  code: string;
}

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin, onSuccess }: ForgotPasswordFormProps) {
  const { authLoading, authError, clearAuthError, sendVerificationCode, resetPassword } = useAuth();
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
    newPassword: '',
    confirmPassword: '',
    code: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    clearAuthError();
  };

  const handleSendCode = async () => {
    try {
      await sendVerificationCode(formData.email);
    } catch (err) {
      // Error handled in useAuth
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }
    
    try {
      await resetPassword(formData.email, formData.newPassword, formData.code);
      onSuccess();
    } catch (err) {
      // Error handled in useAuth
    }
  };

  return (
    <div className="w-full">
      <div className="text-left lg:mb-6 md:mb-6 mb-4">
        <h2 className="lg:text-2xl md:text-2xl sm:text-xl text-lg font-extrabold tracking-wide text-white mb-1">Đặt lại mật khẩu</h2>
        <p className="text-gray-400 lg:text-sm md:text-sm text-xs">
          Nhớ lại mật khẩu?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-(--hover) hover:text-blue-400 font-medium transition-colors"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-3">
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

        {/* Code Input with Send Button */}
        <div className="flex gap-2 items-center">
          <FormInput
            type="text"
            name="code"
            placeholder="Mã xác thực (6 số)"
            value={formData.code}
            onChange={handleChange}
            required
            maxLength={6}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={authLoading || !formData.email}
            className="w-48 min-w-32 text-nowrap bg-blue-600 text-white hover:bg-blue-700 font-medium py-3 px-4 rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {authLoading ? "Đang gửi mã..." : "Gửi mã"}
          </button>
        </div>

        {/* New Password Input */}
        <FormInput
          type="password"
          name="newPassword"
          placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
          value={formData.newPassword}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        {/* Confirm Password Input */}
        <FormInput
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu mới"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        {/* Password match validation */}
        {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            Mật khẩu không khớp
          </div>
        )}

        {/* Error Message */}
        {authError && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {authError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={authLoading || formData.code.length !== 6 || formData.newPassword.length < 6 || formData.newPassword !== formData.confirmPassword}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed mt-1"
        >
          {authLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
}