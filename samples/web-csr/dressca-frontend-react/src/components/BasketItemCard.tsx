import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import type { BasketItemResponse } from '@/types'
import { toCurrencyJPY, getFirstAssetUrl } from '@/utils'

interface BasketItemCardProps {
  item: BasketItemResponse
  onUpdateQuantity: (catalogItemId: number, quantity: number) => void
  onDelete: (catalogItemId: number) => void
}

/**
 * Basket item card component
 */
export function BasketItemCard({ item, onUpdateQuantity, onDelete }: BasketItemCardProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const isDirty = quantity !== item.quantity

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10)
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= 999) {
      setQuantity(newQuantity)
    }
  }

  const handleUpdate = () => {
    if (isDirty && quantity >= 1 && quantity <= 999) {
      onUpdateQuantity(item.catalogItemId, quantity)
    }
  }

  return (
    <>
      <div className="col-span-4 lg:col-span-5">
        <div className="grid grid-cols-2">
          <img
            src={getFirstAssetUrl(item.catalogItem?.assetCodes || [])}
            alt={item.catalogItem?.name}
            className="pointer-events-none h-40"
          />
          <div className="ml-2">
            <p>{item.catalogItem?.name}</p>
            <p className="mt-4">{toCurrencyJPY(item.unitPrice)}</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="grid place-items-end lg:col-span-2 lg:flex lg:flex-row lg:items-center">
            <div className="mt-2 mr-2 ml-2 basis-3/5 text-right lg:pr-10">
              <label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border-b px-4 py-2 placeholder-gray-500/50 focus:border-b-2 focus:border-indigo-500 focus:outline-hidden"
                />
              </label>
            </div>
            <div className="basis-2/5">
              <button
                type="button"
                className="mt-2 mr-2 w-12 rounded-sm border border-blue-500 bg-transparent py-2 font-semibold text-blue-700 hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:border-blue-500 disabled:bg-transparent disabled:text-blue-700"
                disabled={!isDirty}
                onClick={handleUpdate}
              >
                更新
              </button>
            </div>
          </div>
          <div className="mt-2 mr-2 mb-1 ml-4 grid place-items-end">
            <TrashIcon
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
              onClick={() => onDelete(item.catalogItemId)}
            />
          </div>
        </div>
        <div className="mt-4 mr-3 text-right">
          小計：
          <span>{toCurrencyJPY(item.subTotal)}</span>
        </div>
      </div>
    </>
  )
}
