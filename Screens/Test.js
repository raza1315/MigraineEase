import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

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

const MedicineReminderScreen = () => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    setIsFormValid(
      medicineName.trim() !== '' &&
      dosage.trim() !== '' &&
      frequency.trim() !== '' &&
      !isNaN(Number(frequency)) &&
      Number(frequency) > 0
    );
  }, [medicineName, dosage, frequency]);

  useEffect(() => {
    if (isFocused) {
      getUserId();
    }
  }, [isFocused]);

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setUserId(userId);
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    if (endDate < currentDate) {
      setEndDate(currentDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    if (currentDate >= startDate) {
      setEndDate(currentDate);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid End Date',
        text2: 'End date must be equal to or after the start date.',
      });
    }
  };

  const scheduleNotification = async () => {
    const frequencyHours = Number(frequency);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    let currentDate = new Date(startDate);
    while (currentDate <= endDateTime) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Medicine Reminder",
          body: `Time to take your ${medicineName}. Dosage: ${dosage}`,
        },
        trigger: currentDate,
      });
      currentDate = new Date(currentDate.getTime() + frequencyHours * 60 * 60 * 1000);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!isFormValid) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill in all required fields correctly',
        });
        return;
      }

      const body = {
        user_id: userId,
        medicine_name: medicineName.trim(),
        dosage: dosage.trim(),
        frequency: `${frequency} hours`,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        created_at: new Date().toISOString(),
      };

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/medicine`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (res.status === 200) {
        await scheduleNotification();
        Toast.show({
          type: 'success',
          text1: 'Medicine Reminder Set',
          text2: 'Your medicine reminders have been scheduled.',
        });
        // Reset form
        setMedicineName('');
        setDosage('');
        setFrequency('');
        setStartDate(new Date());
        setEndDate(new Date());
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to set medicine reminder',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to set medicine reminder',
      });
    }
  };

  return (
    <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/migrainebg.jpeg')}
          style={styles.bgimage1}
        />
        <Image
          source={require('../assets/migrainebg.jpeg')}
          style={styles.bgimage2}
        />
        <View style={styles.logoContainer}>
          <View style={styles.brainIconContainer}>
            <WaveCircle delay={0} />
            <WaveCircle delay={500} />
            <WaveCircle delay={1000} />
            <FontAwesome5
              name="pills"
              size={40}
              color="#6A5ACD"
              style={styles.brainIcon}
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
              name="donut-large"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Enter dosage"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="schedule"
              size={24}
              color="#6A5ACD"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={frequency}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setFrequency(numericValue);
              }}
              placeholder="Enter frequency (in hours)"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
            />
            <Text style={styles.frequencyUnit}>hours</Text>
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
            You will receive notifications based on your medicine schedule.
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
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brainIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainIcon: {
    position: 'absolute',
  },
  waveCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#6A5ACD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop: 15,
    marginBottom: 0,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4B0082',
    paddingVertical: 10,
  },
  frequencyUnit: {
    fontSize: 16,
    color: '#4B0082',
    marginLeft: 5,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    flex: 0.48,
  },
  dateTimeText: {
    marginLeft: 10,
    color: '#4B0082',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  submitIcon: {
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    color: '#4B0082',
    fontSize: 14,
  },
  bgimage1: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('55%'),
    opacity: 0.11,
    top: hp('0%'),
    left: wp('10%'),
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 450,
    borderBottomRightRadius: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  bgimage2: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('60%'),
    opacity: 0.11,
    transform: [{ translateY: '55%' }, { rotate: '2deg' }],
    bottom: hp('10%'),
    right: wp('0%'),
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 400,
    borderBottomRightRadius: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
});

export default MedicineReminderScreen;