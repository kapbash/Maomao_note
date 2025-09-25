import { useState } from 'react'
import { generateId } from '../utils/dataManager'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const addCategory = (name) => {
    if (name.trim() === "") return
    const newCategory = {
      id: generateId(),
      name,
      items: [],
      sortOrder: 'alphabetical',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCategories([...categories, newCategory])
  }

  const deleteCategory = (name) => {
    setCategories(categories.filter(cat => cat.name !== name))
    if (selectedCategory?.name === name) setSelectedCategory(null)
  }

  const addItem = (item) => {
    if (!selectedCategory) return
    if (item.name.trim() === "") return

    const newItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          items: [...cat.items, newItem],
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })

    setCategories(updatedCategories)
  }

  const editItem = (itemIndex, updatedItem) => {
    if (!selectedCategory) return

    const itemWithTimestamp = {
      ...updatedItem,
      updatedAt: new Date().toISOString()
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedItems = cat.items.map((item, idx) =>
          idx === itemIndex ? itemWithTimestamp : item
        )
        return { 
          ...cat, 
          items: updatedItems,
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })

    setCategories(updatedCategories)
  }

  const deleteItem = (itemIndex) => {
    if (!selectedCategory) return

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          items: cat.items.filter((_, idx) => idx !== itemIndex),
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })

    setCategories(updatedCategories)
  }

  const updateCategorySortOrder = (categoryId, sortOrder) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          sortOrder,
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })
    setCategories(updatedCategories)
    
    // Update selected category if it's the one being modified
    if (selectedCategory && selectedCategory.id === categoryId) {
      const updatedSelected = updatedCategories.find(cat => cat.id === categoryId)
      setSelectedCategory(updatedSelected)
    }
  }

  const importData = (data) => {
    setCategories(data.categories)
    setSelectedCategory(null)
  }

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    addItem,
    editItem,
    deleteItem,
    updateCategorySortOrder,
    importData
  }
}