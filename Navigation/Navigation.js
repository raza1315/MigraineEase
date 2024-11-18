import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Welcome from "../Screens/Welcome";
import SignIn from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";
import Test from "../Screens/Test";
import Home from "../Screens/Home";
import DoctorAppointment from "../Screens/DoctorAppointment";
import AppointmentRecords from "../Screens/AppointmentRecords";
import MedicineReminder from "../Screens/MedicineReminder";
import MedicationRecords from "../Screens/MedicationRecords";
import Settings from "../Screens/Settings";
import ChatRoom from "../Screens/ChatRoom";

const WaveCircle = ({ delay = 0, duration = 2000 }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs">
          <Stack.Screen
            name="welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="doctorAppointment"
            component={DoctorAppointment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="appointmentRecords"
            component={AppointmentRecords}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="medsReminder"
            component={MedicineReminder}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="medsRecords"
            component={MedicationRecords}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 70,
          alignItems: "center",
          paddingTop: 10,
          position: "relative",
        },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  height: 50,
                  width: 50,
                }}
              >
                <AntDesign name="home" size={28} color={"#4B0082"} />
                {focused && <View style={styles.tabIndicator} />}
              </View>
            );
          },
        }}
        name="home"
        component={Home}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  height: 50,
                  width: 50,
                }}
              >
                <AntDesign name="areachart" size={28} color={"#4B0082"} />
                {focused && <View style={styles.tabIndicator} />}
              </View>
            );
          },
        }}
        name="test"
        component={Test}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TouchableOpacity style={[styles.navItem, styles.centerButton]}>
                <WaveCircle delay={0} />
                <WaveCircle delay={500} />
                <WaveCircle delay={1000} />
                <View style={styles.centerButtonInner}>
                  <FontAwesome5
                    name="bolt"
                    size={24}
                    color="#FFFFFF"
                    style={{ transform: [{ rotate: "25deg" }] }}
                  />
                </View>
              </TouchableOpacity>
            );
          },
        }}
        name="migraine"
        component={Test}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  height: 50,
                  width: 50,
                }}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={28}
                  color={"#4B0082"}
                />
                {focused && <View style={styles.tabIndicator} />}
              </View>
            );
          },
        }}
        name="chats"
        component={ChatRoom}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  height: 50,
                  width: 50,
                }}
              >
                <AntDesign name="setting" size={28} color={"#4B0082"} />
                {focused && <View style={styles.tabIndicator} />}
              </View>
            );
          },
        }}
        name="settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  centerButton: {
    marginTop: -30,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButtonInner: {
    width: 60,
    height: 60,
    backgroundColor: "#6A5ACD",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  waveCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#6A5ACD",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 5,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    right: 0,
    height: 2,
    width: 30,
    backgroundColor: "#4B0082",
  },
});
export default Navigation;
