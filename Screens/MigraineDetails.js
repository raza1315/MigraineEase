import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Activity, Pill, MapPin, Zap, ChevronLeft, Share2, Download } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

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

const MigraineDetailsPDF = ({ route, navigation }) => {
  const { id, intensity, medsTaken, pain_parts, reliefMethods, start_time, end_time } = route.params.migraine;
  const fadeAnim = new Animated.Value(0);
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [refreshKey]);

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen comes into focus
      setRefreshKey(prevKey => prevKey + 1);
    }, [])
  );

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

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                padding: 20px;
                color: #F4F3F1;
                background-color: #1C1B1F;
              }
              .card {
                background-color: rgba(42, 42, 60, 0.8);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
              }
              .row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
              }
              .label {
                color: #9CA3AF;
                font-size: 14px;
                margin-bottom: 4px;
              }
              .value {
                color: #F4F3F1;
                font-size: 16px;
                font-weight: 600;
              }
              .sectionTitle {
                color: #F4F3F1;
                font-size: 18px;
                font-weight: 600;
                margin-left: 12px;
              }
              .painBars {
                display: flex;
                justify-content: space-between;
                margin-top: 12px;
              }
              .painBar {
                flex: 1;
                height: 12px;
                margin: 0 2px;
                border-radius: 6px;
              }
              .tagContainer {
                display: flex;
                flex-wrap: wrap;
                margin-top: 8px;
              }
              .tag {
                background-color: rgba(106, 90, 205, 0.2);
                border-radius: 20px;
                padding: 6px 12px;
                margin: 4px;
                color: #F4F3F1;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <h1 style="color: #F4F3F1; text-align: center;">Migraine Details</h1>
            
            <div class="card">
              <div class="row">
                <span class="label">Start Time:</span>
                <span class="value">${formatDate(start_time)}</span>
              </div>
              <div class="row">
                <span class="label">End Time:</span>
                <span class="value">${formatDate(end_time)}</span>
              </div>
              <div class="row">
                <span class="label">Duration:</span>
                <span class="value" style="color: #6A5ACD;">${formatDuration(start_time, end_time)}</span>
              </div>
            </div>

            <div class="card">
              <div class="row">
                <span class="sectionTitle">Intensity: ${intensity}/10</span>
              </div>
              <div class="painBars">
                ${[...Array(10)].map((_, index) => `
                  <div class="painBar" style="background-color: ${
                    index < intensity
                      ? index < 3 ? "#4CAF50" : index < 7 ? "#FFC107" : "#FF5252"
                      : "#2A2A3C"
                  };"></div>
                `).join('')}
              </div>
            </div>

            <div class="card">
              <div class="row">
                <span class="sectionTitle">Medications Taken:</span>
              </div>
              ${medsTaken.map(med => `
                <div class="row">
                  <span class="value">${med.name} - ${med.dosage} dose</span>
                </div>
              `).join('')}
            </div>

            <div class="card">
              <div class="row">
                <span class="sectionTitle">Pain Locations:</span>
              </div>
              <div class="tagContainer">
                ${pain_parts.map(part => `
                  <span class="tag">${part}</span>
                `).join('')}
              </div>
            </div>

            <div class="card">
              <div class="row">
                <span class="sectionTitle">Relief Methods:</span>
              </div>
              <div class="tagContainer">
                ${reliefMethods.map(method => `
                  <span class="tag">${method}</span>
                `).join('')}
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('PDF file saved to:', uri);
      setPdfUri(uri);
      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sharePDF = async () => {
    setIsLoading(true);
    try {
      const uri = pdfUri || await generatePDF();
      if (uri && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Migraine Report',
          UTI: 'com.adobe.pdf'
        });
        // Navigate away and come back to trigger a reload
        // navigation.navigate('welcome');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Failed to share PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // const downloadPDF = async () => {
  //   setIsLoading(true);
  //   try {
  //     const uri = pdfUri || await generatePDF();
  //     if (uri) {
  //       const fileUri = `${FileSystem.documentDirectory}migraine_report_${id}.pdf`;
  //       await FileSystem.copyAsync({
  //         from: uri,
  //         to: fileUri
  //       });
  //       Alert.alert('Success', `PDF saved to ${fileUri}`);
  //     }
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  //     Alert.alert('Error', 'Failed to download PDF');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <LinearGradient colors={['#1C1B1F', '#2A2A3C']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft color="#F4F3F1" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Migraine Details</Text>
            <View style={styles.actionButtons}>
              {isLoading ? (
                <ActivityIndicator color="#F4F3F1" />
              ) : (
                <>
                  <TouchableOpacity onPress={sharePDF} style={styles.actionButton}>
                    <Share2 color="#F4F3F1" size={24} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={downloadPDF} style={styles.actionButton}>
                    <Download color="#F4F3F1" size={24} />
                  </TouchableOpacity> */}
                </>
              )}
            </View>
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
            <View style={{...styles.row, marginHorizontal:"auto"}}>
              <Text style={{...styles.label, fontSize:16, marginTop:2, marginLeft:-5}}>Duration:</Text>
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
    justifyContent: 'space-between',
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
    flex: 1,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(106, 90, 205, 0.2)',
    marginLeft: 8,
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

export default MigraineDetailsPDF;

