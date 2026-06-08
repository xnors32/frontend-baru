import { apiClient, unwrap } from './client'
import type { ApiResponse, Notifikasi } from '@/types/api'

export const notifikasiApi = {
  getMy: () => unwrap(apiClient.get<ApiResponse<Notifikasi[]>>('/notifikasi')),
  getUnreadCount: () =>
    apiClient
      .get<ApiResponse<{ count: number }>>('/notifikasi/unread-count')
      .then((r) => r.data.data.count),
  markAsRead: (id: number) =>
    unwrap(apiClient.patch<ApiResponse<void>>(`/notifikasi/${id}/read`)),
  markAllAsRead: () =>
    unwrap(apiClient.patch<ApiResponse<void>>('/notifikasi/read-all')),
}
