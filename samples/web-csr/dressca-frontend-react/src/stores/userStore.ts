import { create } from 'zustand'
import type { Address } from '@/types'

interface UserState {
  address: Address
  updateAddress: (address: Address) => void
}

// Default address (Japanese National Diet address as per Vue implementation)
const defaultAddress: Address = {
  fullName: '国会 太郎',
  postalCode: '100-0014',
  todofuken: '東京都',
  shikuchoson: '千代田区',
  azanaAndOthers: '永田町一丁目7番1号',
}

/**
 * User store for managing user information
 */
export const useUserStore = create<UserState>((set) => ({
  address: defaultAddress,

  updateAddress: (address: Address) => {
    set({ address })
  },
}))
