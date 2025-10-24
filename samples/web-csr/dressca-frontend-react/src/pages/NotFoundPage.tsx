import { Link } from 'react-router-dom'

/**
 * Not found page - 404
 */
export function NotFoundPage() {
  return (
    <div className="bg-white text-gray-800">
      <div className="flex justify-center">
        <div className="bg-white p-8">
          <p className="mb-4 text-2xl font-medium">
            The requested page was not found.
          </p>
          <p className="mb-6 text-lg">
            アクセスしようとしたページは、削除・更新されたか、現在利用できない可能性があります。<br />
            トップページまたはメニューから、再度お探しください。
          </p>
          <div className="flex gap-4 text-lg">
            <Link to="/" className="text-blue-600 underline hover:text-blue-900">
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
