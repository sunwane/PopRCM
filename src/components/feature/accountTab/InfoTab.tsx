"use client";
import { useState, useRef, useEffect } from 'react';
import { useUserData } from '@/hooks/useData/useUserData';
import { useAuth } from '@/hooks/useAuth';
import GradientAvatar from '@/components/ui/GradientAvatar';
import { FormInput } from '@/components/ui/FormInput';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import { validateImageFile } from '@/utils/uploadUtils';

export default function InfoTab() {
  const { userProfile, loading, error, updateProfile, uploadAvatar, deleteAvatar, getUserAvatarText, clearError } = useUserData();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    email: '',
    gender: 'male' as 'male' | 'female'
  });
  const [originalFormData, setOriginalFormData] = useState({
    userName: '',
    fullName: '',
    email: '',
    gender: 'male' as 'male' | 'female'
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarError, setAvatarError] = useState('');

  // Initialize form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      const data = {
        userName: userProfile.userName || '',
        fullName: userProfile.fullName || userProfile.userName || '',
        email: userProfile.email || '',
        gender: (userProfile.gender as 'male' | 'female') || 'male'
      };
      setFormData(data);
      setOriginalFormData(data);
      setPreviewUrl(userProfile.avatarUrl || '');
    }
  }, [userProfile]);

  const handleEditProfileToggle = () => {
    if (isEditingProfile) {
      // Reset form data if canceling
      setFormData(originalFormData);
      clearError();
    }
    setIsEditingProfile(!isEditingProfile);
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
      userName: formData.userName,
      fullName: formData.fullName,
      email: formData.email,
      gender: formData.gender
    });

    if (success) {
      setSuccessMessage('Thông tin đã được cập nhật thành công! Trang sẽ được tải lại...');
      setIsEditingProfile(false);
      const updatedData = {
        userName: formData.userName,
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender
      };
      setOriginalFormData(updatedData);
    }
  };

  // Avatar handlers
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userProfile) {
      // Clear previous errors
      setAvatarError('');
      
      // Validate file using utility function
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setAvatarError(validation.error || 'File không hợp lệ');
        return;
      }
      
      setAvatarUploading(true);
      const avatarUrl = await uploadAvatar(userProfile.id, file);
      if (avatarUrl) {
        setPreviewUrl(avatarUrl);
        setSuccessMessage('Avatar đã được cập nhật thành công! Trang sẽ được tải lại...');
      }
      setAvatarUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChangeAvatar = () => {
    setAvatarError(''); // Clear error when opening file picker
    fileInputRef.current?.click();
  };

  const handleDeleteAvatar = async () => {
    if (userProfile && (userProfile.avatarUrl || previewUrl)) {
      setAvatarUploading(true);
      const success = await deleteAvatar(userProfile.id);
      if (success) {
        setPreviewUrl('');
        setSuccessMessage('Avatar đã được xóa thành công! Trang sẽ được tải lại...');
      }
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
    <div className="space-y-8">
      {/* Error display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400 flex items-center space-x-2">
          <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 md:col-span-7 gap-8">
        {/* Profile Information - Right Column */}
        <div className="lg:col-span-4 md:col-span-4">
          <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Thông tin cá nhân</h3>
            </div>

            {/* Profile Form */}
            <div className="space-y-4 px-4">
              <div className='flex space-x-2'>
                {/* Username */}
                <FormInput
                  label="Tên đăng nhập"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  disabled={!isEditingProfile || loading}
                  customLabelStyle='text-base text-gray-400'
                  required
                />

                {/* Full Name */}
                <FormInput
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên"
                  customLabelStyle='text-base text-gray-400'
                  disabled={!isEditingProfile || loading}
                  required
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block font-medium mb-2 text-base text-gray-400">
                  Email
                </label>
                <div className="px-4 py-3 bg-white/5 rounded-lg text-gray-400">
                  {formData.email}
                </div>
                <p className="text-xs text-gray-500 mt-2">Email không thể thay đổi</p>
              </div>

              {/* Gender */}
              <FormInput
                variant="gender"
                label="Giới tính"
                genderValue={formData.gender}
                onGenderChange={(value) => handleInputChange('gender', value)}
                disabled={!isEditingProfile || loading}
                customLabelStyle='text-base text-gray-400'
              />
            </div>

            <button
                onClick={handleEditProfileToggle}
                disabled={loading}
                className={`px-6 py-2.5 font-bold text-sm mt-8 rounded-lg transition ${
                  isEditingProfile 
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-(--gradient-primary-start) text-white hover:bg-(--gradient-primary-start)/80'
                } disabled:opacity-50`}
              >
                {isEditingProfile ? 'Hủy' : 'Chỉnh sửa'}
            </button>

            <div className='flex items-center space-x-1 mt-5 text-gray-300'>
              <div>Để thay đổi mật khẩu, nhấp vào</div>
              <button className='text-(--hover) font-bold hover:text-(--primary)'>đây</button>
            </div>

            {/* Save Button */}
            {isEditingProfile && (
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
        {/* Avatar Section - Left Column */}
        <div className="lg:col-span-3 md:col-span-3">
          <div className="bg-(--primary)/10 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4 mt-2">Ảnh đại diện</h3>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div>
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt={userProfile?.fullName || userProfile?.userName}
                        className="w-56 h-56 rounded-full object-cover border-2 border-(--primary)"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={previewUrl ? 'hidden' : ''}>
                      <GradientAvatar 
                        initial={getUserAvatarText(userProfile?.fullName)} 
                        size="w-56 h-56 text-6xl"
                      />
                    </div>
                    
                    {/* Loading overlay */}
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <svg className="animate-spin w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar Actions - Simple buttons like admin */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleChangeAvatar}
                    disabled={avatarUploading || loading}
                    className="px-5 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : 'Thay đổi ảnh'}
                  </button>
                  
                  {/* Chỉ hiện nút xóa khi có ảnh */}
                  {(previewUrl || userProfile?.avatarUrl) && (
                    <button
                      onClick={handleDeleteAvatar}
                      disabled={avatarUploading || loading}
                      className="px-5 py-2 bg-(--surface)/50 text-blue-400 border-2 border-(--border-blue) rounded-lg hover:bg-(--surface)/70 transition disabled:opacity-50"
                    >
                      {loading ? 'Đang xóa...' : 'Xóa ảnh'}
                    </button>
                  )}
                </div>

                {/* Avatar Error Message */}
                {avatarError && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                    {avatarError}
                  </div>
                )}

                {/* Avatar Upload Info */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    Hỗ trợ: JPG, PNG, GIF, WebP
                  </p>
                  <p className="text-xs text-gray-500">
                    Kích thước tối đa: 5MB
                  </p>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
