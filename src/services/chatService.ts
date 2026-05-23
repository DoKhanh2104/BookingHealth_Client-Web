import apiClient from '../api/apiClient';
import type { ApiResponse, ChatRoom, ChatMessage, SendMessageRequest } from '../types';

export const chatService = {
  /**
   * GET /chat-rooms/:appointmentId
   * Lấy/tạo phòng hội thoại của một lịch hẹn (PHONG_HOI_THOAI)
   */
  getRoomByAppointment: async (appointmentId: number): Promise<ApiResponse<ChatRoom>> => {
    const res = await apiClient.get(`/chat-rooms/appointment/${appointmentId}`);
    return res.data;
  },

  /**
   * GET /chat-rooms/:roomId/messages
   * Lấy danh sách tin nhắn trong phòng (TIN_NHAN)
   */
  getMessages: async (
    roomId: number,
    page = 0,
    size = 50
  ): Promise<ApiResponse<ChatMessage[]>> => {
    const res = await apiClient.get(`/chat-rooms/${roomId}/messages`, {
      params: { page, size },
    });
    return res.data;
  },

  /**
   * POST /chat-rooms/:roomId/messages
   * Gửi tin nhắn mới (TIN_NHAN)
   */
  sendMessage: async (data: SendMessageRequest): Promise<ApiResponse<ChatMessage>> => {
    const res = await apiClient.post(`/chat-rooms/${data.chatRoomId}/messages`, {
      content: data.content,
    });
    return res.data;
  },
};
