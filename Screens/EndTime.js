import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const EndTime = ({ route, navigation }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [tempDate, setTempDate] = useState(null);

  useEffect(() => {
    const { data } = route.params;
    const parsedStartTime = new Date(data.start_time);
    setStartTime(parsedStartTime);
    console.log("Parsed start time:", parsedStartTime);
    console.log("Start time:", formatDate(parsedStartTime));
  }, []);

  const formatDate = (date) => {
    if (!date || isNaN(date)) return "Invalid date";
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      if (pickerMode === "date") {
        setTempDate(selectedDate);
        setPickerMode("time");
        if (Platform.OS === "android") {
          setShowPicker(false);
          setTimeout(() => setShowPicker(true), 100);
        }
      } else {
        const newEndTime = new Date(tempDate);
        newEndTime.setHours(selectedDate.getHours());
        newEndTime.setMinutes(selectedDate.getMinutes());

        if (newEndTime <= startTime) {
          Alert.alert("Invalid Time", "End time must be after start time");
        } else {
          setEndTime(newEndTime);
          console.log("Start time:", formatDate(startTime));
          console.log("End time:", formatDate(newEndTime));
        }
        setShowPicker(false);
        setPickerMode("date");
      }
    }
  };

  const showDatepicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  const handleJustNow = () => {
    const now = new Date();
    if (now <= startTime) {
      Alert.alert("Invalid Time", "End time must be after start time");
    } else {
      setEndTime(now);
      console.log("Start time:", formatDate(startTime));
      console.log("End time (Just Now):", formatDate(now));
    }
  };

  const handleUpdate = async () => {
    if (!endTime) {
      Alert.alert(
        "Missing End Time",
        "Please select an end time before updating."
      );
      return;
    } else if (endTime <= startTime) {
      console.log("Start time:", startTime);
      console.log("End time:", endTime);
      return;
    }
    const body = {
      endTime,
      id: route.params.data.user_id,
    };
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_URL}/migraineAttack/updateMigraineAttack`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (res.status === 200) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Recorded Updated Successfully",
        topOffset: 50,
      });
      setTimeout(() => {
        navigation.navigate("MainTabs", { screen: "home" });
      }, 1000);
    }

    console.log("Updating end time:", formatDate(endTime), endTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A2A3C" />
      <Text style={styles.title}>Select End Time</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.label}>Start Time:</Text>
        <Text style={styles.time}>
          {startTime ? formatDate(startTime) : "Loading..."}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.label}>End Time:</Text>
        <Text style={styles.time}>
          {endTime ? formatDate(endTime) : "Not selected"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleJustNow}>
          <Text style={styles.buttonText}>Just Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showDatepicker}>
          <Text style={{ ...styles.buttonText, zIndex: 1 }}>
            Select Date & Time
          </Text>
        </TouchableOpacity>
      </View>
      {endTime && (
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      )}
      {showPicker && (
        <DateTimePicker
          value={
            tempDate ||
            endTime ||
            new Date(Math.max(startTime.getTime() + 60000, Date.now()))
          }
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndTimeChange}
          minimumDate={new Date(startTime.getTime() + 60000)}
        />
      )}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("MainTabs", { screen: "home" })}
        >
          <Feather name="chevron-left" size={24} color="#F4F3F1" />
        </TouchableOpacity>
      </View>
      <Toast style={{ zIndex: 1000 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1F",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F4F3F1",
    marginBottom: 20,
  },
  timeContainer: {
    backgroundColor: "#2A2A3C",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    color: "#F4F3F1",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#6A5ACD",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#F4F3F1",
    fontSize: 18,
    fontWeight: "600",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#352F44",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EndTime;
