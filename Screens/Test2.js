import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AttackTimeSelector() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [startPreset, setStartPreset] = useState('just-now');
  const [endPreset, setEndPreset] = useState('still-going');
  const navigation = useNavigation();

  const handleStartPreset = (preset) => {
    setStartPreset(preset);
    if (preset === 'just-now') {
      setStartTime(new Date());
    } else if (preset === 'other') {
      // Handle custom time picker
    }
  };

  const handleEndPreset = (preset) => {
    setEndPreset(preset);
    if (preset === 'just-now') {
      const now = new Date();
      if (now > startTime) {
        setEndTime(now);
      } else {
        setEndTime(startTime);
      }
    } else if (preset === 'still-going') {
      setEndTime(null);
    } else if (preset === 'other') {
      // Handle custom time picker
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Start & End time of your attack</Text>

      {/* Start Time Section */}
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>Start time:</Text>
        <Text style={styles.timeDisplay}>
          {format(startTime, 'EEE, MMM d, HH:mm')}
        </Text>
        
        <Text style={styles.presetsLabel}>Time presets</Text>
        <View style={styles.presetButtons}>
          <TouchableOpacity
            style={[styles.presetButton, startPreset === 'just-now' && styles.activePreset]}
            onPress={() => handleStartPreset('just-now')}
          >
            <Text style={[styles.presetText, startPreset === 'just-now' && styles.activePresetText]}>
              Just now
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.presetButton, startPreset === 'other' && styles.activePreset]}
            onPress={() => handleStartPreset('other')}
          >
            <Text style={[styles.presetText, startPreset === 'other' && styles.activePresetText]}>
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* End Time Section */}
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>End time:</Text>
        <Text style={styles.timeDisplay}>
          {endTime ? format(endTime, 'EEE, MMM d, HH:mm') : 'Still going'}
        </Text>
        
        <Text style={styles.presetsLabel}>Time presets</Text>
        <View style={styles.presetButtons}>
          <TouchableOpacity
            style={[styles.presetButton, endPreset === 'still-going' && styles.activePreset]}
            onPress={() => handleEndPreset('still-going')}
          >
            <Text style={[styles.presetText, endPreset === 'still-going' && styles.activePresetText]}>
              Still going
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.presetButton, endPreset === 'just-now' && styles.activePreset]}
            onPress={() => handleEndPreset('just-now')}
          >
            <Text style={[styles.presetText, endPreset === 'just-now' && styles.activePresetText]}>
              Just now
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.presetButton, endPreset === 'other' && styles.activePreset]}
            onPress={() => handleEndPreset('other')}
          >
            <Text style={[styles.presetText, endPreset === 'other' && styles.activePresetText]}>
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    color: '#fff',
    marginBottom: 30,
  },
  timeSection: {
    backgroundColor: '#23252A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  timeDisplay: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  presetsLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2A2D35',
  },
  activePreset: {
    backgroundColor: '#6366F1',
  },
  presetText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  activePresetText: {
    color: '#fff',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2D35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonPrimary: {
    backgroundColor: '#6366F1',
  },
});