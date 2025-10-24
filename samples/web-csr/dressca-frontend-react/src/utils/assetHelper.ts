/**
 * Gets the full URL for an asset code
 * @param assetCode - The asset code to convert to URL
 * @returns Full URL to the asset
 */
export function getAssetUrl(assetCode: string): string {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/assets/${assetCode}`
}

/**
 * Gets the URL for the first asset code in an array
 * @param assetCodes - Array of asset codes
 * @returns URL to the first asset, or empty string if array is empty
 */
export function getFirstAssetUrl(assetCodes: string[]): string {
  if (!assetCodes || assetCodes.length === 0) {
    return ''
  }
  return getAssetUrl(assetCodes[0])
}
