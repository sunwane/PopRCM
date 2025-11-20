class ServiceChecker {
  private static instance: ServiceChecker;
  private serviceAvailable: boolean | null = null;
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

  constructor() {
    if (ServiceChecker.instance) {
      return ServiceChecker.instance;
    }
    ServiceChecker.instance = this;

    // Kiểm tra trạng thái từ localStorage khi khởi tạo
    if (typeof window !== 'undefined') {
      const cachedStatus = localStorage.getItem('serviceAvailable');
      if (cachedStatus !== null) {
        this.serviceAvailable = cachedStatus === 'true';
        console.log(`ServiceChecker initialized with cached status: ${this.serviceAvailable}`);
      }
    }
  }

  /**
   * Kiểm tra xem service backend có khả dụng hay không
   */
  async checkServiceAvailability(): Promise<boolean> {
    // Nếu đã kiểm tra và có kết quả trong bộ nhớ, trả về kết quả đó
    if (this.serviceAvailable !== null) {
      return this.serviceAvailable;
    }

    try {
      // Thử gọi endpoint /api/genres để kiểm tra service
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout 3 giây

      const response = await fetch(`${this.baseURL}/genres`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Lưu kết quả vào bộ nhớ và localStorage
      this.serviceAvailable = response.ok;
      console.log(`Service availability check: ${this.serviceAvailable ? 'Available' : 'Unavailable'}`);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('serviceAvailable', this.serviceAvailable ? 'true' : 'false');
      }

      return this.serviceAvailable;
    } catch (error) {
      console.warn('Backend service not available, using mock data:', error);

      // Nếu lỗi, đánh dấu service không khả dụng và lưu vào localStorage
      this.serviceAvailable = false;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('serviceAvailable', 'false');
      }
      return false;
    }
  }

  /**
   * Reset trạng thái kiểm tra service (để kiểm tra lại)
   */
  resetServiceCheck(): void {
    this.serviceAvailable = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('serviceAvailable');
    }
    console.log('ServiceChecker reset: Cleared cached status');
  }

  /**
   * Lấy trạng thái hiện tại của service
   */
  isServiceAvailable(): boolean | null {
    return this.serviceAvailable;
  }

  /**
   * Lấy base URL của API
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

export default new ServiceChecker();