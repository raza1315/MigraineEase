import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function Conclusion({ route }) {
  const navigation = useNavigation();
  const isFocused=useIsFocused();
  const {
    intensity,
    selectedAreas,
    medsTaken,
    reliefMethods,
    startTime,
    endTime,
  } = route.params;
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if(isFocused){
      getUserId();
    }
  },[isFocused]);
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      setUserId(userId);
      console.log(userId);
    } catch (error) {
      console.log(error);
    }
  };
  const formatTime = (timeString) => {
    if (!timeString) return "Still going";
    const date = new Date(timeString);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}, ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };
  const handleConfirm = async () => {
    try {
      const body = {
        userId,
        startTime,
        endTime,
        intensity,
        selectedAreas,
        medsTaken,
        reliefMethods,
      };
      console.log(body);
      console.log("submitted");
      const res=await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/migraineAttack/submit`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
      })
      console.log("response");
      if(res.status===200){
        console.log("success");
        Toast.show({
          type: 'success',
          text1: "Recorded Successfully",
          text2: "Recorded is stored successfully",
        });
        setTimeout(() => {          
          navigation.navigate("MainTabs",{screen:"home"});
        },1500)
      }
      else{
        Toast.show({
          type: 'error',
          text1: "Error",
          text2: "Something went wrong",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calculateDuration = () => {
    if (!startTime || !endTime) return "--";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderPainBars = (intensity) => {
    return (
      <View style={styles.painBars}>
        {[...Array(10)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.painBar,
              {
                backgroundColor:
                  index < intensity
                    ? index < 3
                      ? "#4CAF50"
                      : index < 7
                      ? "#FFC107"
                      : "#FF5252"
                    : "#2A2A3C",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast style={{zIndex:100}} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Summary</Text>

        <View style={styles.card}>
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Start:</Text>
              <Text
                style={styles.timeValue}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatTime(startTime)}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>End:</Text>
              <Text
                style={styles.timeValue}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatTime(endTime)}
              </Text>
            </View>
            <Text style={styles.duration}>Duration</Text>
            <Text style={styles.durationValue}>{calculateDuration()}</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Medication</Text>
            <View style={styles.medicationContainer}>
              {medsTaken.map((med, index) => (
                <Text key={index} style={styles.medicationText}>
                  {med.name} - {med.dosage} dose
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Pain Intensity</Text>
            <View style={styles.intensityContainer}>
              <MaterialCommunityIcons
                name="emoticon-sad"
                size={40}
                color="#FF5252"
              />
              <Text style={styles.intensityText}>{intensity}/10</Text>
              {renderPainBars(intensity)}
            </View>
          </View>
        </View>

        <View style={styles.fullWidthContainer}>
          <View style={styles.fullWidthItem}>
            <Text style={styles.sectionTitle}>Pain Location</Text>
            {selectedAreas.length === 0 ? (
              <Text style={styles.centerText}>No areas selected</Text>
            ) : (
              <View style={styles.locationContainer}>
                {selectedAreas.map((area, index) => (
                  <Text key={index} style={styles.locationText}>
                    {area}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.fullWidthContainer}>
          <View style={styles.fullWidthItem}>
            <Text style={styles.sectionTitle}>Relief Methods</Text>
            <View style={styles.methodsGrid}>
              {reliefMethods.map((method, index) => (
                <View key={index} style={styles.methodItem}>
                  <Text style={styles.methodText}>{method}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => navigation.navigate("MainTabs", { screen: "home" })}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1F",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F4F3F1",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  timeSection: {
    gap: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLabel: {
    color: "#9CA3AF",
    fontSize: 16,
    flex: 1,
  },
  timeValue: {
    color: "#F4F3F1",
    fontSize: 16,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  duration: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
  },
  durationValue: {
    color: "#F4F3F1",
    fontSize: 24,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
  },
  fullWidthContainer: {
    marginBottom: 16,
  },
  fullWidthItem: {
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 12,
  },
  centerText: {
    color: "#F4F3F1",
    fontSize: 14,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  locationText: {
    color: "#F4F3F1",
    fontSize: 14,
    backgroundColor: "#1C1B1F",
    borderRadius: 8,
    padding: 8,
  },
  medicationContainer: {
    gap: 8,
  },
  medicationText: {
    color: "#F4F3F1",
    fontSize: 14,
  },
  intensityContainer: {
    alignItems: "center",
    gap: 8,
  },
  intensityText: {
    color: "#F4F3F1",
    fontSize: 24,
    fontWeight: "bold",
  },
  painBars: {
    flexDirection: "row",
    gap: 4,
    width: "100%",
    marginTop: 8,
  },
  painBar: {
    width: 12,
    height: 24,
    borderRadius: 4,
  },
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  methodItem: {
    backgroundColor: "#1C1B1F",
    borderRadius: 8,
    padding: 8,
  },
  methodText: {
    color: "#F4F3F1",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4F3F1",
  },
  deleteButtonText: {
    color: "#F4F3F1",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#6A5ACD",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#F4F3F1",
    fontSize: 16,
    fontWeight: "600",
  },
});
