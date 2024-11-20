import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ReliefMethods({route}) {
  const {intensity,selectedAreas,medsTaken}=route.params;
  const navigation = useNavigation();
  const [selectedMethods, setSelectedMethods] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newMethod, setNewMethod] = useState('');
  const [reliefMethods, setReliefMethods] = useState([
    { id: 'noMeasure', name: "No measure taken" },
    { id: 1, name: "Cold compress" },
    { id: 2, name: "Dark room" },
    { id: 3, name: "Sleep" },
    { id: 4, name: "Hydration" },
    { id: 5, name: "Massage" },
    { id: 6, name: "Meditation" },
  ]);

  const handleSelectMethod = (method) => {
    if (method.id === 'noMeasure') {
      setSelectedMethods({ noMeasure: !selectedMethods.noMeasure });
    } else {
      if (selectedMethods.noMeasure) {
        setSelectedMethods({ [method.id]: true });
      } else {
        setSelectedMethods(prev => ({
          ...prev,
          [method.id]: !prev[method.id],
          noMeasure: false
        }));
      }
    }
  };

  const handleAddMethod = () => {
    if (newMethod.trim()) {
      const newReliefMethod = { id: reliefMethods.length, name: newMethod.trim() };
      setReliefMethods([reliefMethods[0], newReliefMethod, ...reliefMethods.slice(1)]);
      setNewMethod('');
      setShowModal(false);
    }
  };
  useEffect(()=>{
console.log(intensity,selectedAreas,medsTaken,)
  },[])

  const handleNextPress = () => {
    console.log("Selected relief methods:");
    if (selectedMethods.noMeasure) {
      console.log("No measure taken");
    } else {
      const reliefMethods=[];
      Object.entries(selectedMethods).forEach(([id, selected]) => {
        if (selected) {
          const method = reliefMethods.find(m => m.id.toString() === id);
          if (method){
            reliefMethods.push(method.name)
            console.log(method.name)
          };
        }
      });
    }
    // navigation.navigate('NextScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>What relief methods have you tried?</Text>
      
      <ScrollView contentContainerStyle={styles.grid}>
        {reliefMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.button,
              selectedMethods[method.id] && styles.selectedButton,
              method.id === 'noMeasure' && styles.noMeasureButton
            ]}
            onPress={() => handleSelectMethod(method)}
          >
            <View style={[
              styles.iconContainer,
              selectedMethods[method.id] && styles.selectedIconContainer,
              method.id === 'noMeasure' && styles.noMeasureIconContainer
            ]}>
              <Ionicons 
                name={method.id === 'noMeasure' ? 'close-circle-outline' : (selectedMethods[method.id] ? "checkmark" : "bandage-outline")} 
                size={24} 
                color="#F4F3F1" 
              />
            </View>
            <Text style={[styles.buttonText, method.id === 'noMeasure' && styles.noMeasureText]}>
              {method.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="add" size={24} color="#F4F3F1" />
          </View>
          <Text style={styles.buttonText}>Add new{'\n'}method</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#F4F3F1" />
        </TouchableOpacity>
        
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNextPress}
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
            <Text style={styles.modalTitle}>Add New Relief Method</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewMethod}
              value={newMethod}
              placeholder="Enter relief method"
              placeholderTextColor="#6A5ACD"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButton]} onPress={handleAddMethod}>
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
    paddingBottom: 100,
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
  noMeasureButton: {
    width: '100%',
    aspectRatio: undefined,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: '#352F44',
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
  noMeasureIconContainer: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginBottom: 0,
  },
  buttonText: {
    color: '#F4F3F1',
    fontSize: 12,
    textAlign: 'center',
  },
  noMeasureText: {
    fontSize: 16,
    fontWeight: '600',
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