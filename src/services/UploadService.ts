export default class UploadService {
  private static UPLOAD_URL = '/api/upload/avatar';
  
  static async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('timestamp', Date.now().toString());

      const response = await fetch(this.UPLOAD_URL, {
        method: 'POST',
        body: formData,
        // headers: {
        //   'Authorization': `Bearer ${getAuthToken()}`, // Nếu cần auth
        // }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw new Error('Không thể tải lên avatar. Vui lòng thử lại.');
    }
  }

  static async deleteImage(avatarUrl: string): Promise<boolean> {
    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: avatarUrl }),
      });

      return response.ok;
    } catch (error) {
      console.error('Avatar delete error:', error);
      return false;
    }
  }

  // Fake upload cho development
  static async fakeUploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate upload success/failure
        if (Math.random() > 0.1) { // 90% success rate
          const fakeUrl = `https://api.example.com/uploads/avatars/${Date.now()}_${file.name}`;
          resolve(fakeUrl);
        } else {
          reject(new Error('Upload failed'));
        }
      }, 2000); // Simulate 2 second upload time
    });
  }
}