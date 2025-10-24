import { apiClient } from './client'

/**
 * Assets API
 */
export const assetsApi = () => ({
  /**
   * Get asset by code
   * @param assetCode - Asset code to fetch
   */
  async getAsset(assetCode: string): Promise<Blob> {
    const response = await apiClient.get(`/api/assets/${assetCode}`, {
      responseType: 'blob',
    })
    return response.data
  },
})
