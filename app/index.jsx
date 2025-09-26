import { StyleSheet, View, Text, Alert } from 'react-native'
import React, { useState } from 'react'

// Components
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AddItemButton from '../components/AddItemButton'
import ItemList from '../components/ItemList'
import ItemModal from '../components/ItemModal'
import SearchBar from '../components/SearchBar'
import SortButton from '../components/SortButton'
import ExportImportModal from '../components/ExportImportModal'
import FlashcardModal from '../components/FlashcardModal'
import FlashcardButton from '../components/FlashcardButton'

// Hooks
import { useCategories } from '../hooks/useCategories'
import { useSidebar } from '../hooks/useSidebar'
import { useItemModal } from '../hooks/useItemModal'
import { useSearch } from '../hooks/useSearch'

// Utils
import { exportData, processImportData, validateImportData } from '../utils/dataManager'

const Home = () => {
  // Custom hooks
  const {
    categories,
    selectedCategory,
    isLoading,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    addItem,
    editItem,
    deleteItem,
    updateCategorySortOrder,
    importData,
    clearAllData
  } = useCategories()

  const {
    slideAnim,
    toggleSidebar,
    closeSidebar
  } = useSidebar()

  const {
    modalVisible,
    itemName,
    setItemName,
    itemTags,
    setItemTags,
    itemDesc,
    setItemDesc,
    editingItem,
    openModal,
    closeModal,
    openEditModal,
    getItemData
  } = useItemModal()

  const {
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    clearSearch
  } = useSearch(selectedCategory)

  // Local state
  const [newCategoryName, setNewCategoryName] = useState("")
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [exportImportModalVisible, setExportImportModalVisible] = useState(false)
  const [flashcardModalVisible, setFlashcardModalVisible] = useState(false)

  // Handlers
  const handleAddCategory = () => {
    addCategory(newCategoryName)
    setNewCategoryName("")
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    closeSidebar()
  }

  const handleSaveItem = () => {
    const itemData = getItemData()
    
    if (editingItem !== null) {
      editItem(editingItem, itemData)
    } else {
      addItem(itemData)
    }
    
    closeModal()
    // Reset expanded index to show changes immediately
    setExpandedIndex(null)
  }

  const handleEditItem = (item, index) => {
    openEditModal(item, index)
  }

  const handleDeleteItem = (index) => {
    deleteItem(index)
    // Reset expanded index after deletion
    setExpandedIndex(null)
  }

  const handleSortChange = (sortOrder) => {
    if (selectedCategory) {
      updateCategorySortOrder(selectedCategory.id, sortOrder)
    }
  }

  const handleExport = async () => {
    await exportData(categories)
  }

  const handleImport = (data) => {
    const validation = validateImportData(data)
    if (!validation.valid) {
      Alert.alert('Error', validation.error)
      return
    }
    
    const processedCategories = processImportData(data)
    importData({ categories: processedCategories })
    Alert.alert('Success', 'Data imported successfully!')
  }

  const handleOpenFlashcards = () => {
    setFlashcardModalVisible(true)
  }

  // Show loading screen while data is being loaded
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading your notes...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar onMenuPress={toggleSidebar} />

      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={clearSearch}
      />

      {/* Sort Button */}
      <SortButton 
        sortOrder={selectedCategory?.sortOrder || 'alphabetical'}
        onSortChange={handleSortChange}
        selectedCategory={selectedCategory}
      />

      {/* Add Item Button */}
      <AddItemButton 
        selectedCategory={selectedCategory} 
        onPress={openModal} 
      />

      {/* Flashcard Button */}
      <FlashcardButton 
        selectedCategory={selectedCategory} 
        onPress={handleOpenFlashcards} 
      />

      {/* Body */}
      <View style={styles.body}>
        <ItemList
          items={filteredAndSortedItems}
          selectedCategory={selectedCategory}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />
      </View>

      {/* Sidebar */}
      <Sidebar
        slideAnim={slideAnim}
        onClose={closeSidebar}
        categories={categories}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        onAddCategory={handleAddCategory}
        onSelectCategory={handleSelectCategory}
        onDeleteCategory={deleteCategory}
        onExportImportPress={() => setExportImportModalVisible(true)}
        onClearAllData={clearAllData}
      />

      {/* Add/Edit Item Modal */}
      <ItemModal
        visible={modalVisible}
        onClose={closeModal}
        itemName={itemName}
        setItemName={setItemName}
        itemTags={itemTags}
        setItemTags={setItemTags}
        itemDesc={itemDesc}
        setItemDesc={setItemDesc}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      {/* Export/Import Modal */}
      <ExportImportModal
        visible={exportImportModalVisible}
        onClose={() => setExportImportModalVisible(false)}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Flashcard Modal */}
      <FlashcardModal
        visible={flashcardModalVisible}
        onClose={() => setFlashcardModalVisible(false)}
        items={filteredAndSortedItems}
        categoryName={selectedCategory?.name}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fdfdfd" 
  },
  body: { 
    flex: 1, 
    padding: 16 
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
})