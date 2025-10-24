import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ordersApi } from '@/api'
import { LoadingSpinner } from '@/components'
import { toCurrencyJPY, getFirstAssetUrl } from '@/utils'
import type { OrderResponse } from '@/types'

/**
 * Done page - Order completion
 */
export function DonePage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate('/')
        return
      }

      try {
        const orderData = await ordersApi().getOrder(parseInt(orderId, 10))
        setOrder(orderData)
      } catch (error) {
        console.error('Failed to fetch order:', error)
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate])

  const handleContinueShopping = () => {
    navigate('/')
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!order) {
    return null
  }

  return (
    <div>
      <div className="container mx-auto my-4 max-w-4xl">
        <span className="text-lg font-medium text-green-500">
          ご注文ありがとうございました。
        </span>
      </div>
      <div className="container mx-auto my-4 max-w-4xl">
        <div className="mx-2 grid grid-cols-1 items-center lg:grid-cols-3 lg:gap-x-12">
          <table className="mt-2 table-fixed border-t border-b lg:col-span-1 lg:row-start-1 lg:mt-0 lg:border">
            <tbody>
              <tr>
                <td>税抜き合計</td>
                <td className="text-right">
                  {toCurrencyJPY(order.account?.totalItemsPrice)}
                </td>
              </tr>
              <tr>
                <td>送料</td>
                <td className="text-right">
                  {toCurrencyJPY(order.account?.deliveryCharge)}
                </td>
              </tr>
              <tr>
                <td>消費税</td>
                <td className="text-right">
                  {toCurrencyJPY(order.account?.consumptionTax)}
                </td>
              </tr>
              <tr>
                <td>合計</td>
                <td className="text-right text-xl font-bold text-red-500">
                  {toCurrencyJPY(order.account?.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
          <table className="mt-2 table-fixed border-t border-b lg:col-span-2 lg:mt-4 lg:border">
            <tbody>
              <tr>
                <td rowSpan={5} className="w-24 border-r pl-2">
                  お届け先
                </td>
                <td className="pl-2">{order.fullName}</td>
              </tr>
              <tr>
                <td className="pl-2">{`〒${order.postalCode}`}</td>
              </tr>
              <tr>
                <td className="pl-2">{order.todofuken}</td>
              </tr>
              <tr>
                <td className="pl-2">{order.shikuchoson}</td>
              </tr>
              <tr>
                <td className="pl-2">{order.azanaAndOthers}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-2 mt-8">
          {order.orderItems?.map((item) => (
            <div
              key={item.id}
              className="mt-4 grid grid-cols-5 items-center lg:grid-cols-8"
            >
              <div className="col-span-4 lg:col-span-5">
                <div className="grid grid-cols-2">
                  <img
                    src={getFirstAssetUrl(item.itemOrdered?.assetCodes || [])}
                    alt={item.itemOrdered?.name}
                    className="pointer-events-none h-40"
                  />
                  <div className="ml-2">
                    <p>{item.itemOrdered?.name}</p>
                    <p className="mt-4">{`価格: ${toCurrencyJPY(item.unitPrice)}`}</p>
                    <p className="mt-4">{`数量: ${item.quantity}`}</p>
                    <p className="mt-4">{toCurrencyJPY(item.subTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            className="mt-4 ml-4 w-36 rounded-sm bg-teal-500 px-4 py-2 font-bold text-white hover:bg-teal-700"
            type="submit"
            onClick={handleContinueShopping}
          >
            買い物を続ける
          </button>
        </div>
      </div>
    </div>
  )
}
