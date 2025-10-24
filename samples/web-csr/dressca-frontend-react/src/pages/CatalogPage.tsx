import { useNavigate } from 'react-router-dom'
import { useSpecialContentStore } from '@/stores'
import { useCatalog, useBasket } from '@/hooks'
import { CarouselSlider, LoadingSpinner } from '@/components'
import { toCurrencyJPY, getAssetUrl, getFirstAssetUrl } from '@/utils'

/**
 * Catalog page - Home page displaying products
 */
export function CatalogPage() {
  const navigate = useNavigate()
  const { campaigns } = useSpecialContentStore()
  const { brands, categories, items, filters, isLoading, setFilter } = useCatalog()
  const { addItem } = useBasket()

  const carouselItems = campaigns.map((campaign) => ({
    id: campaign.campaignCode,
    imageUrl: getAssetUrl(campaign.assetCode),
    alt: campaign.campaignCode,
  }))

  const getBrandName = (catalogBrandId: number): string => {
    const brand = brands.find((b) => b.id === catalogBrandId)
    return brand?.brandName || ''
  }

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10)
    setFilter('catalogBrandId', value === 0 ? null : value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10)
    setFilter('catalogCategoryId', value === 0 ? null : value)
  }

  const handleAddToBasket = async (catalogItemId: number) => {
    try {
      await addItem({ catalogItemId, quantity: 1 })
      // Vue版と同じ動作: 追加後に買い物かごページに遷移
      navigate('/basket')
    } catch (error) {
      // エラーは既にtoastで表示されるのでここでは何もしない
    }
  }

  if (isLoading && !items) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto">
      {/* Carousel */}
      <div className="m-4 flex justify-center">
        <CarouselSlider items={carouselItems} className="h-auto w-full" />
      </div>

      {/* Filters */}
      <div className="flex justify-center">
        <div className="my-4 grid grid-cols-1 text-lg lg:grid-cols-2 lg:gap-24">
          <div>
            <label className="mr-2 font-bold">
              {' '}カテゴリ{' '}
              <select
                value={filters.catalogCategoryId ?? 0}
                onChange={handleCategoryChange}
                className="w-48 border-2"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-2 lg:mt-0">
            <label className="mr-2 font-bold">
              {' '}ブランド{' '}
              <select
                value={filters.catalogBrandId ?? 0}
                onChange={handleBrandChange}
                className="w-48 border-2"
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex justify-center">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6">
          {items && items.items.length > 0 ? (
            items.items.map((item) => (
              <div key={item.id}>
                <div className="mx-auto w-60 justify-center p-2 md:border-2 lg:border-2">
                  <img
                    className="h-45"
                    src={getFirstAssetUrl(item.assetCodes)}
                    alt={item.name}
                  />
                  <div className="w-full">
                    <p className="text-md mb-2 w-full">{getBrandName(item.catalogBrandId)}</p>
                    <p className="text-lg font-bold">{toCurrencyJPY(item.price)}</p>
                    <div className="mt-4 flex items-center justify-center">
                      <button
                        className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        type="submit"
                        onClick={() => handleAddToBasket(item.id)}
                      >
                        買い物かごに入れる
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="my-4 text-center text-gray-500">
              商品が見つかりません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
