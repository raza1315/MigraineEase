import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const navigation = useNavigation();
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    image: "https://picsum.photos/200",
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
            }}
          >
            <Image
              source={{ uri: user.image }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                marginBottom: 16,
              }}
            />
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#4B0082" }}
            >
              {user.name}
            </Text>
            <Text style={{ fontSize: 14, color: "#6A5ACD" }}>{user.email}</Text>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                paddingHorizontal: 24,
                marginBottom: 8,
                fontSize: 14,
                fontWeight: "600",
                color: "#6A5ACD",
                textTransform: "uppercase",
              }}
            >
              Account Settings
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
              }}
            >
              <Text style={{ color: "#4B0082" }}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
              }}
            >
              <Text style={{ color: "#4B0082" }}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                paddingHorizontal: 24,
                marginBottom: 8,
                fontSize: 14,
                fontWeight: "600",
                color: "#6A5ACD",
                textTransform: "uppercase",
              }}
            >
              Support
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
              }}
            >
              <Text style={{ color: "#4B0082" }}>Help Center</Text>
              <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
              }}
            >
              <Text style={{ color: "#4B0082" }}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#4B0082" }}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 32,
              marginBottom: 32,
              marginHorizontal: 24,
              backgroundColor: "#6A5ACD",
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={async () => {
                console.log("Logout button clicked");
              await AsyncStorage.removeItem("userId");
              navigation.navigate("signIn");
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
