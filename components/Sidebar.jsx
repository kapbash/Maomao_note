import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated } from 'react-native'
import React from 'react'
import { Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Sidebar = ({ 
  slideAnim, 
  onClose, 
  categories, 
  newCategoryName, 
  setNewCategoryName, 
  onAddCategory, 
  onSelectCategory, 
  onDeleteCategory,
  onExportImportPress,
  onClearAllData
}) => {
  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={onClose}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
        <Text style={{ color: "#fff" }}>Back</Text>
      </TouchableOpacity>

      {/* Add Category */}
      <View style={styles.addCategoryRow}>
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="New Category"
          placeholderTextColor="#aaa"
          style={styles.categoryInput}
        />
        <TouchableOpacity style={styles.addCategoryBtn} onPress={onAddCategory}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category list */}
      <View style={styles.categories}>
        {categories.map((cat, index) => (
          <View key={cat.id || index} style={styles.categoryRow}>
            <TouchableOpacity
              onPress={() => onSelectCategory(cat)}
              style={{ flex: 1 }}
            >
              <Text style={styles.categoryItem}>📂 {cat.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDeleteCategory(cat.name)}>
              <Ionicons name="trash-outline" size={20} color="#f66" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Export/Import Button */}
        <TouchableOpacity style={styles.exportImportBtn} onPress={onExportImportPress}>
          <Ionicons name="cloud-outline" size={20} color="#fff" />
          <Text style={styles.exportImportText}>Data Management</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default Sidebar

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 60,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#333",
    padding: 16,
    zIndex: 100,
  },
  backBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16 
  },
  categories: { 
    marginTop: 20 
  },
  categoryRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  categoryItem: { 
    color: "#fff", 
    fontSize: 16, 
    paddingVertical: 8 
  },
  addCategoryRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  categoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    padding: 8,
    color: "#fff",
    marginRight: 8,
  },
  addCategoryBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
  },
  exportImportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  exportImportText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  clearDataBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  clearDataText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
})