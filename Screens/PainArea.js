import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PainArea = ({route}) => {
  const {startTime, endTime} = route.params;
  const navigation = useNavigation();
  const [selectedAreas, setSelectedAreas] = useState([]);

  const toggleArea = (area) => {
    setSelectedAreas(prevAreas => 
      prevAreas.includes(area)
        ? prevAreas.filter(a => a !== area)
        : [...prevAreas, area]
    );
  };

  const isSelected = (area) => selectedAreas.includes(area);

  const handleNext = () => {
    console.log(selectedAreas,startTime,endTime);
    navigation.navigate('PainScale', { selectedAreas, startTime, endTime });
  };

  const renderTouchableArea = (area, top, left, right, width = 25, height = 25) => (
    <TouchableOpacity
      style={[
        styles.touchableArea,
        { top, left, right, width, height },
        isSelected(area) && styles.selectedArea
      ]}
      onPress={() => toggleArea(area)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Pain Area</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/fronthead.png")}
          style={styles.image}
        />
        {renderTouchableArea("Upper Right Front of head", "15%", "23%")}
        {renderTouchableArea("Upper Left Front of head", "15%", undefined, "36%")}
        {renderTouchableArea("Left Temple", "40%", undefined, "23%", 15, 15)}
        {renderTouchableArea("Right Temple", "40%", "9%", undefined, 15, 15)}
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/backhead.png")}
          style={styles.image}
        />
        {renderTouchableArea("Upper Left Back of head", "15%", "25%")}
        {renderTouchableArea("Upper Right Back of head", "15%", undefined, "32%")}
        {renderTouchableArea("Lower Right Back of head", "45%", undefined, "32%")}
        {renderTouchableArea("Lower Left Back of head", "45%", "25%")}
        {renderTouchableArea("Left Back of Neck", "70%", "27%")}
        {renderTouchableArea("Right Back of Neck", "70%", undefined, "35%")}
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    height: 260,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
  },
  touchableArea: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedArea: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PainArea;