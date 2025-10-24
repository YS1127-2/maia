import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useAuth, useBasket } from '@/hooks'
import { NotificationToast, ProtectedRoute } from '@/components'
import {
  CatalogPage,
  LoginPage,
  BasketPage,
  CheckoutPage,
  OrderDonePage,
  ErrorPage,
  NotFoundPage,
} from '@/pages'
import { useEffect } from 'react'
import { UnauthorizedError } from '@/lib/errors'
import { useNavigate } from 'react-router-dom'

function AppContent() {
  const { isAuthenticated, signOut } = useAuth()
  const { totalItems, refetch } = useBasket()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      refetch().catch((error) => {
        if (error instanceof UnauthorizedError) {
          navigate('/error', { state: { error: { message: 'Unauthorized access' } } })
        }
      })
    }
  }, [isAuthenticated, refetch, navigate])

  return (
    <>
      {/* Toast Notifications */}
      <div className="z-2">
        <NotificationToast />
      </div>

      <div className="z-0 flex h-screen flex-col justify-between">
        {/* Header */}
        <header>
          <nav
            aria-label="Jump links"
            className="py-5 text-lg font-medium text-gray-900 shadow-xs ring-1 ring-gray-900/5"
          >
            <div className="mx-auto flex justify-between px-4 md:px-24 lg:px-24">
              <div>
                <Link className="text-2xl" to="/"> Dressca </Link>
              </div>
              <div className="flex gap-5 sm:gap-5 lg:gap-12">
                <Link to="/basket">
                  <ShoppingCartIcon className="h-8 w-8 text-amber-600" />
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={signOut}
                    className="text-lg font-medium text-gray-900"
                  > ログアウト </button>
                ) : (
                  <Link to="/authentication/login" className="text-lg font-medium text-gray-900"> ログイン </Link>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="mb-auto">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/authentication/login" element={<LoginPage />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route
              path="/ordering/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ordering/done/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDonePage />
                </ProtectedRoute>
              }
            />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mx-auto w-full border-t bg-black px-24 py-4 text-base text-gray-500">
          <p>&copy; 2023 - Dressca - Privacy</p>
        </footer>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
