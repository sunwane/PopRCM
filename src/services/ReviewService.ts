import { Review, ReviewRequest, PaginatedReviews } from '@/types/Review';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ReviewService {
  // Get reviews for a movie (public)
  static async getReviewsByMovieId(
    movieId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedReviews> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/movies/${movieId}?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        return apiResponse.result;
      }
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Create or update a review (requires auth)
  static async createOrUpdateReview(
    movieId: string,
    reviewRequest: ReviewRequest
  ): Promise<Review> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/movies/${movieId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reviewRequest),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        return apiResponse.result;
      }
      throw new Error('Invalid API response');
    } catch (error) {
      console.error('Error creating/updating review:', error);
      throw error;
    }
  }

  // Delete a review (requires auth)
  static async deleteReview(reviewId: string): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}