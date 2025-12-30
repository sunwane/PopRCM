/**
 * Utility functions for file upload validation
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate image file for upload
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: 'Vui lòng chọn file để tải lên'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: 'Định dạng file không hỗ trợ. Vui lòng chọn file JPG, PNG, GIF hoặc WebP'
    };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `Kích thước file (${fileSizeMB}MB) vượt quá giới hạn 5MB`
    };
  }

  // Check minimum file size (avoid empty files)
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    return {
      isValid: false,
      error: 'File quá nhỏ. Vui lòng chọn file ảnh hợp lệ'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 * @param filename - Name of the file
 * @returns File extension in lowercase
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Check if file is an image based on extension
 * @param filename - Name of the file
 * @returns True if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
}