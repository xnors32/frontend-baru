import { apiClient, unwrap } from './client'
import type {
  ApiResponse,
  Peminjaman,
  PeminjamanPayload,
  ReturnDetailPayload,
} from '@/types/api'

export const peminjamanApi = {
  getAll: () => unwrap(apiClient.get<ApiResponse<Peminjaman[]>>('/peminjaman')),
  getMy: () => unwrap(apiClient.get<ApiResponse<Peminjaman[]>>('/peminjaman')),
  getById: (id: number) =>
    unwrap(apiClient.get<ApiResponse<Peminjaman>>(`/peminjaman/${id}`)),
  create: (payload: PeminjamanPayload) =>
    unwrap(apiClient.post<ApiResponse<Peminjaman>>('/peminjaman', payload)),
  approve: (id: number) =>
    unwrap(apiClient.patch<ApiResponse<Peminjaman>>(`/peminjaman/${id}/approve`)),
  reject: (id: number) =>
    unwrap(apiClient.patch<ApiResponse<Peminjaman>>(`/peminjaman/${id}/reject`)),
  return: (id: number, details?: ReturnDetailPayload[]) => {
    const body = details?.length ? { details } : undefined
    return unwrap(
      apiClient.patch<ApiResponse<Peminjaman>>(`/peminjaman/${id}/kembalikan`, body),
    )
  },
}
