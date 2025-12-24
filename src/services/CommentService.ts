import { Comment, CommentRequest, CommentUpdateRequest, PaginatedComments } from '@/types/Comment';
import { ApiResponse } from '@/types/APIResponse';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';

export class CommentService {
  // Get comments for an episode (public)
  static async getCommentsByEpisodeId(
    episodeId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedComments> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/comments/episodes/${episodeId}?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Post a comment (requires auth)
  static async createComment(
    episodeId: string,
    commentRequest: CommentRequest
  ): Promise<Comment> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/api/comments/episodes/${episodeId}/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(commentRequest),
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
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // Update a comment (requires auth)
  static async updateComment(
    commentId: string,
    updateRequest: CommentUpdateRequest
  ): Promise<Comment> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateRequest),
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
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  // Delete a comment (requires auth)
  static async deleteComment(commentId: string): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${commentId}`,
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
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Toggle like on a comment (requires auth)
  static async toggleLike(commentId: string): Promise<Comment> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${commentId}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
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
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }
}