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
  Image,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import GoogleButton from "../Components/GoogleButton";
import axios from "axios";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

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

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const validateUsername = (username) => {
    return username.length >= 3;
  };
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      setEmailError("");
      setPasswordError("");
      setUsernameError("");

      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedUsername = username.trim();

      if (!trimmedEmail || !trimmedPassword || !trimmedUsername || !image) {
        setIsLoading(false);
        Alert.alert("Missing Fields", "Please fill in all fields.");
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        setEmailError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }
      if (!validatePassword(trimmedPassword)) {
        setPasswordError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      if (!validateUsername(trimmedUsername)) {
        setUsernameError("Username must be at least 3 characters long");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("username", trimmedUsername);
      formData.append("email", trimmedEmail);
      formData.append("password", trimmedPassword);

      if (image) {
        formData.append("image", {
          uri: image,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      }
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        Alert.alert("Success", response.data.message);
        setEmail("");
        setUsername("");
        setPassword("");
        setImage(null);
      } else if (response.status === 200) {
        setEmail("");
        setUsername("");
        setPassword("");
        setImage(null);
        Alert.alert("Email already signed up", response.data.error);
      } else {
        Alert.alert("Error", response.data.error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Network Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E6E6FA", "#F0F8FF"]} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Join <Text style={{ fontWeight: "bold" }}>MigraineEase</Text>{" "}
                  today
                </Text>
              </View>

              <View style={styles.formContainer}>
                <TouchableOpacity
                  style={styles.imageUpload}
                  onPress={pickImage}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <FontAwesome5
                        name="user-plus"
                        size={30}
                        color="#6A5ACD"
                      />
                      <Text style={styles.uploadText}>Upload Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
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
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}

                <View style={styles.inputContainer}>
                  <FontAwesome5
                    name="user"
                    size={20}
                    color="#6A5ACD"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#A9A9A9"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setUsernameError("");
                    }}
                    autoCapitalize="none"
                  />
                </View>
                {usernameError ? (
                  <Text style={styles.errorText}>{usernameError}</Text>
                ) : null}

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
                    secureTextEntry={!isPasswordVisible}
                  />
                  <FontAwesome5
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    name={isPasswordVisible ? "eye" : "eye-slash"}
                    style={{
                      position: "absolute",
                      right: 10,
                      // top:"50%",
                      bottom: "50%",
                      transform: [{ translateY: "50%" }],
                    }}
                    size={20}
                    color="#A9A9A9"
                  />
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  <Text style={styles.signUpButtonText}>
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>
                <GoogleButton />
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("signIn")}
                  >
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6A5ACD",
    // opacity: 0.85,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#6A5ACD",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
    position: "relative",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#4B0082",
    fontSize: 16,
  },
  imageUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 5,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "rgba(0,0,0,0.6)",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    color: "#6A5ACD",
    marginTop: 5,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#4B0082",
    fontSize: 16,
  },
  loginLink: {
    color: "#6A5ACD",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
    width: "100%",
  },
});
