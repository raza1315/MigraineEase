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
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import { CalendarCheck2 } from "lucide-react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";

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

const DoctorAppointment = () => {
  const [doctorName, setDoctorName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    setIsFormValid(doctorName.trim() !== "" && location.trim() !== "");
  }, [doctorName, location]);
  useEffect(() => {
    if (isFocused) {
      getUserId();
    }
  }, [isFocused]);

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    setUserId(userId);
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentDate = selectedTime || date;
    setShowTimePicker(false);
    const now = new Date();
    if (currentDate > now) {
      setDate(currentDate);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Time",
        text2: "Please select a time later than now.",
      });
    }
  };

  const scheduleNotification = async () => {
    const trigger = date;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Doctor Appointment Reminder",
        body: `Your appointment with ${doctorName} is at ${location}.`,
      },
      trigger,
    });
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
      if (new Date(date) <= new Date()) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please select a time later than now.",
        });
        return;
      }

      const body = {
        user_id: userId,
        doctor_name: doctorName.trim(),
        location: location.trim(),
        appointment_date: date,
        reason: notes.trim(),
        created_at: new Date(),
        reminder_sent: true,
      };
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (res.status === 200) {
        await scheduleNotification();
        Toast.show({
          type: "success",
          text1: "Appointment Scheduled",
          text2:
            "Your appointment has been scheduled and a notification has been set.",
        });
        setDate(new Date());
        setDoctorName("");
        setLocation("");
        setNotes("");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to schedule appointment",
        });
        setDate(new Date());
        setDoctorName("");
        setLocation("");
        setNotes("");
      }
    } catch (error) {
      console.log(error);
      console.log(date.toLocaleString());
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to schedule appointment",
      });
    }
  };

  return (
    <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4B0082" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.remindersButton}
          onPress={() => navigation.navigate("appointmentRecords")}
        >
          {/* <FontAwesome name="pencil-square-o" size={24} color="#6A5ACD" /> */}
          <CalendarCheck2 size={24} color="#6A5ACD" />

          <Text style={{ color: "#6A5ACD", fontWeight: "600" }}>Scheduled</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/migrainebg.jpeg")}
          style={styles.bgimage1}
        />
        <Image
          source={require("../assets/migrainebg.jpeg")}
          style={styles.bgimage2}
        />
        <View style={styles.logoContainer}>
          <View style={styles.brainIconContainer}>
            <WaveCircle delay={0} />
            <WaveCircle delay={500} />
            <WaveCircle delay={1000} />
            <FontAwesome5
              name="brain"
              size={40}
              color="#6A5ACD"
              style={styles.brainIcon}
            />
          </View>
          <Text style={styles.title}>Doctor Appointment</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={doctorName}
              onChangeText={setDoctorName}
              placeholder="Enter doctor's name"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="location"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter appointment location"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="date-range" size={24} color="#6A5ACD" />
              <Text style={styles.dateTimeText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <MaterialIcons name="access-time" size={24} color="#6A5ACD" />
              <Text style={styles.dateTimeText}>
                {date.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
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
            <Text style={styles.submitButtonText}>Book Appointment</Text>
            <FontAwesome5
              name="check-circle"
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
            You will receive a notification reminder for your appointment.
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
  brainIconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  brainIcon: {
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
  dateTimeText: {
    marginLeft: 10,
    color: "#4B0082",
    fontSize: 14,
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
  bgimage1: {
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
  bgimage2: {
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  remindersButton: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    bottom: 30,
    right: 25,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});

export default DoctorAppointment;
