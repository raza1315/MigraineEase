import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert,StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TimeSelection() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState("Still going");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [tempDate, setTempDate] = useState(new Date());
  const [selectedStartPreset, setSelectedStartPreset] = useState(null);

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    setUserId(userId);
  };
  const checkStillGoing = async () => {
    console.log("started checking");
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_URL}/migraineAttack/checkStillGoing/${userId}`
    );
    if (res.status === 200) {
      const data = await res.json();
      navigation.navigate("EndTime", { data });
    }
  };
  useEffect(() => {
    if (isFocused) {
      console.log("fo");
      getUserId();
      if (userId) {
        checkStillGoing();
        console.log("focused");
      }
    }
  }, [isFocused, userId]);
  useEffect(() => {
    if (startTime && typeof endTime !== "string" && endTime < startTime) {
      Alert.alert("Invalid Time", "End time must be after start time");
      setEndTime("Still going");
    }
  }, [startTime, endTime]);

  const formatDate = (date) => {
    if (!date) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleStartTimeSelection = (type) => {
    setSelectedStartPreset(type);
    switch (type) {
      case "just_now":
        setStartTime(new Date());
        break;
      case "1h_ago":
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        setStartTime(oneHourAgo);
        break;
      case "other":
        setTempDate(new Date());
        setPickerMode("date");
        setShowStartPicker(true);
        break;
    }
  };

  const handleEndTimeSelection = (type) => {
    switch (type) {
      case "still_going":
        setEndTime("Still going");
        break;
      case "other":
        setTempDate(
          startTime
            ? new Date(Math.max(startTime.getTime(), new Date().getTime()))
            : new Date()
        );
        setPickerMode("date");
        setShowEndPicker(true);
        break;
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowStartPicker(false);
      setShowEndPicker(false);
      return;
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      if (pickerMode === "date") {
        setPickerMode("time");
      } else {
        if (showStartPicker) {
          setStartTime(selectedDate);
          setSelectedStartPreset(null);
          setShowStartPicker(false);
        } else {
          if (startTime && selectedDate > startTime) {
            setEndTime(selectedDate);
          } else {
            Alert.alert("Invalid Time", "End time must be after start time");
          }
          setShowEndPicker(false);
        }
        setPickerMode("date");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <Text style={styles.title}>Start & End time of your attack</Text>

      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>Start time:</Text>
        <Text style={styles.selectedTime}>
          {startTime ? formatDate(startTime) : "Select time"}
        </Text>

        <Text style={styles.presetsLabel}>Time presets</Text>
        <View style={styles.presetButtons}>
          <TouchableOpacity
            style={[
              styles.presetButton,
              selectedStartPreset === "just_now" && styles.selectedPreset,
            ]}
            onPress={() => handleStartTimeSelection("just_now")}
          >
            <Text style={styles.presetButtonText}>Just now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.presetButton,
              selectedStartPreset === "1h_ago" && styles.selectedPreset,
            ]}
            onPress={() => handleStartTimeSelection("1h_ago")}
          >
            <Text style={styles.presetButtonText}>1h ago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.presetButton,
              selectedStartPreset === "other" && styles.selectedPreset,
            ]}
            onPress={() => handleStartTimeSelection("other")}
          >
            <Text style={styles.presetButtonText}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>End time:</Text>
        <Text style={styles.selectedTime}>
          {typeof endTime === "string" ? endTime : formatDate(endTime)}
        </Text>

        <Text style={styles.presetsLabel}>Time presets</Text>
        <View style={styles.presetButtons}>
          <TouchableOpacity
            style={[
              styles.presetButton,
              endTime === "Still going" && styles.selectedPreset,
            ]}
            onPress={() => handleEndTimeSelection("still_going")}
          >
            <Text style={styles.presetButtonText}>Still going</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => handleEndTimeSelection("other")}
          >
            <Text style={styles.presetButtonText}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("MainTabs", { screen: "home" })}
        >
          <Feather name="chevron-left" size={24} color="#F4F3F1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={() => {
            if (!startTime) {
              return;
            }
            console.log(startTime.toISOString(), endTime);
            navigation.navigate("PainArea", {
              startTime: startTime ? startTime.toISOString() : null, 
              endTime:
                typeof endTime !== "string" && endTime != "Still going"
                  ? endTime.toISOString()
                  : null, 
            });
          }}
        >
          <Feather name="chevron-right" size={24} color="#F4F3F1" />
        </TouchableOpacity>
      </View>

      {(showStartPicker || showEndPicker) && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempDate}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

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
    marginBottom: 40,
  },
  timeSection: {
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 8,
  },
  selectedTime: {
    color: "#F4F3F1",
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 24,
  },
  presetsLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 12,
  },
  presetButtons: {
    flexDirection: "row",
    gap: 12,
  },
  presetButton: {
    flex: 1,
    backgroundColor: "#1C1B1F",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  selectedPreset: {
    backgroundColor: "#6A5ACD",
  },
  presetButtonText: {
    color: "#F4F3F1",
    fontSize: 14,
    fontWeight: "500",
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
  nextButton: {
    backgroundColor: "#6A5ACD",
  },
});
