import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Activity, Pill, MapPin, Zap, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleString('en-US', options);
};

const formatDuration = (start, end) => {
  const diffMs = new Date(end) - new Date(start);
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

const MigraineDetails = ({ route, navigation }) => {
  const { id, intensity, medsTaken, pain_parts, reliefMethods, start_time, end_time } = route.params.migraine;
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderPainBars = (intensity) => (
    <View style={styles.painBars}>
      {[...Array(10)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.painBar,
            {
              backgroundColor: index < intensity
                ? index < 3 ? "#4CAF50" : index < 7 ? "#FFC107" : "#FF5252"
                : "#2A2A3C",
              opacity: fadeAnim,
              transform: [{ scaleY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1C1B1F', '#2A2A3C']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft color="#F4F3F1" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Migraine Details</Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <View style={styles.row}>
              <Clock color="#6A5ACD" size={24} />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Start Time:</Text>
                <Text style={styles.value}>{formatDate(start_time)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Clock color="#6A5ACD" size={24} />
              <View style={styles.textContainer}>
                <Text style={styles.label}>End Time:</Text>
                <Text style={styles.value}>{formatDate(end_time)}</Text>
              </View>
            </View>
            <View style={{...styles.row,marginHorizontal:"auto"}}>
              <Text style={{...styles.label,fontSize:16,marginTop:2,marginLeft:-5}}>Duration:</Text>
              <Text style={styles.durationValue}>{formatDuration(start_time, end_time)}</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <View style={styles.row}>
              <Activity color="#6A5ACD" size={24} />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Intensity:</Text>
                <Text style={styles.value}>{intensity}/10</Text>
              </View>
            </View>
            {renderPainBars(intensity)}
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <View style={styles.row}>
              <Pill color="#6A5ACD" size={24} />
              <Text style={styles.sectionTitle}>Medications Taken:</Text>
            </View>
            {medsTaken.map((med, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.value}>{med.name} - {med.dosage} dose</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <View style={styles.row}>
              <MapPin color="#6A5ACD" size={24} />
              <Text style={styles.sectionTitle}>Pain Locations:</Text>
            </View>
            <View style={styles.tagContainer}>
              {pain_parts.map((part, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{part}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <View style={styles.row}>
              <Zap color="#6A5ACD" size={24} />
              <Text style={styles.sectionTitle}>Relief Methods:</Text>
            </View>
            <View style={styles.tagContainer}>
              {reliefMethods.map((method, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{method}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(106, 90, 205, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F3F1',
    marginLeft: 12,
  },
  card: {
    backgroundColor: 'rgba(42, 42, 60, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#F4F3F1',
    fontSize: 16,
    fontWeight: '600',
  },
  durationValue: {
    color: '#6A5ACD',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    color: '#F4F3F1',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  listItem: {
    marginLeft: 36,
    marginTop: 8,
  },
  painBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  painBar: {
    flex: 1,
    height: 12,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: 'rgba(106, 90, 205, 0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: '#F4F3F1',
    fontSize: 14,
  },
});

export default MigraineDetails;