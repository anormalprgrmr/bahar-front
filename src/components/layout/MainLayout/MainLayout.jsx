import { SiteBanner } from '@/components/layout/SiteBanner/SiteBanner'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className={styles.layout}>
      <SiteBanner />
      <Header />
      <main key={location.pathname} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
