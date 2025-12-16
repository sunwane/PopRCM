"use client";
import { useState, useRef } from 'react';
import { useUserData } from '@/hooks/useData/useUserData';
import { useAuth } from '@/hooks/useAuth';
import GradientAvatar from '@/components/ui/GradientAvatar';
import { FormInput } from '@/components/ui/FormInput';
import { LoadingEffect } from '@/components/ui/LoadingEffect';

export default function InfoTab() {
  const { userProfile, loading, error, updateProfile, uploadAvatar, deleteAvatar, getUserAvatarText, clearError } = useUserData();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: 'male' as 'male' | 'female'
  });
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Initialize form data when userProfile changes
  useState(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || userProfile.userName || '',
        email: userProfile.email || '',
        gender: (userProfile.gender as 'male' | 'female') || 'male'
      });
    }
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling
      if (userProfile) {
        setFormData({
          fullName: userProfile.fullName || userProfile.userName || '',
          email: userProfile.email || '',
          gender: (userProfile.gender as 'male' | 'female') || 'male'
        });
      }
      clearError();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    if (field === 'gender' && Array.isArray(value)) {
      setFormData(prev => ({ ...prev, gender: value[0] as 'male' | 'female' }));
    } else if (typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;

    const success = await updateProfile(userProfile.id, {
      fullName: formData.fullName,
      email: formData.email,
      gender: formData.gender
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userProfile) {
      setAvatarUploading(true);
      await uploadAvatar(userProfile.id, file);
      setAvatarUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (userProfile && userProfile.avatarUrl) {
      setAvatarUploading(true);
      await deleteAvatar(userProfile.id);
      setAvatarUploading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Không thể tải thông tin tài khoản</div>
      </div>
    );
  }

  if (loading && !userProfile.id) {
    return <LoadingEffect message="Đang tải thông tin tài khoản..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Thông tin tài khoản</h2>
        <button
          onClick={handleEditToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-lg transition ${
            isEditing 
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-(--primary) text-white hover:bg-(--primary)/80'
          } disabled:opacity-50`}
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="bg-(--surface) rounded-xl p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div 
              className={`${isEditing ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity`}
              onClick={handleAvatarClick}
            >
              {userProfile.avatarUrl ? (
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName || userProfile.userName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-(--primary)/30"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={userProfile.avatarUrl ? 'hidden' : ''}>
                <GradientAvatar 
                  initial={getUserAvatarText(userProfile.fullName)} 
                  size="w-24 h-24 text-2xl"
                />
              </div>
              
              {/* Loading overlay */}
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <svg className="animate-spin w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}

              {/* Edit indicator */}
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-(--primary) rounded-full p-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Avatar Actions */}
          {isEditing && (
            <div className="flex space-x-3">
              <button
                onClick={handleAvatarClick}
                disabled={avatarUploading}
                className="px-3 py-2 text-sm bg-(--primary)/20 text-(--primary) rounded-lg hover:bg-(--primary)/30 transition disabled:opacity-50"
              >
                {userProfile.avatarUrl ? 'Thay đổi' : 'Tải lên'}
              </button>
              
              {userProfile.avatarUrl && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={avatarUploading}
                  className="px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
                >
                  Xóa
                </button>
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          {/* Username (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tên đăng nhập
            </label>
            <div className="px-4 py-3 bg-(--background) border border-(--border-blue) rounded-lg text-gray-400">
              {userProfile.userName}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tên đăng nhập không thể thay đổi</p>
          </div>

          {/* Full Name */}
          <FormInput
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Nhập họ và tên"
            disabled={!isEditing || loading}
            required
          />

          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Nhập địa chỉ email"
            disabled={!isEditing || loading}
            required
          />

          {/* Gender */}
          <FormInput
            variant="gender"
            label="Giới tính"
            genderValue={formData.gender}
            onGenderChange={(value) => handleInputChange('gender', value)}
            disabled={!isEditing || loading}
          />

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-(--border-blue)">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ngày tạo tài khoản
              </label>
              <div className="px-4 py-3 bg-(--background) border border-(--border-blue) rounded-lg text-gray-400">
                {new Date(userProfile.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vai trò
              </label>
              <div className="px-4 py-3 bg-(--background) border border-(--border-blue) rounded-lg text-gray-400 capitalize">
                {userProfile.role || 'User'}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-6 py-3 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
