import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBasket } from '@/hooks'
import { useUserStore } from '@/stores'
import { ordersApi } from '@/api'
import { LoadingSpinner } from '@/components'
import { toCurrencyJPY, getFirstAssetUrl } from '@/utils'

/**
 * Checkout page - Order confirmation
 */
export function CheckoutPage() {
  const navigate = useNavigate()
  const { basket, isLoading } = useBasket()
  const { address } = useUserStore()

  useEffect(() => {
    if (!isLoading && (!basket?.basketItems || basket.basketItems.length === 0)) {
      navigate('/')
    }
  }, [basket, isLoading, navigate])

  const handleCheckout = async () => {
    try {
      const order = await ordersApi().createOrder(address)
      navigate(`/ordering/done/${order.id}`)
    } catch (error) {
      console.error('Failed to create order:', error)
      navigate('/error')
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!basket || !basket.basketItems || basket.basketItems.length === 0) {
    return null
  }

  return (
    <div>
      <div className="container mx-auto my-4 max-w-4xl">
        <span className="text-lg font-medium text-green-500">
          注文内容を確認し、注文を確定してください。
        </span>
      </div>
      <div className="container mx-auto my-4 max-w-4xl">
        <div className="mx-2 grid grid-cols-2 items-center lg:grid-cols-3 lg:gap-x-12">
          <table className="mt-2 table-fixed border-t border-b lg:col-span-1 lg:row-start-1 lg:mt-0 lg:border">
            <tbody>
              <tr>
                <td>税抜き合計</td>
                <td className="text-right">
                  {toCurrencyJPY(basket.account?.totalItemsPrice)}
                </td>
              </tr>
              <tr>
                <td>送料</td>
                <td className="text-right">
                  {toCurrencyJPY(basket.account?.deliveryCharge)}
                </td>
              </tr>
              <tr>
                <td>消費税</td>
                <td className="text-right">
                  {toCurrencyJPY(basket.account?.consumptionTax)}
                </td>
              </tr>
              <tr>
                <td>合計</td>
                <td className="text-right text-xl font-bold text-red-500">
                  {toCurrencyJPY(basket.account?.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className="mx-auto w-36 rounded-sm bg-orange-500 px-4 py-2 font-bold text-white hover:bg-amber-700 lg:col-end-3"
            type="submit"
            onClick={handleCheckout}
          >
            注文を確定する
          </button>
          <table className="mt-2 table-fixed border-t border-b lg:col-span-3 lg:mt-4 lg:border">
            <tbody>
              <tr>
                <td rowSpan={5} className="w-24 border-r pl-2">
                  お届け先
                </td>
                <td className="pl-2">{address.fullName}</td>
              </tr>
              <tr>
                <td className="pl-2">{`〒${address.postalCode}`}</td>
              </tr>
              <tr>
                <td className="pl-2">{address.todofuken}</td>
              </tr>
              <tr>
                <td className="pl-2">{address.shikuchoson}</td>
              </tr>
              <tr>
                <td className="pl-2">{address.azanaAndOthers}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-2 mt-8">
          {basket.basketItems.map((item) => (
            <div
              key={item.catalogItemId}
              className="mt-4 grid grid-cols-5 items-center lg:grid-cols-8"
            >
              <div className="col-span-4 lg:col-span-5">
                <div className="grid grid-cols-2">
                  <img
                    src={getFirstAssetUrl(item.catalogItem?.assetCodes || [])}
                    alt={item.catalogItem?.name}
                    className="pointer-events-none h-40"
                  />
                  <div className="ml-2">
                    <p>{item.catalogItem?.name}</p>
                    <p className="mt-4">{`価格: ${toCurrencyJPY(item.unitPrice)}`}</p>
                    <p className="mt-4">{`数量: ${item.quantity}`}</p>
                    <p className="mt-4">{toCurrencyJPY(item.subTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
