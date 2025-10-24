import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBasket } from '@/hooks'
import { useBasketStore } from '@/stores'
import { BasketItemCard, LoadingSpinner } from '@/components'
import { toCurrencyJPY, getFirstAssetUrl } from '@/utils'

/**
 * Basket page - Shopping cart
 */
export function BasketPage() {
  const navigate = useNavigate()
  const { basket, isLoading, updateItem, deleteItem } = useBasket()
  const { addedItemId, deleteAddedItemId } = useBasketStore()

  const handleCheckout = () => {
    navigate('/ordering/checkout')
  }

  const isEmpty = !basket?.basketItems || basket.basketItems.length === 0
  const addedItem = basket?.basketItems?.find((item) => item.catalogItemId === addedItemId)

  useEffect(() => {
    return () => {
      deleteAddedItemId()
    }
  }, [deleteAddedItemId])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto my-4 max-w-4xl">
      {addedItemId && addedItem && (
        <div className="mx-2">
          <span className="text-lg font-medium text-green-500">
            以下の商品が追加されました。
          </span>
          <div className="mt-4 grid grid-cols-1 items-center lg:grid-cols-3">
            <img
              src={getFirstAssetUrl(addedItem.catalogItem?.assetCodes || [])}
              alt={addedItem.catalogItem?.name}
              className="pointer-events-none m-auto h-40"
            />
            <span className="text-center lg:text-left">
              {addedItem.catalogItem?.name}
            </span>
            <span className="text-center lg:text-left">
              {toCurrencyJPY(addedItem.unitPrice)}
            </span>
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="mx-2 mt-4">
          <span className="text-2xl font-medium">
            There are no items in the basket.
          </span>
        </div>
      )}

      {!isEmpty && (
        <div className="mx-2 mt-8">
          <span className="text-2xl font-medium">現在のカートの中身</span>
          <div className="mt-4 hidden grid-cols-1 items-center lg:grid lg:grid-cols-5">
            <div className="text-center text-lg font-medium lg:col-span-3">商品</div>
            <div className="text-right text-lg font-medium lg:col-span-1">数量</div>
          </div>
          {basket.basketItems?.map((item) => (
            <div
              key={item.catalogItemId}
              className="mt-4 grid grid-cols-5 items-center lg:grid-cols-8"
            >
              <BasketItemCard
                item={item}
                onUpdateQuantity={updateItem}
                onDelete={deleteItem}
              />
            </div>
          ))}
          <hr className="mt-4" />
          <div className="mt-4 mr-2 text-right">
            <table className="inline-block border-separate">
              <tbody>
                <tr>
                  <th>税抜き合計</th>
                  <td>{toCurrencyJPY(basket.account?.totalItemsPrice)}</td>
                </tr>
                <tr>
                  <th>送料</th>
                  <td>{toCurrencyJPY(basket.account?.deliveryCharge)}</td>
                </tr>
                <tr>
                  <th>消費税</th>
                  <td>{toCurrencyJPY(basket.account?.consumptionTax)}</td>
                </tr>
                <tr>
                  <th>合計</th>
                  <td>{toCurrencyJPY(basket.account?.totalPrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          className="mt-4 ml-4 w-36 rounded-sm bg-teal-500 px-4 py-2 font-bold text-white hover:bg-teal-700"
          type="submit"
          onClick={() => navigate('/')}
        >
          買い物を続ける
        </button>
        {!isEmpty && (
          <button
            data-testid="orderButton"
            className="mt-4 mr-4 w-36 rounded-sm bg-orange-500 px-4 py-2 font-bold text-white hover:bg-amber-700 disabled:bg-orange-300/50"
            type="submit"
            onClick={handleCheckout}
          >
            レジに進む
          </button>
        )}
      </div>
    </div>
  )
}
