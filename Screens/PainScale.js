import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function PainScale({ route }) {
  const { selectedAreas,startTime, endTime  } = route.params;
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const navigation = useNavigation();
  const painLevels = [
    {
      level1: 10,
      color1: "#B0313F",
      level2: 9,
      color2: "#E84855",
      label: "HURTS WORST",
      label2: "Excrutiating unable to do any activities",
      image_relativePath: require("../assets/worstremoved.png"),
    },

    {
      level1: 8,
      level2: 7,
      color1: "#AD5434",
      color2: "#D96941",
      label: "Hurts a lot",
      label2: "Unable to do most activities",
      image_relativePath: require("../assets/severe.png"),
    },
    {
      level1: 6,
      level2: 5,
      color1: "#C18434",
      color2: "#F2A541",
      label: "MODERATE",
      label2: "Unable to do some activities",
      image_relativePath: require("../assets/moderate.png"),
    },
    {
      level1: 4,
      level2: 3,
      color1: "#3F5F24",
      color2: "#4F772D",
      label: "MILD",
      label2: "Can do activities",
      image_relativePath: require("../assets/mild.png"),
    },
    {
      level1: 2,
      level2: 1,
      color1: "#738744",
      color2: "#90A955",
      label: "HURTS A BIT",
      label2: "Pain is present but does not limit activities",
      image_relativePath: require("../assets/bit.png"),
    },
  ];

  const handleNext = () => {
    console.log("Selected pain intensity:", selectedIntensity);
    if (selectedIntensity === null) {
      return;
    }
    navigation.navigate("MedsTaken", {
      startTime,
      endTime,
      intensity: selectedIntensity,
      selectedAreas,
    });
  };
  useEffect(() => {
    console.log("Selected pain areas:", selectedAreas);
  }, [selectedIntensity]);

  return (
    <LinearGradient colors={["#1A1B1E", "#1A1B1E"]} style={{ flex: 1 }}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", paddingHorizontal: 0 }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            marginVertical: 25,
            color: "rgba(255,255,255,0.8)",
            paddingHorizontal: 5,
          }}
        >
          What is the highest pain intensity you feel?
        </Text>
        {painLevels.map((level, index) => (
          <View
            key={index}
            style={{
              height: 115,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: "100%",
                width: "35%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: level.color1,
                  width: "100%",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setSelectedIntensity(level.level1)}
              >
                <Text style={{ fontSize: 30, color: "white" }}>
                  {level.level1}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: level.color2,
                  width: "100%",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setSelectedIntensity(level.level2)}
              >
                <Text style={{ fontSize: 30, color: "white" }}>
                  {level.level2}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: "100%",
                width: "65%",
                backgroundColor:
                  selectedIntensity === level.level2
                    ? level.color2
                    : selectedIntensity === level.level1
                    ? level.color1
                    : "transparent",
                position: "relative",
                flexDirection: "row",
                justifyContent: "spcase-between",
                alignItems: "center",
              }}
            >
              <Image
                source={level.image_relativePath}
                style={{ width: 100, height: "100%" }}
              />
              {selectedIntensity === level.level2 && (
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    marginLeft: "auto",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "white",
                      marginHorizontal: "auto",
                    }}
                  >
                    {level.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "white",
                      marginHorizontal: "auto",
                      textAlign: "center",
                    }}
                  >
                    {level.label2}
                  </Text>
                </View>
              )}
              {selectedIntensity === level.level1 && (
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    marginLeft: "auto",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "white",
                      marginHorizontal: "auto",
                    }}
                  >
                    {level.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "white",
                      marginHorizontal: "auto",
                      textAlign: "center",
                    }}
                  >
                    {level.label2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
        <View
          style={{
            width: "90%",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 50,
            }}
          >
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="chevron-left" size={24} color="#F4F3F1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleNext}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <Feather name="chevron-right" size={24} color="#F4F3F1" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
