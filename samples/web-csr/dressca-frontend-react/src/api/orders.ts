import { apiClient } from './client'
import type { OrderResponse, Address } from '@/types'

/**
 * Orders API
 */
export const ordersApi = () => ({
  /**
   * Create a new order
   * @param address - Shipping address
   */
  async createOrder(address: Address): Promise<OrderResponse> {
    const response = await apiClient.post<OrderResponse>('/api/orders', address)
    return response.data
  },

  /**
   * Get an order by ID
   * @param orderId - Order ID
   */
  async getOrder(orderId: number): Promise<OrderResponse> {
    const response = await apiClient.get<OrderResponse>(`/api/orders/${orderId}`)
    return response.data
  },

  /**
   * Get all orders for current user
   */
  async getOrders(): Promise<OrderResponse[]> {
    const response = await apiClient.get<OrderResponse[]>('/api/orders')
    return response.data
  },
})
