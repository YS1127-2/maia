import { apiClient } from './client'
import type {
  CatalogBrandResponse,
  CatalogCategoryResponse,
  CatalogItemResponse,
  PagedListOfCatalogItemResponse,
} from '@/types'

/**
 * Catalog Brands API
 */
export const catalogBrandsApi = () => ({
  /**
   * Get all catalog brands
   */
  async getBrands(): Promise<CatalogBrandResponse[]> {
    const response = await apiClient.get<CatalogBrandResponse[]>('/api/catalog-brands')
    return response.data
  },
})

/**
 * Catalog Categories API
 */
export const catalogCategoriesApi = () => ({
  /**
   * Get all catalog categories
   */
  async getCategories(): Promise<CatalogCategoryResponse[]> {
    const response = await apiClient.get<CatalogCategoryResponse[]>('/api/catalog-categories')
    return response.data
  },
})

/**
 * Catalog Items API
 */
export const catalogItemsApi = () => ({
  /**
   * Get catalog items with pagination and filtering
   * @param params - Query parameters
   */
  async getItems(params?: {
    pageIndex?: number
    pageSize?: number
    catalogBrandId?: number
    catalogCategoryId?: number
  }): Promise<PagedListOfCatalogItemResponse> {
    const response = await apiClient.get<PagedListOfCatalogItemResponse>(
      '/api/catalog-items',
      { params }
    )
    return response.data
  },

  /**
   * Get a single catalog item by ID
   * @param itemId - Catalog item ID
   */
  async getItem(itemId: number): Promise<CatalogItemResponse> {
    const response = await apiClient.get<CatalogItemResponse>(
      `/api/catalog-items/${itemId}`
    )
    return response.data
  },
})
