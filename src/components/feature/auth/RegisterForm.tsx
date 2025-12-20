"use client";
import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { useAuth } from "@/hooks/useAuth";

interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
  gender: string;
  code: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
  const { authError, clearAuthError, sendVerificationCode, register } = useAuth();
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    gender: 'male',
    code: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    clearAuthError();
  };

  const handleSendCode = async () => {
    if (!formData.email) return;
    
    try {
      setSendCodeLoading(true);
      await sendVerificationCode(formData.email);
      // Có thể thêm thông báo thành công ở đây nếu cần
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setSendCodeLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation trước khi gọi API
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    if (!formData.email || !formData.code || formData.code.length !== 6) {
      return;
    }
    
    try {
      setRegisterLoading(true);
      // Gọi API register với tất cả thông tin
      await register(formData);
      onSuccess();
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-left lg:mb-6 md:mb-6 sm:mb-4 mb-4">
        <h2 className="lg:text-2xl md:text-2xl sm:text-xl text-lg font-extrabold tracking-wide text-white mb-1">Đăng ký</h2>
        <p className="text-gray-400 lg:text-sm md:text-sm text-xs">
          Đã có tài khoản?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-(--hover) hover:text-blue-400 font-medium transition-colors"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>

      {/* Email Input - Riêng biệt để gửi mã */}
      <div className="space-y-3 mb-4">
        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <div className="flex gap-2 items-center">
          <FormInput
            type="text"
            name="code"
            placeholder="Mã xác thực (6 số)"
            value={formData.code}
            onChange={handleChange}
            required
            minLength={6}
            maxLength={6}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendCodeLoading || !formData.email}
            className="w-48 min-w-32 text-nowrap bg-gray-600 text-white hover:bg-gray-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {sendCodeLoading ? "Đang gửi mã..." : "Gửi mã"}
          </button>
        </div>
      </div>

      {/* Form đăng ký - Submit để đăng ký tài khoản */}
      <form onSubmit={handleRegister} className="space-y-3">
        {/* Username Input */}
        <FormInput
          type="text"
          name="username"
          placeholder="Tên người dùng"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Full Name Input */}
        <FormInput
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        {/* Gender Select */}
        <FormInput
          variant="gender"
          genderValue={formData.gender}
          onGenderChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
        />

        {/* Password Input */}
        <FormInput
          type="password"
          name="password"
          placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <FormInput
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        {/* Password Matching Validation */}
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
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

        {/* Submit Button - Chỉ để đăng ký tài khoản */}
        <button
          type="submit"
          disabled={
            registerLoading || 
            formData.password !== formData.confirmPassword ||
            !formData.email ||
            !formData.code ||
            !formData.username ||
            !formData.fullName ||
            !formData.password ||
            formData.code.length !== 6
          }
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed mt-1"
        >
          {registerLoading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
        </button>
      </form>
    </div>
  );
}