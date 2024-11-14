import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";

const GoogleButton = () => {
  const handleGoogleSignIn = () => {
    console.log("Google button clicked");
  };
  return (
    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
      <FontAwesome5
        name="google"
        size={20}
        color="#FFFFFF"
        style={styles.googleIcon}
      />
      <Text style={styles.googleButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});
export default GoogleButton;
