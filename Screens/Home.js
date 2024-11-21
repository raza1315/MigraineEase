import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");

const Home = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
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

  return (
    <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: image }} style={styles.profilePicture} />
              <Text style={styles.username}>{name}</Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.removeItem("userId");
                navigation.navigate("signIn");
              }}
              style={styles.logoutButton}
            >
              <FontAwesome5 name="sign-out-alt" size={24} color="#4B0082" />
            </TouchableOpacity>
          </View>

          {/* Greeting Section with Headache Image */}
          <View style={styles.greetingSection}>
            <View style={styles.greetingContent}>
              <Text style={styles.attackFreeText}>
                You have been attack free for
              </Text>
              <Text style={styles.attackFreeTime}>8</Text>
            </View>
          </View>
          <Image
            source={require("../assets/headache.png")}
            style={styles.headacheImage}
          />

          {/* Treatment Manager */}
          <View style={styles.treatmentContainer}>
            <Text style={styles.sectionTitle}>Treatment Manager</Text>
            <TouchableOpacity
              style={styles.treatmentCard}
              onPress={() => navigation.navigate("medsReminder")}
            >
              <Image
                source={require("../assets/medsreminder.png")}
                style={styles.medsTimer}
              />
              <View>
                <Text style={styles.treatmentLabel}>MEDICINE REMINDERS</Text>
                <Text style={styles.medicineText}>
                  Stay on track with your treatment
                </Text>
                <Text style={styles.timeText}>
                  Set up personalized reminders
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#6A5ACD" />
            </TouchableOpacity>
          </View>

          {/* Doctor Appointment */}
          <TouchableOpacity
            style={styles.appointmentCard}
            onPress={() => navigation.navigate("doctorAppointment")}
          >
            <View>
              <Text style={styles.sectionTitle}>Doctor Appointment</Text>
              <Text style={styles.appointmentText}>
                Schedule your next check-up
              </Text>
              <Text style={styles.appointmentInfo}>
                Last visit: 2 months ago
              </Text>
              <Text style={styles.appointmentInfo}>
                Recommended: Schedule within 2 weeks
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6A5ACD" />
            <Image
              source={require("../assets/drappointmnet.jpeg")}
              style={styles.drappointmentImage}
            />
          </TouchableOpacity>

          {/* Join Community Section */}
          <View style={styles.communityContainer}>
            <Text style={styles.sectionTitle}>Join Our Community</Text>
            <View style={styles.communityContent}>
              <Image
                source={require("../assets/community.jpeg")}
                style={styles.communityImage}
              />
              <Text style={styles.communityText}>
                Connect with others, share experiences, and find support in our
                MigraineEase community.
              </Text>
              <View style={styles.communityLogos}>
                <Image
                  source={{ uri: "https://picsum.photos/60" }}
                  style={styles.communityLogo}
                />
                <Image
                  source={{ uri: "https://picsum.photos/61" }}
                  style={styles.communityLogo}
                />
                <Image
                  source={{ uri: "https://picsum.photos/62" }}
                  style={styles.communityLogo}
                />
              </View>
              <TouchableOpacity
                style={styles.joinButton}
              >
                <Text style={styles.joinButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "white",
    elevation: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
  },
  logoutButton: {
    padding: 10,
  },
  greetingSection: {
    padding: 20,
  },
  greetingContent: {
    flex: 1,
  },
  attackFreeText: {
    fontSize: 16,
    color: "#6A5ACD",
  },
  attackFreeTime: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: 10,
  },
  bgscene: {
    width: width,
    height: 200,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.2,
    borderBottomEndRadius: 20,
  },
  headacheImage: {
    // width: width,
    height: 190,
    width: 140,
    resizeMode: "cover",
    position: "absolute",
    top: 15,
    right: 30,
    zIndex: -1,
    opacity: 0.6,
  },
  medsTimer: {
    width: width,
    height: "120%",
    width: 100,
    resizeMode: "cover",
    position: "absolute",
    top: 12,
    right: 15,
    zIndex: -1,
    opacity: 0.2,
  },
  drappointmentImage: {
    width: width,
    height: "82%",
    width: 90,
    resizeMode: "cover",
    position: "absolute",
    top: 20,
    right: 18,
    zIndex: -1,
    opacity: 0.2,
  },
  communityImage: {
    // width: width,
    height: "123%",
    width: "112%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.13,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 10,
  },
  treatmentContainer: {
    padding: 20,
  },
  treatmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  treatmentLabel: {
    color: "#6A5ACD",
    marginBottom: 5,
  },
  medicineText: {
    color: "#4B0082",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  timeText: {
    color: "#6A5ACD",
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  appointmentText: {
    color: "#6A5ACD",
    marginTop: 5,
  },
  appointmentInfo: {
    color: "#4B0082",
    marginTop: 5,
  },
  communityContainer: {
    padding: 20,
  },
  communityContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
    overflow: "hidden",
  },
  communityText: {
    fontSize: 16,
    color: "#4B0082",
    textAlign: "center",
    marginBottom: 20,
  },
  communityLogos: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  communityLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: -10,
    borderWidth: 2.2,
    borderColor: "white",
    elevation: 3,
  },
  joinButton: {
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
