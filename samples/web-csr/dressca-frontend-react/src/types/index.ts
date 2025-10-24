// Utility types
export type MaybePromise<T> = T | Promise<T>

export type MaybeAsyncFunction<R> = () => MaybePromise<R>

export type MaybeAsyncUnaryFunction<T, R> = (arg: T) => MaybePromise<R>

// API Response types (these will match the OpenAPI generated types)
export interface CatalogItemSummaryResponse {
  id: number
  name: string
  productCode: string
  assetCodes?: string[]
}

export interface BasketItemResponse {
  catalogItemId: number
  catalogItem?: CatalogItemSummaryResponse
  unitPrice: number
  quantity: number
  subTotal: number
}

export interface AccountResponse {
  consumptionTax: number
  consumptionTaxRate: number
  deliveryCharge: number
  totalItemsPrice: number
  totalPrice: number
}

export interface BasketResponse {
  buyerId: string
  basketItems?: BasketItemResponse[]
  account?: AccountResponse
  deletedItemIds?: number[]
  addedItemId?: number | null
}

export interface CatalogCategoryResponse {
  id: number
  categoryName: string
}

export interface CatalogBrandResponse {
  id: number
  brandName: string
}

export interface CatalogItemResponse {
  id: number
  name: string
  price: number
  catalogBrandId: number
  catalogCategoryId: number
  assetCodes: string[]
}

export interface PagedListOfCatalogItemResponse {
  items: CatalogItemResponse[]
  pageIndex: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface OrderItemResponse {
  id: number
  itemOrdered?: CatalogItemSummaryResponse
  quantity: number
  subTotal: number
  unitPrice: number
}

export interface OrderResponse {
  id: number
  buyerId: string
  orderDate: string
  fullName: string
  postalCode: string
  todofuken: string
  shikuchoson: string
  azanaAndOthers: string
  account?: AccountResponse
  orderItems?: OrderItemResponse[]
}

// Domain models
export interface Address {
  fullName: string
  postalCode: string
  todofuken: string
  shikuchoson: string
  azanaAndOthers: string
}

export interface Campaign {
  campaignCode: string
  assetCode: string
}

export interface SaleItem {
  catalogItemId: number
  assetCode: string
}

export type SpecialContent = Campaign | SaleItem

// Error types
export interface ProblemDetails {
  detail: string
  exceptionId: string
  exceptionValues: string[]
  instance: string
  status: number
  title: string
  type: string
}
