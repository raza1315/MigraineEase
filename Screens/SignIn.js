import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Tooltip from "react-native-walkthrough-tooltip";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignIn = () => {
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Sign in successful!");
      // navigation.navigate('Home');
    }, 2000);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Google sign in successful!");
      navigation.navigate("welcome");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E6E6FA", "#F0F8FF"]} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <Image
            source={require("../assets/migrainebg.jpeg")}
            style={styles.bgimage1}
          />
          <View style={styles.logoContainer}>
            <View style={styles.animationContainer}>
              <LottieView
                source={require("../assets/migrainelottie.json")}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>
            <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
              MigraineEase
            </Animated.Text>
          </View>
          <Animated.Text style={[styles.slogan, { opacity: fadeAnim }]}>
            Your path to relief begins here
          </Animated.Text>
          <Tooltip
            isVisible={showEmailTooltip}
            content={<Text>Enter your registered email address</Text>}
            placement="top"
            onClose={() => setShowEmailTooltip(false)}
          >
            <View style={styles.inputContainer}>
              <FontAwesome5
                name="envelope"
                size={20}
                color="#6A5ACD"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A9A9A9"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                // onFocus={() => setShowEmailTooltip(true)}
              />
            </View>
          </Tooltip>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Tooltip
            isVisible={showPasswordTooltip}
            content={<Text>Password must be at least 8 characters long</Text>}
            placement="top"
            onClose={() => setShowPasswordTooltip(false)}
          >
            <View style={styles.inputContainer}>
              <FontAwesome5
                name="lock"
                size={20}
                color="#6A5ACD"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A9A9A9"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                secureTextEntry
                // onFocus={() => setShowPasswordTooltip(true)}
              />
            </View>
          </Tooltip>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FontAwesome5
              name="google"
              size={20}
              color="#FFFFFF"
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate("signUp")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    justifyContent: "flex-start",
    padding: 25,
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: -30,
  },
  animationContainer: {
    width: wp("80%"),
    height: hp("25%"),
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  slogan: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
    textShadowColor: "rgba(255,255,255, 0.9)",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#4B0082",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#6A5ACD",
    fontSize: 14,
    fontWeight: "500",
    textShadowColor: "rgba(255,255,255, 0.5)",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
  },
  signInButton: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    // marginTop: 5,
    width: "100%",
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#A9A9A9",
  },
  orText: {
    color: "#A9A9A9",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DB4437",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    marginBottom: 20,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#4B0082",
    fontSize: 16,
  },
  signUpLink: {
    color: "#6A5ACD",
    fontSize: 16,
    fontWeight: "bold",
  },
  bgimage1: {
    position: "absolute",
    width: wp("100%"),
    height: hp("55%"),
    opacity: 0.11,
    top: hp("15%"),
    left: wp("13%"),
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 450,
    borderBottomRightRadius: 280,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
});
