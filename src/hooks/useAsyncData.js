import { useEffect, useState } from 'react'

/**
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fetcher
 */
export function useAsyncData(key, fetcher) {
  const [data, setData] = useState(/** @type {T | null} */ (null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {Error | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [key])

  return { data, loading, error }
}
