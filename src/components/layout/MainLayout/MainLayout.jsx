import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className={styles.layout}>
      <Header />
      <main key={location.pathname} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
