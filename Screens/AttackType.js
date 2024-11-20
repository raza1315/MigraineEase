import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function AttackTypes() {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAttackType, setNewAttackType] = useState('');
  const [attackTypes, setAttackTypes] = useState([
    { id: 1, name: "Don't know\nyet", icon: 'close' },
    { id: 2, name: "Migraine", icon: 'flash' },
    { id: 3, name: "Tension-type\nheadache", icon: 'radio-button-on' },
    { id: 4, name: "Cluster\nheadache", icon: 'disc' },
    { id: 5, name: "Postdrome", icon: 'time' },
    { id: 6, name: "Prodrome", icon: 'time' },
  ]);

  const handleSelectType = (id) => {
    setSelectedType(id);
  };

  const handleAddAttackType = () => {
    if (newAttackType.trim()) {
      setAttackTypes([...attackTypes, { id: attackTypes.length + 1, name: newAttackType, icon: 'add-circle-outline' }]);
      setNewAttackType('');
      setShowModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>What are the attack types?</Text>
      
      <View style={styles.grid}>
        {attackTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.button, selectedType === type.id && styles.selectedButton]}
            onPress={() => handleSelectType(type.id)}
          >
            <View style={[styles.iconContainer, selectedType === type.id && styles.selectedIconContainer]}>
              <Ionicons name={type.icon} size={24} color="#F4F3F1" />
            </View>
            <Text style={styles.buttonText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="add" size={24} color="#F4F3F1" />
          </View>
          <Text style={styles.buttonText}>Add attack{'\n'}type</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="chevron-left" size={24} color="#F4F3F1" />
        </TouchableOpacity>
        
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]}
          onPress={() => navigation.navigate('MedsTaken')}
        >
          <Feather name="chevron-right" size={24} color="#F4F3F1" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Attack Type</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewAttackType}
              value={newAttackType}
              placeholder="Enter attack type name"
              placeholderTextColor="#6A5ACD"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButton]} onPress={handleAddAttackType}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1B1F',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F4F3F1',
    marginBottom: 40,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    width: '28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: 'rgba(106, 90, 205, 0.2)',
    borderRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#352F44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: '#6A5ACD',
  },
  buttonText: {
    color: '#F4F3F1',
    fontSize: 12,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#352F44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#6A5ACD',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#352F44',
  },
  activeDot: {
    backgroundColor: '#6A5ACD',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1C1B1F',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F4F3F1',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#352F44',
    color: '#F4F3F1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#6A5ACD',
  },
  modalButtonText: {
    color: '#F4F3F1',
    fontWeight: '600',
  },
});