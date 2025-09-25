import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const Navbar = ({ onMenuPress }) => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>Maomao Notes</Text>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    elevation: 40,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#222" 
  },
})