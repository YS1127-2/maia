import { apiClient } from './client'
import type { BasketResponse, BasketItemResponse } from '@/types'

/**
 * Basket Items API
 */
export const basketItemsApi = () => ({
  /**
   * Get basket for current user
   */
  async getBasket(): Promise<BasketResponse> {
    const response = await apiClient.get<BasketResponse>('/api/basket-items')
    return response.data
  },

  /**
   * Add item to basket
   * @param catalogItemId - ID of the catalog item
   * @param quantity - Quantity to add
   */
  async addItem(catalogItemId: number, quantity: number): Promise<BasketItemResponse> {
    const response = await apiClient.post<BasketItemResponse>('/api/basket-items', {
      catalogItemId,
      quantity,
    })
    return response.data
  },

  /**
   * Update basket item quantity
   * @param catalogItemId - Catalog item ID
   * @param quantity - New quantity
   */
  async updateItem(catalogItemId: number, quantity: number): Promise<BasketItemResponse> {
    const response = await apiClient.put<BasketItemResponse>(
      `/api/basket-items/${catalogItemId}`,
      { quantity }
    )
    return response.data
  },

  /**
   * Delete basket item
   * @param catalogItemId - Catalog item ID to delete
   */
  async deleteItem(catalogItemId: number): Promise<void> {
    await apiClient.delete(`/api/basket-items/${catalogItemId}`)
  },

  /**
   * Clear entire basket
   */
  async clearBasket(): Promise<void> {
    await apiClient.delete('/api/basket-items')
  },
})
