import apiService from './apiService';

class AIService {
  /**
   * Analyze code using backend AI endpoint
   * @param {string} code - The code to analyze
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeCode(code) {
    try {
      const response = await apiService.post('/ai/analyze', { code });
      return response;
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }

  /**
   * Send chat message to backend AI assistant
   * @param {string} message - User message
   * @param {Array} history - Chat history
   * @param {string} [conversationId] - Active conversation ID
   * @returns {Promise<Object>} AI response data containing reply and conversationId
   */
  async chat(message, history = [], conversationId = null) {
    try {
      const response = await apiService.post('/ai/chat', { message, history, conversationId });
      return response; // Returns { reply, conversationId }
    } catch (error) {
      console.error('AI chat failed:', error);
      throw error;
    }
  }

  /**
   * Get user chat histories
   */
  async getConversations() {
    return await apiService.get('/ai/conversations');
  }

  /**
   * Get specific chat messages
   */
  async getConversationById(id) {
    return await apiService.get(`/ai/conversations/${id}`);
  }

  /**
   * Delete a chat history
   */
  async deleteConversation(id) {
    return await apiService.delete(`/ai/conversations/${id}`);
  }

  /**
   * Get user code reviews
   */
  async getReviews() {
    return await apiService.get('/ai/reviews');
  }

  /**
   * Get specific review details
   */
  async getReviewById(id) {
    return await apiService.get(`/ai/reviews/${id}`);
  }

  /**
   * Delete a review
   */
  async deleteReview(id) {
    return await apiService.delete(`/ai/reviews/${id}`);
  }
}

export const aiService = new AIService();
export default aiService;
