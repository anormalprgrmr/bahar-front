import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/HomePage/HomePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage/ProductDetailPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage/PlaceholderPage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage'
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage'
import { CartPage } from '@/pages/CartPage/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage/CheckoutPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'makeup',
        element: <PlaceholderPage title="محصولات آرایشی" />,
      },
      {
        path: 'skincare',
        element: <PlaceholderPage title="محصولات پوستی" />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/:orderId',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
