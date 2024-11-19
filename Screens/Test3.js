import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PainScale() {
  const [selectedIntensity, setSelectedIntensity] = useState(null);

  const painLevels = [
    { level: 10, color: '#E84855', label: 'HURTS WORST' },
    { level: 9, color: '#E84855', label: 'HURTS WORST' },
    { level: 8, color: '#D96941', label: 'Hurts a lot\nUnable to do most activities' },
    { level: 7, color: '#D96941', label: 'SEVERE' },
    { level: 6, color: '#F2A541', label: 'MODERATE' },
    { level: 5, color: '#F2A541', label: 'MODERATE' },
    { level: 4, color: '#90A955', label: 'MILD' },
    { level: 3, color: '#90A955', label: 'MILD' },
    { level: 2, color: '#4F772D', label: 'HURTS A BIT' },
    { level: 1, color: '#4F772D', label: 'HURTS A BIT' },
    { level: 0, color: '#31572C', label: 'NO PAIN' },
  ];

  const getEmoji = (level) => {
    if (level >= 9) return '😫';
    if (level >= 7) return '😢';
    if (level >= 5) return '😕';
    if (level >= 3) return '😐';
    if (level >= 1) return '🙂';
    return '😊';
  };

  const handleNext = () => {
    console.log('Selected pain intensity:', selectedIntensity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is the highest pain level of this attack?</Text>
      
      <ScrollView style={styles.scaleContainer}>
        {painLevels.map((item) => (
          <TouchableOpacity
            key={item.level}
            style={[
              styles.levelContainer,
              { backgroundColor: item.color },
              selectedIntensity === item.level && styles.selectedLevel
            ]}
            onPress={() => setSelectedIntensity(item.level)}
          >
            <Text style={styles.levelNumber}>{item.level}</Text>
            <View style={styles.labelContainer}>
              <Text style={styles.emoji}>{getEmoji(item.level)}</Text>
              <Text style={styles.levelLabel}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]} 
          onPress={handleNext}
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B1E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    marginTop: 40,
  },
  scaleContainer: {
    flex: 1,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 2,
    borderRadius: 8,
  },
  selectedLevel: {
    borderWidth: 2,
    borderColor: 'white',
  },
  levelNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    width: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  levelLabel: {
    color: 'white',
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#6C63FF',
  },
});