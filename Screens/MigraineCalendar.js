import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function MigraineCalendar() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [migraineData, setMigraineData] = useState({});
  const [selectedMigraine, setSelectedMigraine] = useState(null);

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const formatTime = (timeString) => {
    if (!timeString) return "Still going";
    const date = new Date(timeString);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}, ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const getMigraineAttacks = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const url = `${process.env.EXPO_PUBLIC_SERVER_URL}/migraineAttack/getMigraineAttacks/${userId}`;
      const res = await fetch(url);

      if (!res.ok) {
        console.log("Failed to fetch migraine attacks:", res.status);
      }

      const rawData = await res.json();
      const formattedData = rawData.reduce((acc, item) => {
        const oldDatekey=new Date(item.start_time);
        oldDatekey.setDate(oldDatekey.getDate()-1);
        const dateKey = oldDatekey.toISOString().split("T")[0];
        console.log(dateKey);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        const medsFormatted = item.medicines.map((item) => JSON.parse(item));
        acc[dateKey].push({
          id: item.user_id,
          startTime: formatTime(item.start_time),
          endTime: formatTime(item.end_time),
          intensity: item.intensity,
          pain_parts: item.pain_parts,
          medsTaken: medsFormatted,
          reliefMethods: item.relief_methods,
          start_time: item.start_time,
          end_time: item.end_time,
        });
        return acc;
      }, {});

      setMigraineData(formattedData);
      // console.log('Formatted Migraine Data:', formattedData);
    } catch (error) {
      console.error("Failed to fetch migraine attacks:", error.message);
    }
  };

  useEffect(() => {
    getMigraineAttacks();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

    const daysInMonth = lastDay.getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayOfWeek - 1; i > 0; i--) {
      const day = previousMonthDays - i + 1;
      days.push({ day, month: "prev" });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: "current" });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, month: "next" });
    }

    return days;
  };

  const formatDateString = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toISOString().split("T")[0];
  };

  const hasMigraine = (day) => {
    const dateString = formatDateString(day);
    return migraineData[dateString];
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const isSelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "--";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderPainBars = (intensity) => {
    return (
      <View style={styles.painBars}>
        {[...Array(10)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.painBar,
              {
                backgroundColor:
                  index < intensity
                    ? index < 3
                      ? "#4CAF50"
                      : index < 7
                      ? "#FFC107"
                      : "#FF5252"
                    : "#2A2A3C",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderMigraineItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(item);
        navigation.navigate("MigraineDetails", { migraine: item });
      }}
      style={styles.migraineItem}
    >
      <Text style={styles.migraineTime}>
        {item.startTime} - {item.endTime}
      </Text>
    </TouchableOpacity>
  );

  const renderMigraineDetails = () => {
    if (!selectedMigraine) return null;

    return (
      <ScrollView style={styles.detailsContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedMigraine(null)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <Text style={styles.detailsTitle}>Migraine Details</Text>

        <View style={styles.card}>
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Start:</Text>
              <Text style={styles.timeValue}>{selectedMigraine.startTime}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>End:</Text>
              <Text style={styles.timeValue}>{selectedMigraine.endTime}</Text>
            </View>
            <Text style={styles.duration}>Duration</Text>
            <Text style={styles.durationValue}>
              {calculateDuration(
                selectedMigraine.startTime,
                selectedMigraine.endTime
              )}
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Medication</Text>
            <View style={styles.medicationContainer}>
              {selectedMigraine.medsTaken.map((med, index) => (
                <Text key={index} style={styles.medicationText}>
                  {med.name} - {med.dosage} dose
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Pain Intensity</Text>
            <View style={styles.intensityContainer}>
              <MaterialCommunityIcons
                name="emoticon-sad"
                size={40}
                color="#FF5252"
              />
              <Text style={styles.intensityText}>
                {selectedMigraine.intensity}/10
              </Text>
              {renderPainBars(selectedMigraine.intensity)}
            </View>
          </View>
        </View>

        <View style={styles.fullWidthContainer}>
          <View style={styles.fullWidthItem}>
            <Text style={styles.sectionTitle}>Pain Location</Text>
            {selectedMigraine.pain_parts.length === 0 ? (
              <Text style={styles.centerText}>No areas selected</Text>
            ) : (
              <View style={styles.locationContainer}>
                {selectedMigraine.pain_parts.map((area, index) => (
                  <Text key={index} style={styles.locationText}>
                    {area}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.fullWidthContainer}>
          <View style={styles.fullWidthItem}>
            <Text style={styles.sectionTitle}>Relief Methods</Text>
            <View style={styles.methodsGrid}>
              {selectedMigraine.reliefMethods.map((method, index) => (
                <View key={index} style={styles.methodItem}>
                  <Text style={styles.methodText}>{method}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.calendar}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigateMonth("prev")}>
            <ChevronLeft size={24} color="#F4F3F1" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {currentMonth
              .toLocaleString("en-US", { month: "long", year: "numeric" })
              .toUpperCase()}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth("next")}>
            <ChevronRight size={24} color="#F4F3F1" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {getDaysInMonth(currentMonth).map((item, index) => {
            const isCurrentMonth = item.month === "current";
            const migraine = isCurrentMonth ? hasMigraine(item.day) : null;
            const isSelectedDay = isCurrentMonth && isSelected(item.day);

            return (
              <TouchableOpacity
                key={`${item.month}-${item.day}-${index}`}
                style={[styles.dayCell, isSelectedDay && styles.selectedDay]}
                onPress={() => {
                  if (isCurrentMonth) {
                    const newDate = new Date(currentMonth);
                    newDate.setDate(item.day);
                    setSelectedDate(newDate);
                  }
                }}
              >
                <Text
                  style={[
                    styles.dayText,
                    !isCurrentMonth && styles.otherMonthDay,
                    isSelectedDay && styles.selectedDayText,
                  ]}
                >
                  {item.day}
                </Text>
                {migraine && <View style={styles.migraineIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.migraineDataContainer}>
        <Text style={styles.selectedDateText}>
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        {hasMigraine(selectedDate.getDate()) ? (
          <FlatList
            data={migraineData[formatDateString(selectedDate.getDate())]}
            renderItem={renderMigraineItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noMigraineText}>
            No migraine recorded for this day.
          </Text>
        )}
      </View>

      {selectedMigraine && renderMigraineDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1F",
  },
  calendar: {
    padding: 16,
    backgroundColor: "#1F1F2E",
    borderRadius: 12,
    margin: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthYear: {
    color: "#F4F3F1",
    fontSize: 20,
    fontWeight: "600",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    color: "#9CA3AF",
    fontSize: 14,
    width: 40,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayText: {
    color: "#F4F3F1",
    fontSize: 16,
  },
  otherMonthDay: {
    color: "#4A4A5C",
  },
  selectedDay: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  selectedDayText: {
    color: "#F4F3F1",
    fontWeight: "600",
  },
  migraineIndicator: {
    position: "absolute",
    bottom: 4,
    width: "50%",
    height: 3,
    backgroundColor: "#6A5ACD",
    borderRadius: 1.5,
  },
  migraineDataContainer: {
    padding: 16,
    backgroundColor: "#1F1F2E",
    borderRadius: 12,
    margin: 16,
  },
  selectedDateText: {
    color: "#F4F3F1",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  migraineItem: {
    backgroundColor: "#2A2A3A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  migraineTime: {
    color: "#F4F3F1",
    fontSize: 16,
  },
  noMigraineText: {
    color: "#9CA3AF",
    fontSize: 16,
    textAlign: "center",
  },
  detailsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1C1B1F",
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    color: "#F4F3F1",
    fontSize: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F4F3F1",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  timeSection: {
    gap: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLabel: {
    color: "#9CA3AF",
    fontSize: 16,
    flex: 1,
  },
  timeValue: {
    color: "#F4F3F1",
    fontSize: 16,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  duration: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
  },
  durationValue: {
    color: "#F4F3F1",
    fontSize: 24,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
  },
  fullWidthContainer: {
    marginBottom: 16,
  },
  fullWidthItem: {
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 12,
  },
  centerText: {
    color: "#F4F3F1",
    fontSize: 14,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  locationText: {
    color: "#F4F3F1",
    fontSize: 14,
    backgroundColor: "#1C1B1F",
    borderRadius: 8,
    padding: 8,
  },
  medicationContainer: {
    gap: 8,
  },
  medicationText: {
    color: "#F4F3F1",
    fontSize: 14,
  },
  intensityContainer: {
    alignItems: "center",
    gap: 8,
  },
  intensityText: {
    color: "#F4F3F1",
    fontSize: 24,
    fontWeight: "bold",
  },
  painBars: {
    flexDirection: "row",
    gap: 4,
    width: "100%",
    marginTop: 8,
  },
  painBar: {
    width: 12,
    height: 24,
    borderRadius: 4,
  },
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  methodItem: {
    backgroundColor: "#1C1B1F",
    borderRadius: 8,
    padding: 8,
  },
  methodText: {
    color: "#F4F3F1",
    fontSize: 14,
  },
});
