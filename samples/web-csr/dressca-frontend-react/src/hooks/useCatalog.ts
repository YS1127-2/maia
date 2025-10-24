import { useQuery } from '@tanstack/react-query'
import { useCatalogStore } from '@/stores'
import { catalogBrandsApi, catalogCategoriesApi, catalogItemsApi } from '@/api'

/**
 * Custom hook for catalog operations with React Query
 */
export function useCatalog() {
  const {
    brands,
    categories,
    items,
    filters,
    setBrands,
    setCategories,
    setItems,
    setFilter,
    resetFilters,
  } = useCatalogStore()

  // Fetch brands
  const { isLoading: brandsLoading } = useQuery({
    queryKey: ['catalog-brands'],
    queryFn: async () => {
      const data = await catalogBrandsApi().getBrands()
      setBrands(data)
      return data
    },
  })

  // Fetch categories
  const { isLoading: categoriesLoading } = useQuery({
    queryKey: ['catalog-categories'],
    queryFn: async () => {
      const data = await catalogCategoriesApi().getCategories()
      setCategories(data)
      return data
    },
  })

  // Fetch items with filters
  const { isLoading: itemsLoading, refetch: refetchItems } = useQuery({
    queryKey: ['catalog-items', filters],
    queryFn: async () => {
      const params = {
        pageIndex: filters.pageIndex,
        pageSize: filters.pageSize,
        ...(filters.catalogBrandId && { catalogBrandId: filters.catalogBrandId }),
        ...(filters.catalogCategoryId && { catalogCategoryId: filters.catalogCategoryId }),
      }
      const data = await catalogItemsApi().getItems(params)
      setItems(data)
      return data
    },
  })

  // Prepend "All" option to brands and categories (as per Vue implementation)
  const brandsWithAll = [
    { id: 0, brandName: 'すべて' },
    ...brands,
  ]

  const categoriesWithAll = [
    { id: 0, categoryName: 'すべて' },
    ...categories,
  ]

  return {
    brands: brandsWithAll,
    categories: categoriesWithAll,
    items,
    filters,
    isLoading: brandsLoading || categoriesLoading || itemsLoading,
    setFilter,
    resetFilters,
    refetchItems,
  }
}
