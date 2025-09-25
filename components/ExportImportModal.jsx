// components/ExportImportModal.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

export default function ExportImportModal({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);

  // ------------------ EXPORT ------------------
  const exportData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(keys);

      const exportObject = {};
      allData.forEach(([key, value]) => {
        exportObject[key] = JSON.parse(value);
      });

      const fileUri = FileSystem.documentDirectory + `maomao_notes_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportObject, null, 2));

      Alert.alert('Success', 'Data exported successfully!');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  // ------------------ IMPORT ------------------
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (res.type === 'success') {
        setSelectedFile(res);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to pick file.');
    }
  };

  const importData = async () => {
    if (!selectedFile) return;
    setImporting(true);

    try {
      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri);
      const data = JSON.parse(fileContent);

      // Clear current storage
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);

      // Save imported data
      const entries = Object.entries(data).map(([key, value]) => [key, JSON.stringify(value)]);
      await AsyncStorage.multiSet(entries);

      Alert.alert('Success', 'Data imported successfully!');
      setSelectedFile(null);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to import data.');
    } finally {
      setImporting(false);
    }
  };

  const clearFile = () => setSelectedFile(null);

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Export / Import Data</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="cloud-upload-outline" size={24} color="black" />

          </TouchableOpacity>
        </View>

        {/* Export Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Your Data</Text>
          <TouchableOpacity style={styles.btn} onPress={exportData}>
            <Ionicons name="cloud-upload-outline" size={24} color="black" />

            <Text style={styles.btnText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        {/* Import Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Import Data</Text>
          <TouchableOpacity style={styles.btn} onPress={pickFile}>
            <Ionicons name="cloud-upload-outline" size={24} color="black" />

            <Text style={styles.btnText}>Choose File</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.selectedFile}>
              <Text>{selectedFile.name}</Text>
              <TouchableOpacity onPress={clearFile}>
                <Ionicons name="cloud-upload-outline" size={24} color="black" />

              </TouchableOpacity>
            </View>
          )}

          {selectedFile && (
            <TouchableOpacity
              style={[styles.btn, importing && { opacity: 0.6 }]}
              onPress={importData}
              disabled={importing}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="black" />

              <Text style={styles.btnText}>{importing ? 'Importing...' : 'Import Data'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  section: { marginBottom: 16 },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
});
