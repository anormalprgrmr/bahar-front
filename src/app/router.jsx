import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout/MainLayout'
import { HomePage } from '@/pages/HomePage/HomePage'
import { PlaceholderPage } from '@/pages/PlaceholderPage/PlaceholderPage'

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
        element: <PlaceholderPage title="جزئیات محصول" />,
      },
    ],
  },
])
