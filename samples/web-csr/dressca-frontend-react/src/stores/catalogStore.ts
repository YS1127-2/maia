import { create } from 'zustand'
import type {
  CatalogBrandResponse,
  CatalogCategoryResponse,
  CatalogItemResponse,
  PagedListOfCatalogItemResponse,
} from '@/types'

interface CatalogFilters {
  catalogBrandId: number | null
  catalogCategoryId: number | null
  pageIndex: number
  pageSize: number
}

interface CatalogState {
  brands: CatalogBrandResponse[]
  categories: CatalogCategoryResponse[]
  items: PagedListOfCatalogItemResponse | null
  filters: CatalogFilters

  setBrands: (brands: CatalogBrandResponse[]) => void
  setCategories: (categories: CatalogCategoryResponse[]) => void
  setItems: (items: PagedListOfCatalogItemResponse) => void

  setFilter: (key: keyof CatalogFilters, value: number | null) => void
  resetFilters: () => void
}

const initialFilters: CatalogFilters = {
  catalogBrandId: null,
  catalogCategoryId: null,
  pageIndex: 0,
  pageSize: 10,
}

/**
 * Catalog store for managing catalog data and filters
 */
export const useCatalogStore = create<CatalogState>((set) => ({
  brands: [],
  categories: [],
  items: null,
  filters: initialFilters,

  setBrands: (brands) => {
    set({ brands })
  },

  setCategories: (categories) => {
    set({ categories })
  },

  setItems: (items) => {
    set({ items })
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        // Reset to first page when changing filters
        pageIndex: key !== 'pageIndex' ? 0 : state.filters.pageIndex,
      },
    }))
  },

  resetFilters: () => {
    set({ filters: initialFilters })
  },
}))
