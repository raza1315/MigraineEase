import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const WaveCircle = ({ delay = 0, duration = 2000 }) => {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = () => {
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
        delay: delay,
      }).start(() => animate());
    };
    animate();
  }, []);

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <Animated.View
      style={[
        styles.waveCircle,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

const MedicineReminder = () => {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ); // Default to 1 week from now
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    setIsFormValid(medicineName.trim() !== "" && dosage.trim() !== "");
  }, [medicineName, dosage]);

  useEffect(() => {
    if (isFocused) {
      getUserId();
    }
  }, [isFocused]);

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    setUserId(userId);
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    if (currentDate > endDate) {
      setEndDate(currentDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || reminderTime;
    setShowTimePicker(false);
    setReminderTime(currentTime);
  };

  const scheduleNotifications = async () => {
    const currentDate = new Date();
    let notificationDate = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999); // Set end date to end of day

    while (notificationDate <= endDateTime) {
      const reminderDateTime = new Date(notificationDate);
      reminderDateTime.setHours(
        reminderTime.getHours(),
        reminderTime.getMinutes(),
        0,
        0
      );

      if (reminderDateTime > currentDate) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Medicine Reminder",
            body: `Time to take ${medicineName} - ${dosage}mg`,
          },
          trigger: reminderDateTime,
        });
      }
      notificationDate.setDate(notificationDate.getDate() + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!isFormValid) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please fill in all required fields",
        });
        return;
      }

      const daysDifference =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const body = {
        user_id: userId,
        medicine_name: medicineName.trim(),
        dosage: dosage.trim(),
        start_date: startDate,
        end_date: endDate,
        reminder_time: reminderTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        notes: notes.trim(),
        created_at: new Date(),
      };

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/medicine-reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.status === 200) {
        await scheduleNotifications();
        Toast.show({
          type: "success",
          text1: "Reminder Set",
          text2: `Your medicine reminder has been scheduled for ${daysDifference} days.`,
        });
        setMedicineName("");
        setDosage("");
        setNotes("");
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        setReminderTime(new Date());
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to set medicine reminder",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to set medicine reminder",
      });
    }
  };

  return (
    <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../assets/migrainebg.jpeg")}
          style={styles.bgImage1}
        />
        <Image
          source={require("../assets/migrainebg.jpeg")}
          style={styles.bgImage2}
        />
        <View style={styles.logoContainer}>
          <View style={styles.pillIconContainer}>
            <WaveCircle delay={0} />
            <WaveCircle delay={500} />
            <WaveCircle delay={1000} />
            <FontAwesome5
              name="pills"
              size={40}
              color="#6A5ACD"
              style={styles.pillIcon}
            />
          </View>
          <Text style={styles.title}>Medicine Reminder</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="medical"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={medicineName}
              onChangeText={setMedicineName}
              placeholder="Enter medicine name"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="local-hospital"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Enter dosage (mg)"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <MaterialIcons name="date-range" size={24} color="#6A5ACD" />
              <Text style={styles.dateTimeText}>
                Start: {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <MaterialIcons name="event" size={24} color="#6A5ACD" />
              <Text style={styles.dateTimeText}>
                End: {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <MaterialIcons name="access-time" size={24} color="#6A5ACD" />
            <Text style={styles.dateTimeText}>
              Reminder Time:{" "}
              {reminderTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
              minimumDate={new Date()}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={startDate}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
          <View style={styles.notesContainer}>
            <Ionicons
              name="create"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes (optional)"
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !isFormValid && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonText}>Set Reminder</Text>
            <FontAwesome5
              name="bell"
              size={24}
              color="#FFFFFF"
              style={styles.submitIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <FontAwesome5
            name="info-circle"
            size={20}
            color="#6A5ACD"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            You will receive daily notifications at the set time from the start
            date to the end date.
          </Text>
        </View>
      </ScrollView>
      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  pillIconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  pillIcon: {
    position: "absolute",
  },
  waveCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#6A5ACD",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: 15,
    marginBottom: 0,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4B0082",
    paddingVertical: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
    flex: 0.48,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  dateTimeText: {
    marginLeft: 7,
    color: "#4B0082",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D3D3D3",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  submitIcon: {
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    color: "#4B0082",
    fontSize: 14,
  },
  bgImage1: {
    position: "absolute",
    width: wp("100%"),
    height: hp("55%"),
    opacity: 0.11,
    top: hp("0%"),
    left: wp("10%"),
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 450,
    borderBottomRightRadius: 280,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  bgImage2: {
    position: "absolute",
    width: wp("100%"),
    height: hp("60%"),
    opacity: 0.11,
    transform: [{ translateY: "55%" }, { rotate: "2deg" }],
    bottom: hp("10%"),
    right: wp("0%"),
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 400,
    borderBottomRightRadius: 280,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
  },
  notesInput: {
    flex: 1,
    fontSize: 16,
    color: "#4B0082",
    minHeight: 100,
  },
});

export default MedicineReminder;
