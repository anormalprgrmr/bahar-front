import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout/MainLayout'
import { AdminRoute, ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/HomePage/HomePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage/ProductDetailPage'
import { CategoryProductsPage } from '@/pages/CategoryProductsPage/CategoryProductsPage'
import { SearchProductsPage } from '@/pages/SearchProductsPage/SearchProductsPage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage'
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage'
import { CartPage } from '@/pages/CartPage/CartPage'
import { WishlistPage } from '@/pages/WishlistPage/WishlistPage'
import { CheckoutPage } from '@/pages/CheckoutPage/CheckoutPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminCategoryFormPage } from '@/pages/admin/AdminCategoryFormPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminUserEditPage } from '@/pages/admin/AdminUserEditPage'
import { AdminBackupPage } from '@/pages/admin/AdminBackupPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categories/:slug', element: <CategoryProductsPage /> },
      { path: 'search', element: <SearchProductsPage /> },
      { path: 'makeup', element: <Navigate to="/categories/makeup" replace /> },
      { path: 'skincare', element: <Navigate to="/categories/skincare" replace /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
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
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/:id/edit', element: <AdminProductFormPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'categories/new', element: <AdminCategoryFormPage /> },
      { path: 'categories/:id/edit', element: <AdminCategoryFormPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'users/:id/edit', element: <AdminUserEditPage /> },
      { path: 'backup', element: <AdminBackupPage /> },
    ],
  },
])
