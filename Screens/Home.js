import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

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

const WavySVG = () => (
  <Svg
    height="100"
    width="100%"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <Path
      fill="#E6E6FA"
      fillOpacity="0.5"
      d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,224C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </Svg>
);

const dummyData = {
  username: "Sarah",
  attackFreeTime: "8 hours",
  nextDose: {
    medicine: "Sumatriptan",
    time: "Tomorrow, 12:30",
  },
  pressureForecast: [
    { day: "Sat", status: "unknown" },
    { day: "Sun", status: "unknown" },
    { day: "Mon", status: "good" },
    { day: "Tue", status: "good" },
    { day: "Wed", status: "good" },
    { day: "Thu", status: "good" },
    { day: "Fri", status: "good" },
  ],
};

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <FontAwesome5 name="bars" size={24} color="#4B0082" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome5 name="bell" size={24} color="#4B0082" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
          </View>

          {/* Greeting Section with Headache Image */}
          <View style={styles.greetingSection}>
            <View style={styles.greetingContent}>
              <Text style={styles.greeting}>Hello, {dummyData.username}!</Text>
              <Text style={styles.attackFreeText}>
                You have been migraine-free for
              </Text>
              <Text style={styles.attackFreeTime}>
                {dummyData.attackFreeTime}
              </Text>
            </View>
            <Image
              source={{ uri: "/placeholder.svg?height=150&width=150" }}
              style={styles.headacheImage}
            />
          </View>

          {/* Wavy SVG */}
          <WavySVG />

          {/* Personalization Cards */}
          <Text style={styles.sectionTitle}>To know you better</Text>
          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  Let's tailor MigraineEase to YOUR needs!
                </Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  What is your headache frequency?
                </Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Pressure Forecast */}
          <View style={styles.forecastContainer}>
            <Text style={styles.sectionTitle}>Pressure Variation Forecast</Text>
            <View style={styles.forecastCard}>
              <View style={styles.forecastDays}>
                {dummyData.pressureForecast.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayText}>{day.day}</Text>
                    <View style={styles.dayIndicator}>
                      {day.status === "unknown" ? (
                        <Text style={styles.questionMark}>?</Text>
                      ) : (
                        <FontAwesome5 name="crown" size={16} color="#6A5ACD" />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Treatment Manager */}
          <View style={styles.treatmentContainer}>
            <Text style={styles.sectionTitle}>Treatment Manager</Text>
            <View style={styles.treatmentCard}>
              <View>
                <Text style={styles.treatmentLabel}>NEXT DOSE</Text>
                <Text style={styles.medicineText}>
                  {dummyData.nextDose.medicine}
                </Text>
                <Text style={styles.timeText}>{dummyData.nextDose.time}</Text>
              </View>
              <FontAwesome5 name="bell" size={24} color="#6A5ACD" />
            </View>
          </View>

          {/* Doctor Appointment */}
          <TouchableOpacity style={styles.appointmentCard}>
            <View>
              <Text style={styles.sectionTitle}>Doctor Appointment</Text>
              <Text style={styles.appointmentText}>
                Schedule your next check-up
              </Text>
            </View>
            <FontAwesome5 name="calendar-plus" size={24} color="#6A5ACD" />
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
                  source={{ uri: "/placeholder.svg?height=60&width=60" }}
                  style={styles.communityLogo}
                />
                <Image
                  source={{ uri: "/placeholder.svg?height=60&width=60" }}
                  style={styles.communityLogo}
                />
                <Image
                  source={{ uri: "/placeholder.svg?height=60&width=60" }}
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
    paddingTop: -5,
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
    paddingVertical: 5,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  greetingContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 10,
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
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    padding: 20,
    paddingBottom: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    height: 150,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    color: "#4B0082",
    lineHeight: 24,
  },
  newBadge: {
    backgroundColor: "#6A5ACD",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  forecastContainer: {
    padding: 20,
  },
  forecastCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forecastDays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayContainer: {
    alignItems: "center",
  },
  dayText: {
    color: "#4B0082",
    marginBottom: 8,
  },
  dayIndicator: {
    width: 32,
    height: 32,
    backgroundColor: "#E6E6FA",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  questionMark: {
    color: "#6A5ACD",
    fontSize: 18,
    fontWeight: "bold",
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
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  communityLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navItem: {
    padding: 10,
  },
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
});

export default Home;
