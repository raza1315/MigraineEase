import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const AppointmentListScreen = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId ? parseInt(storedUserId) : null);
      } catch (err) {
        console.error("Error getting userId:", err);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (isFocused && userId) {
      fetchAppointments();
    }
  }, [isFocused, userId]);

  useEffect(() => {
    filterAndSortAppointments();
  }, [appointments, activeTab, searchQuery, sortOrder]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/getAppointmentsRecords/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAppointments = () => {
    const now = new Date();
    let filtered = appointments.filter((app) => {
      const appDate = new Date(app.appointment_date);
      const istAppDate = new Date(appDate.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
      return activeTab === "upcoming" ? istAppDate > now : istAppDate <= now;
    });

    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.appointment_date);
      const dateB = new Date(b.appointment_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredAppointments(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
    return istDate.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
    return istDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const renderAppointment = ({ item }) => (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={() => {
        setSelectedAppointment(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.doctorName}>{item.doctor_name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#6A5ACD" />
          <Text style={styles.detailText}>
            {formatDate(item.appointment_date)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#6A5ACD" />
          <Text style={styles.detailText}>
            {formatTime(item.appointment_date)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#6A5ACD" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{selectedAppointment?.doctor_name}</Text>
            <View style={styles.modalDetailRow}>
              <Ionicons name="calendar" size={20} color="#6A5ACD" />
              <Text style={styles.modalDetailText}>
                {formatDate(selectedAppointment?.appointment_date)}
              </Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Ionicons name="time" size={20} color="#6A5ACD" />
              <Text style={styles.modalDetailText}>
                {formatTime(selectedAppointment?.appointment_date)}
              </Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Ionicons name="location" size={20} color="#6A5ACD" />
              <Text style={styles.modalDetailText}>{selectedAppointment?.location}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Ionicons name="document-text" size={20} color="#6A5ACD" />
              <Text style={styles.modalDetailText}>{selectedAppointment?.reason}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchAppointments}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6A5ACD" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by doctor name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeTab === "upcoming" && styles.activeFilterButton]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.filterButtonText, activeTab === "upcoming" && styles.activeFilterButtonText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeTab === "past" && styles.activeFilterButton]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.filterButtonText, activeTab === "past" && styles.activeFilterButtonText]}>
            Past
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <Ionicons 
            name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} 
            size={20} 
            color="#6A5ACD" 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item, index) =>
          `${item.user_id}-${item.created_at}-${index}`
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab} appointments found
            </Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchAppointments}
      />
      {renderModal()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: hp("6%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginHorizontal: wp("5%"),
    marginBottom: hp("2%"),
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2%"),
  },
  filterButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#E6E6FA",
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: "#6A5ACD",
  },
  filterButtonText: {
    fontSize: 16,
    color: "#4B0082",
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: "#FFFFFF",
  },
  sortButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#E6E6FA",
  },
  listContainer: {
    padding: wp("5%"),
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
  },
  appointmentDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("10%"),
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: wp("90%"),
    maxHeight: hp("80%"),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalDetailText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default AppointmentListScreen;