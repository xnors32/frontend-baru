import { apiClient, unwrap } from './client'
import type { ApiResponse, DetailPeminjaman, DetailPeminjamanPayload } from '@/types/api'

export const detailPeminjamanApi = {
  getById: (id: number) =>
    unwrap(apiClient.get<ApiResponse<DetailPeminjaman>>(`/detail-peminjaman/${id}`)),
  create: (idPeminjaman: number, payload: DetailPeminjamanPayload) =>
    unwrap(
      apiClient.post<ApiResponse<DetailPeminjaman>>('/detail-peminjaman', payload, {
        params: { idPeminjaman },
      }),
    ),
  updateKondisi: (id: number, jumlahBaik: number, jumlahRusak: number) =>
    unwrap(
      apiClient.patch<ApiResponse<DetailPeminjaman>>(`/detail-peminjaman/${id}`, {
        idDetail: id,
        jumlahBaik,
        jumlahRusak,
      }),
    ),
  remove: (id: number) =>
    unwrap(apiClient.delete<ApiResponse<null>>(`/detail-peminjaman/${id}`)),
}
