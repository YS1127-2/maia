import { create } from 'zustand'
import type { Campaign, SaleItem } from '@/types'

interface SpecialContentState {
  campaigns: Campaign[]
  saleItems: SaleItem[]
  setCampaigns: (campaigns: Campaign[]) => void
  setSaleItems: (saleItems: SaleItem[]) => void
}

// Hardcoded data as per Vue implementation
const defaultCampaigns: Campaign[] = [
  {
    campaignCode: 'LTOX48Q',
    assetCode: 'b52dc7f712d94ca5812dd995bf926c04',
  },
  {
    campaignCode: 'EKHQGBB',
    assetCode: '05d38fad5693422c8a27dd5b14070ec8',
  },
  {
    campaignCode: 'CAMPAIGN_CODE_3',
    assetCode: '80bc8e167ccb4543b2f9d51913073492',
  },
]

const defaultSaleItems: SaleItem[] = [
  {
    catalogItemId: 14,
    assetCode: '80bc8e167ccb4543b2f9d51913073492',
  },
]

/**
 * Special content store for campaigns and sale items
 */
export const useSpecialContentStore = create<SpecialContentState>((set) => ({
  campaigns: defaultCampaigns,
  saleItems: defaultSaleItems,

  setCampaigns: (campaigns) => {
    set({ campaigns })
  },

  setSaleItems: (saleItems) => {
    set({ saleItems })
  },
}))
