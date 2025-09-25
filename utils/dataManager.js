import { Alert, Share } from 'react-native'

export const exportData = async (categories) => {
  try {
    const exportData = {
      categories: categories.map(cat => ({
        ...cat,
        items: cat.items.map(item => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }))
      })),
      lastBackup: new Date().toISOString()
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    
    // Try to share the data
    const result = await Share.share({
      message: jsonString,
      title: 'MaoMao Notes Export'
    })

    if (result.action === Share.sharedAction) {
      Alert.alert('Success', 'Data exported successfully!')
    }
  } catch (error) {
    console.error('Export error:', error)
    Alert.alert('Error', 'Failed to export data')
  }
}

export const validateImportData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' }
  }

  if (!data.categories || !Array.isArray(data.categories)) {
    return { valid: false, error: 'Categories array is required' }
  }

  for (const category of data.categories) {
    if (!category.name || typeof category.name !== 'string') {
      return { valid: false, error: 'Each category must have a name' }
    }

    if (!category.items || !Array.isArray(category.items)) {
      return { valid: false, error: 'Each category must have an items array' }
    }

    for (const item of category.items) {
      if (!item.name || typeof item.name !== 'string') {
        return { valid: false, error: 'Each item must have a name' }
      }
      if (!item.tags || !Array.isArray(item.tags)) {
        return { valid: false, error: 'Each item must have a tags array' }
      }
    }
  }

  return { valid: true }
}

export const processImportData = (data) => {
  return data.categories.map(cat => ({
    ...cat,
    sortOrder: cat.sortOrder || 'alphabetical',
    createdAt: cat.createdAt || new Date().toISOString(),
    updatedAt: cat.updatedAt || new Date().toISOString(),
    items: cat.items.map(item => ({
      ...item,
      id: item.id || generateId(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      description: item.description || ''
    }))
  }))
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 15)
}