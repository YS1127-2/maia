import { create } from 'zustand'
import type { BasketResponse } from '@/types'

interface BasketState {
  basket: BasketResponse | null
  addedItemId: number | null
  setBasket: (basket: BasketResponse | null) => void
  setAddedItemId: (itemId: number | null) => void
  deleteAddedItemId: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

/**
 * Basket store for managing shopping cart
 */
export const useBasketStore = create<BasketState>((set, get) => ({
  basket: null,
  addedItemId: null,

  setBasket: (basket) => {
    set({ basket })
  },

  setAddedItemId: (itemId) => {
    set({ addedItemId: itemId })
  },

  deleteAddedItemId: () => {
    set({ addedItemId: null })
  },

  getTotalItems: () => {
    const { basket } = get()
    if (!basket?.basketItems) return 0
    return basket.basketItems.reduce((sum, item) => sum + item.quantity, 0)
  },

  getTotalPrice: () => {
    const { basket } = get()
    return basket?.account?.totalPrice || 0
  },
}))
