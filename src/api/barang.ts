import { apiClient, unwrap } from './client'
import type { ApiResponse, Barang, BarangPayload } from '@/types/api'

export const barangApi = {
  getAll: () => unwrap(apiClient.get<ApiResponse<Barang[]>>('/barang')),
  getById: (id: number) => unwrap(apiClient.get<ApiResponse<Barang>>(`/barang/${id}`)),
  create: (payload: BarangPayload) =>
    unwrap(apiClient.post<ApiResponse<Barang>>('/barang', payload)),
  update: (id: number, payload: BarangPayload) =>
    unwrap(apiClient.patch<ApiResponse<Barang>>(`/barang/${id}`, payload)),
  remove: (id: number) => unwrap(apiClient.delete<ApiResponse<null>>(`/barang/${id}`)),
}
