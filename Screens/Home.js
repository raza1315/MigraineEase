import React from "react";
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

const { width } = Dimensions.get('window');

const dummyData = {
  username: "Sarah",
  attackFreeTime: "8 hours",
};

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.profilePicture}
              />
              <Text style={styles.username}>{dummyData.username}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.logoutButton}>
              <FontAwesome5 name="sign-out-alt" size={24} color="#4B0082" />
            </TouchableOpacity>
          </View>

          {/* Greeting Section with Headache Image */}
          <View style={styles.greetingSection}>
            <View style={styles.greetingContent}>
              <Text style={styles.attackFreeText}>
                You have been attack free for
              </Text>
              <Text style={styles.attackFreeTime}>
                {dummyData.attackFreeTime}
              </Text>
            </View>
          </View>
          <Image
            source={{ uri: "https://picsum.photos/800/400" }}
            style={styles.headacheImage}
          />

          {/* Treatment Manager */}
          <View style={styles.treatmentContainer}>
            <Text style={styles.sectionTitle}>Treatment Manager</Text>
            <View style={styles.treatmentCard}>
              <View>
                <Text style={styles.treatmentLabel}>MEDICINE REMINDERS</Text>
                <Text style={styles.medicineText}>
                  Stay on track with your treatment
                </Text>
                <Text style={styles.timeText}>Set up personalized reminders</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#6A5ACD" />
            </View>
          </View>

          {/* Doctor Appointment */}
          <TouchableOpacity style={styles.appointmentCard}>
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
          </TouchableOpacity>

          {/* Join Community Section */}
          <View style={styles.communityContainer}>
            <Text style={styles.sectionTitle}>Join Our Community</Text>
            <View style={styles.communityContent}>
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
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
  headacheImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
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
    marginHorizontal: 5,
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