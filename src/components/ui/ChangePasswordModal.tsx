'use client';

import { useState } from 'react';
import { FormInput } from './FormInput';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export default function ChangePasswordModal({ 
  isOpen, 
  onClose, 
  onChangePassword 
}: ChangePasswordModalProps) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại!');
      return;
    }

    setLoading(true);
    try {
      const success = await onChangePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (success) {
        // Reset form and close modal on success
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        onClose();
      }
    } catch (error: any) {
      setError(error.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-(--background) border border-(--surface-divine) rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            Đổi mật khẩu
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className=''>
              <div className="block text-gray-200 font-medium text-sm mb-1">
                Mật khẩu hiện tại
              </div>
              <FormInput
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu hiện tại"
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="block text-gray-200 font-medium text-sm mb-1">
                Mật khẩu mới
              </div>
              <FormInput
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="block text-gray-200 font-medium text-sm mb-1">
                Nhập lại mật khẩu mới
              </div>
              <FormInput
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handleInputChange}
                placeholder="Xác nhận mật khẩu mới"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors font-medium border border-(--border-blue)/30"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-(--gradient-primary-start) text-white rounded-lg hover:bg-(--primary)/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                'Đổi mật khẩu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}