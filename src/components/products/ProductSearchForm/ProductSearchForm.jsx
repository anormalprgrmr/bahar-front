import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProductSearchForm.module.css'

/**
 * @param {{
 *   initialQuery?: string
 *   autoFocus?: boolean
 *   onSubmit?: () => void
 *   className?: string
 * }} props
 */
export function ProductSearchForm({
  initialQuery = '',
  autoFocus = false,
  onSubmit,
  className = '',
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    onSubmit?.()
  }

  return (
    <form
      className={`${styles.form} ${className}`.trim()}
      role="search"
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        className={styles.input}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="جستجوی محصولات..."
        aria-label="جستجوی محصولات"
        autoFocus={autoFocus}
      />
      <button type="submit" className={styles.submit}>
        جستجو
      </button>
    </form>
  )
}
