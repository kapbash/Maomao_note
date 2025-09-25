import { StyleSheet, Text, View, TouchableOpacity, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ItemList = ({ 
  items,
  selectedCategory,
  expandedIndex, 
  setExpandedIndex, 
  onEditItem, 
  onDeleteItem 
}) => {
  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!selectedCategory) {
    return <Text>Select a category to view items.</Text>
  }

  return (
    <>
      <Text style={styles.sectionTitle}>
        {selectedCategory.name} Items ({items.length}):
      </Text>
      {items.length === 0 ? (
        <Text>No items yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => item.id || idx.toString()}
          renderItem={({ item, index }) => {
            const expanded = expandedIndex === index;
            return (
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                activeOpacity={0.8}
              >
                <View style={styles.itemBox}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {expanded && (
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      <Text style={styles.itemTags}>Tags: {item.tags.join(", ")}</Text>
                      {/* Item actions */}
                      <View style={styles.itemActions}>
                        <TouchableOpacity onPress={() => onEditItem(item, index)} style={styles.editBtn}>
                          <Ionicons name="create-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDeleteItem(index)} style={styles.deleteBtn}>
                          <Ionicons name="trash-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  )
}

export default ItemList

const styles = StyleSheet.create({
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 8 
  },
  itemBox: { 
    backgroundColor: "#f0f0f0", 
    padding: 10, 
    marginVertical: 6, 
    borderRadius: 6 
  },
  itemName: { 
    fontWeight: "bold", 
    fontSize: 16, 
    padding: 3 
  },
  itemTags: { 
    fontSize: 12, 
    color: "#555", 
    marginTop: 4 
  },
  itemDescription: { 
    fontSize: 14, 
    marginTop: 4 
  },
  itemDetails: { 
    marginTop: 6 
  },
  itemActions: { 
    flexDirection: "row", 
    marginTop: 8 
  },
  editBtn: { 
    backgroundColor: "#4a90e2", 
    padding: 6, 
    borderRadius: 6 
  },
  deleteBtn: { 
    backgroundColor: "#e74c3c", 
    padding: 6, 
    borderRadius: 6 
  },
})