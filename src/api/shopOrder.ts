import { apiClient, unwrap } from './client'
import type { ApiResponse, ShopOrder, ShopOrderPayload } from '@/types/api'

export const shopOrderApi = {
  create: (payload: ShopOrderPayload) =>
    unwrap(apiClient.post<ApiResponse<ShopOrder>>('/shop/orders', payload)),
  getAll: () =>
    unwrap(apiClient.get<ApiResponse<ShopOrder[]>>('/shop/orders')),
  getMine: () =>
    unwrap(apiClient.get<ApiResponse<ShopOrder[]>>('/shop/orders/mine')),
  updateStatus: (id: number, status: string) =>
    unwrap(apiClient.patch<ApiResponse<ShopOrder>>(`/shop/orders/${id}/status`, null, { params: { status } })),
}
