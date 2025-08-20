import axios from 'axios';

const API_BASE_URL = '/api';

export interface ChatMessage {
  _id?: string;
  siteId: string;
  sender: string;
  message: string;
  timestamp: string;
  isUser: boolean;
}

// Get chat history for a site
export const getChatHistory = async (siteId: string): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/${siteId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch chat history');
  }
};

// Save a new chat message
export const saveChatMessage = async (messageData: Omit<ChatMessage, '_id'>): Promise<ChatMessage> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, messageData);
    return response.data;
  } catch (error: any) {
    console.error('Error saving chat message:', error);
    throw new Error(error.response?.data?.message || 'Failed to save chat message');
  }
};

// Delete chat history for a site (admin function)
export const deleteChatHistory = async (siteId: string): Promise<{ message: string; deletedCount: number }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/chat/${siteId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting chat history:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete chat history');
  }
}; 