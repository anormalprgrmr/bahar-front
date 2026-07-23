import { useAsyncData } from '@/hooks/useAsyncData'
import { listCategories } from '@/services/categories/categoryService'

export function useCategories() {
  const { data, loading, error } = useAsyncData('categories', listCategories)
  return {
    categories: data ?? [],
    loading,
    error,
  }
}
