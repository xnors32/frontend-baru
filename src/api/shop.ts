import { apiClient, unwrap } from './client'
import type { ApiResponse, ShopProduct, ShopProductPayload } from '@/types/api'

export const shopApi = {
  getAll: () => unwrap(apiClient.get<ApiResponse<ShopProduct[]>>('/shop')),
  getById: (id: number) => unwrap(apiClient.get<ApiResponse<ShopProduct>>(`/shop/${id}`)),
  create: (payload: ShopProductPayload) =>
    unwrap(apiClient.post<ApiResponse<ShopProduct>>('/shop', payload)),
  update: (id: number, payload: ShopProductPayload) =>
    unwrap(apiClient.patch<ApiResponse<ShopProduct>>(`/shop/${id}`, payload)),
  remove: (id: number) => unwrap(apiClient.delete<ApiResponse<null>>(`/shop/${id}`)),
}
