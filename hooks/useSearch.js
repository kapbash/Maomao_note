import { useState, useMemo } from 'react'
import { filterItems, sortItems } from '../utils/searchUtils'

export const useSearch = (selectedCategory) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSortedItems = useMemo(() => {
    if (!selectedCategory || !selectedCategory.items) return []
    
    let items = selectedCategory.items
    
    // Apply search filter
    items = filterItems(items, searchQuery)
    
    // Apply sorting
    items = sortItems(items, selectedCategory.sortOrder || 'alphabetical')
    
    return items
  }, [selectedCategory, searchQuery])

  const clearSearch = () => {
    setSearchQuery('')
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    clearSearch
  }
}