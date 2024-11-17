import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/profile/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (res.status === 200) {
        setName(result.username);
        setEmail(result.email);
        setImage(result.image_url);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const handleImagePress = () => {
    setIsImageModalVisible(true);
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
            <TouchableOpacity onPress={handleImagePress}>
              <Image
                source={{ uri: image }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: "#4",
                  elevation: 3,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#4B0082" }}
            >
              {name}
            </Text>
            <Text style={{ fontSize: 14, color: "#6A5ACD" }}>{email}</Text>
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

        <Modal
          animationType="fade"
          transparent={true}
          visible={isImageModalVisible}
          onRequestClose={() => setIsImageModalVisible(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => setIsImageModalVisible(false)}
          >
            <Image
              source={{ uri: image }}
              style={{
                width: "90%",
                height: "90%",
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
