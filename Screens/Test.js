import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Vibration,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function Test() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E6E6FA", "#F0F8FF"]} style={styles.gradient}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="brain" size={64} color="#6A5ACD" />
            <Text style={styles.appName}>MigraineEase</Text>
          </View>

          <View style={styles.animationContainer}>
            <LottieView
              source={require("../assets/welcomelottie.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          <Text style={styles.welcomeText}>
            Your journey to migraine relief and resilience begins here
          </Text>
          <View style={styles.featuresContainer}>
            <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
              <FontAwesome5
                name="calendar-check"
                size={24}
                color="#6A5ACD"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Track migraine attacks</Text>
            </Animated.View>

            <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
              <FontAwesome5
                name="pills"
                size={24}
                color="#6A5ACD"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Medication reminders</Text>
            </Animated.View>

            <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
              <FontAwesome5
                name="chart-line"
                size={24}
                color="#6A5ACD"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>
                Analyze triggers & patterns
              </Text>
            </Animated.View>

            <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
              <Ionicons
                name="people-sharp"
                size={24}
                color="#6A5ACD"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Migraine Support Community</Text>
            </Animated.View>

            <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
              <FontAwesome5
                name="head-side-virus"
                size={24}
                color="#6A5ACD"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Pain relief techniques</Text>
            </Animated.View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Vibration.vibrate(50);
              navigation.navigate("welcome");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => console.log("Learn More")}
          >
            <Text style={styles.linkButtonText}>
              Learn how MigraineEase works
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 0,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: 10,
  },
  animationContainer: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: 0,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    color: "#4B0082",
    marginBottom: 30,
    lineHeight: 24,
    width: "95%",
  },
  button: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
    marginBottom: -30,
  },
  linkButtonText: {
    color: "#6A5ACD",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  featuresContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "start",
    marginBottom: 20,
    width: "65%",
  },
  featureIcon: {
    width: 32,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: "#4B0082",
    width: "fit-content",
  },
});