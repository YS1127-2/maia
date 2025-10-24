import { http, HttpResponse, delay } from 'msw'
import type {
  BasketResponse,
  BasketItemResponse,
  CatalogBrandResponse,
  CatalogCategoryResponse,
  CatalogItemResponse,
  PagedListOfCatalogItemResponse,
  OrderResponse,
} from '@/types'

const BASE_URL = 'http://localhost:8080'

// Mock data
const mockBrands: CatalogBrandResponse[] = [
  { id: 1, brandName: '高級なブランド' },
  { id: 2, brandName: 'カジュアルなブランド' },
  { id: 3, brandName: 'ノーブランド' },
]

const mockCategories: CatalogCategoryResponse[] = [
  { id: 1, categoryName: '服' },
  { id: 2, categoryName: 'バッグ' },
  { id: 3, categoryName: 'シューズ' },
]

const mockItems: CatalogItemResponse[] = [
  {
    id: 1,
    name: 'クルーネック Tシャツ - ブラック',
    price: 1980,
    catalogBrandId: 3,
    catalogCategoryId: 1,
    assetCodes: [],
  },
  {
    id: 2,
    name: '裏起毛 スキニーデニム',
    price: 4800,
    catalogBrandId: 2,
    catalogCategoryId: 1,
    assetCodes: ['4aed07c4ed5d45a5b97f11acedfbb601'],
  },
  {
    id: 3,
    name: 'ウールコート',
    price: 49800,
    catalogBrandId: 1,
    catalogCategoryId: 1,
    assetCodes: ['082b37439ecc44919626ba00fc60ee85'],
  },
  {
    id: 4,
    name: '無地 ボタンダウンシャツ',
    price: 2800,
    catalogBrandId: 2,
    catalogCategoryId: 1,
    assetCodes: ['f5f89954281747fa878129c29e1e0f83'],
  },
  {
    id: 5,
    name: 'レザーハンドバッグ',
    price: 18800,
    catalogBrandId: 3,
    catalogCategoryId: 2,
    assetCodes: ['a8291ef2e8e14869a7048e272915f33c'],
  },
  {
    id: 6,
    name: 'ショルダーバッグ',
    price: 38000,
    catalogBrandId: 2,
    catalogCategoryId: 2,
    assetCodes: ['66237018c769478a90037bd877f5fba1'],
  },
  {
    id: 7,
    name: 'トートバッグ ポーチ付き',
    price: 24800,
    catalogBrandId: 3,
    catalogCategoryId: 2,
    assetCodes: ['d136d4c81b86478990984dcafbf08244'],
  },
  {
    id: 8,
    name: 'ショルダーバッグ',
    price: 2800,
    catalogBrandId: 1,
    catalogCategoryId: 2,
    assetCodes: ['47183f32f6584d7fb661f9216e11318b'],
  },
  {
    id: 9,
    name: 'レザー チェーンショルダーバッグ',
    price: 258000,
    catalogBrandId: 1,
    catalogCategoryId: 2,
    assetCodes: ['cf151206efd344e1b86854f4aa49fdef'],
  },
  {
    id: 10,
    name: 'ランニングシューズ - ブルー',
    price: 12800,
    catalogBrandId: 2,
    catalogCategoryId: 3,
    assetCodes: ['ab2e78eb7fe3408aadbf1e17a9945a8c'],
  },
  {
    id: 11,
    name: 'メダリオン ストレートチップ ドレスシューズ',
    price: 23800,
    catalogBrandId: 1,
    catalogCategoryId: 3,
    assetCodes: ['0e557e96bc054f10bc91c27405a83e85'],
  },
]

// Helper function to calculate basket account
function calculateAccount(items: BasketItemResponse[]): AccountResponse {
  const totalItemsPrice = items.reduce((sum, item) => sum + item.subTotal, 0)
  const deliveryCharge = 500 // Fixed delivery charge
  const consumptionTaxRate = 0.1 // 10%
  const consumptionTax = Math.floor((totalItemsPrice + deliveryCharge) * consumptionTaxRate)
  const totalPrice = totalItemsPrice + deliveryCharge + consumptionTax

  return {
    totalItemsPrice,
    deliveryCharge,
    consumptionTaxRate,
    consumptionTax,
    totalPrice,
  }
}

let mockBasket: BasketResponse = {
  buyerId: 'test-buyer',
  basketItems: [],
  account: {
    totalItemsPrice: 0,
    deliveryCharge: 0,
    consumptionTaxRate: 0.1,
    consumptionTax: 0,
    totalPrice: 0,
  },
  deletedItemIds: [],
}

let addedItemId: number | null = null

let nextOrderId = 1
const mockOrders: OrderResponse[] = []

export const handlers = [
  // Catalog Brands
  http.get(`${BASE_URL}/api/catalog-brands`, async () => {
    await delay(200)
    return HttpResponse.json(mockBrands)
  }),

  // Catalog Categories
  http.get(`${BASE_URL}/api/catalog-categories`, async () => {
    await delay(200)
    return HttpResponse.json(mockCategories)
  }),

  // Catalog Items
  http.get(`${BASE_URL}/api/catalog-items`, async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageIndex = parseInt(url.searchParams.get('pageIndex') || '0', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const brandId = url.searchParams.get('catalogBrandId')
    const categoryId = url.searchParams.get('catalogCategoryId')

    let filteredItems = [...mockItems]

    if (brandId && brandId !== '0') {
      filteredItems = filteredItems.filter(
        (item) => item.catalogBrandId === parseInt(brandId, 10)
      )
    }

    if (categoryId && categoryId !== '0') {
      filteredItems = filteredItems.filter(
        (item) => item.catalogCategoryId === parseInt(categoryId, 10)
      )
    }

    const start = pageIndex * pageSize
    const end = start + pageSize
    const paginatedItems = filteredItems.slice(start, end)
    const totalPages = Math.ceil(filteredItems.length / pageSize)

    const response: PagedListOfCatalogItemResponse = {
      items: paginatedItems,
      pageIndex,
      totalPages,
      totalCount: filteredItems.length,
      hasPreviousPage: pageIndex > 0,
      hasNextPage: pageIndex < totalPages - 1,
    }

    return HttpResponse.json(response)
  }),

  // Get Basket
  http.get(`${BASE_URL}/api/basket-items`, async () => {
    await delay(200)
    const response = {
      ...mockBasket,
      addedItemId: addedItemId,
    }
    return HttpResponse.json(response)
  }),

  // Add to Basket
  http.post(`${BASE_URL}/api/basket-items`, async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { catalogItemId: number; quantity: number }
    const item = mockItems.find((i) => i.id === body.catalogItemId)

    if (!item) {
      return HttpResponse.json(
        { title: 'Item not found', status: 404 },
        { status: 404 }
      )
    }

    const existingItem = mockBasket.basketItems?.find(
      (i) => i.catalogItemId === body.catalogItemId
    )

    if (existingItem) {
      existingItem.quantity += body.quantity
      existingItem.subTotal = existingItem.quantity * existingItem.unitPrice
      addedItemId = body.catalogItemId
      mockBasket.account = calculateAccount(mockBasket.basketItems || [])
      return HttpResponse.json(existingItem)
    }

    const newItem: BasketItemResponse = {
      catalogItemId: item.id,
      catalogItem: {
        id: item.id,
        name: item.name,
        productCode: `PROD-${item.id}`,
        assetCodes: item.assetCodes,
      },
      unitPrice: item.price,
      quantity: body.quantity,
      subTotal: item.price * body.quantity,
    }

    mockBasket.basketItems = [...(mockBasket.basketItems || []), newItem]
    addedItemId = body.catalogItemId
    mockBasket.account = calculateAccount(mockBasket.basketItems)
    return HttpResponse.json(newItem)
  }),

  // Update Basket Item
  http.put(`${BASE_URL}/api/basket-items/:catalogItemId`, async ({ request, params }) => {
    await delay(200)
    const catalogItemId = parseInt(params.catalogItemId as string, 10)
    const body = (await request.json()) as { quantity: number }

    const item = mockBasket.basketItems?.find((i) => i.catalogItemId === catalogItemId)
    if (!item) {
      return HttpResponse.json(
        { title: 'Item not found', status: 404 },
        { status: 404 }
      )
    }

    item.quantity = body.quantity
    item.subTotal = item.quantity * item.unitPrice
    mockBasket.account = calculateAccount(mockBasket.basketItems || [])
    return HttpResponse.json(item)
  }),

  // Delete Basket Item
  http.delete(`${BASE_URL}/api/basket-items/:catalogItemId`, async ({ params }) => {
    await delay(200)
    const catalogItemId = parseInt(params.catalogItemId as string, 10)
    mockBasket.basketItems = mockBasket.basketItems?.filter((i) => i.catalogItemId !== catalogItemId)
    mockBasket.account = calculateAccount(mockBasket.basketItems || [])
    return new HttpResponse(null, { status: 204 })
  }),

  // Clear Basket
  http.delete(`${BASE_URL}/api/basket-items`, async () => {
    await delay(200)
    mockBasket.basketItems = []
    mockBasket.account = calculateAccount([])
    addedItemId = null
    return new HttpResponse(null, { status: 204 })
  }),

  // Create Order
  http.post(`${BASE_URL}/api/orders`, async ({ request }) => {
    await delay(500)
    const address = await request.json() as Address

    const order: OrderResponse = {
      id: nextOrderId++,
      buyerId: mockBasket.buyerId,
      orderDate: new Date().toISOString(),
      fullName: address.fullName,
      postalCode: address.postalCode,
      todofuken: address.todofuken,
      shikuchoson: address.shikuchoson,
      azanaAndOthers: address.azanaAndOthers,
      account: mockBasket.account,
      orderItems: (mockBasket.basketItems || []).map((item, index) => ({
        id: index + 1,
        itemOrdered: item.catalogItem,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subTotal: item.subTotal,
      })),
    }

    mockOrders.push(order)
    mockBasket.basketItems = [] // Clear basket after order
    mockBasket.account = calculateAccount([])
    addedItemId = null

    return HttpResponse.json(order)
  }),

  // Get Order
  http.get(`${BASE_URL}/api/orders/:orderId`, async ({ params }) => {
    await delay(200)
    const orderId = parseInt(params.orderId as string, 10)
    const order = mockOrders.find((o) => o.id === orderId)

    if (!order) {
      return HttpResponse.json(
        { title: 'Order not found', status: 404 },
        { status: 404 }
      )
    }

    return HttpResponse.json(order)
  }),

  // Get Assets (mock image)
  http.get(`${BASE_URL}/api/assets/:assetCode`, async ({ params }) => {
    await delay(100)
    try {
      const imageBuffer = await fetch(`/mock/images/${params.assetCode}.png`).then(
        (response) => response.arrayBuffer()
      )
      return HttpResponse.arrayBuffer(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
        },
      })
    } catch (error) {
      // Return a default image if the requested asset is not found
      const defaultBuffer = await fetch(`/mock/images/4aed07c4ed5d45a5b97f11acedfbb601.png`).then(
        (response) => response.arrayBuffer()
      )
      return HttpResponse.arrayBuffer(defaultBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
        },
      })
    }
  }),
]
