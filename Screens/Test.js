import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function App() {
  const [selectedBox, setSelectedBox] = useState(null);

  const boxes = [
    { id: 1, label: 'Upper Left' },
    { id: 2, label: 'Middle Left' },
    { id: 3, label: 'Lower Left' },
    { id: 4, label: 'Upper Right' },
    { id: 5, label: 'Middle Right' },
    { id: 6, label: 'Lower Right' },
  ];

  const handleBoxPress = (boxId) => {
    setSelectedBox(boxId === selectedBox ? null : boxId);
  };

  const Box = ({ id, label }) => (
    <TouchableOpacity
      onPress={() => handleBoxPress(id)}
      style={[
        styles.box,
        selectedBox === id && styles.selectedBox
      ]}
    >
      <Text style={[
        styles.boxText,
        selectedBox === id && styles.selectedBoxText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Pain Location</Text>
      
      <View style={styles.heartContainer}>
        <View style={styles.boxesContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {boxes.slice(0, 3).map(box => (
              <Box key={box.id} id={box.id} label={box.label} />
            ))}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {boxes.slice(3).map(box => (
              <Box key={box.id} id={box.id} label={box.label} />
            ))}
          </View>
        </View>

        <Svg width={180} height={160} viewBox="0 0 24 24" style={styles.heartOutline}>
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        </Svg>
      </View>

      {selectedBox && (
        <Text style={styles.selectedText}>
          Selected: {boxes.find(box => box.id === selectedBox)?.label}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b26',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 160,
  },
  heartOutline: {
    position: 'absolute',
    zIndex: 1,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    width: 120,
    height: 120,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  box: {
    width: 40,
    height: 35,
    backgroundColor: '#4a9caa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ffffff33',
    margin: 2,
  },
  selectedBox: {
    backgroundColor: '#2d6069',
    borderColor: '#ffffff',
    borderWidth: 1,
    transform: [{ scale: 1.05 }],
  },
  boxText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '500',
  },
  selectedBoxText: {
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
  },
});