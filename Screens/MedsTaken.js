import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedsTaken({ route }) {
  const navigation = useNavigation();
  const { intensity, selectedAreas, startTime, endTime } = route.params;
  const [selectedMeds, setSelectedMeds] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDosageModal, setShowDosageModal] = useState(false);
  const [newMed, setNewMed] = useState("");
  const [currentMed, setCurrentMed] = useState(null);
  const [medications, setMedications] = useState([
    { id: 1, name: "Ibuprofen" },
    { id: 2, name: "Acetaminophen" },
    { id: 3, name: "Sumatriptan" },
    { id: 4, name: "Rizatriptan" },
    { id: 5, name: "Naproxen" },
    { id: 6, name: "Zolmitriptan" },
  ]);

  const handleSelectMed = (med) => {
    if (selectedMeds[med.id]) {
      // If already selected, open dosage modal to modify or remove
      setCurrentMed(med);
      setShowDosageModal(true);
    } else {
      // If not selected, add to selection with default dosage
      setSelectedMeds((prev) => ({
        ...prev,
        [med.id]: { ...med, dosage: 0.5 },
      }));
      setCurrentMed(med);
      setShowDosageModal(true);
    }
  };

  const handleAddMedication = () => {
    if (newMed.trim()) {
      const newMedication = { id: medications.length + 1, name: newMed.trim() };
      setMedications([...medications, newMedication]);
      setNewMed("");
      setShowModal(false);
      handleSelectMed(newMedication);
    }
  };

  const handleDosageChange = (change) => {
    const newDosage = Math.max(
      0,
      (selectedMeds[currentMed.id]?.dosage || 0) + change
    );
    if (newDosage === 0) {
      // Remove medication if dosage becomes 0
      const { [currentMed.id]: _, ...rest } = selectedMeds;
      setSelectedMeds(rest);
      setShowDosageModal(false);
    } else {
      setSelectedMeds((prev) => ({
        ...prev,
        [currentMed.id]: {
          ...currentMed,
          dosage: newDosage,
        },
      }));
    }
  };

  const handleNextPress = () => {
    console.log("Selected medications and dosages:");
    const medsTaken = [];
    Object.values(selectedMeds).forEach((med) => {
      medsTaken.push({ name: med.name, dosage: med.dosage });
    });
    console.log(medsTaken);
    navigation.navigate("ReliefMethods", {
      intensity,
      selectedAreas,
      medsTaken,
      startTime,
      endTime,
    });
  };
  useEffect(() => {
    console.log("intensity: ", intensity, "areas of pain: ", selectedAreas);
  });
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>What medications have you taken?</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {medications.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={[
              styles.button,
              selectedMeds[med.id] && styles.selectedButton,
            ]}
            onPress={() => handleSelectMed(med)}
          >
            <View
              style={[
                styles.iconContainer,
                selectedMeds[med.id] && styles.selectedIconContainer,
              ]}
            >
              <Ionicons
                name={selectedMeds[med.id] ? "checkmark" : "medical"}
                size={24}
                color="#F4F3F1"
              />
            </View>
            <Text style={styles.buttonText}>{med.name}</Text>
            {selectedMeds[med.id] && (
              <Text style={styles.dosageText}>
                {selectedMeds[med.id].dosage} mg
              </Text>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="add" size={24} color="#F4F3F1" />
          </View>
          <Text style={styles.buttonText}>Add new{"\n"}medication</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#F4F3F1" />
        </TouchableOpacity>

        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNextPress}
        >
          <Feather name="chevron-right" size={24} color="#F4F3F1" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medication</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewMed}
              value={newMed}
              placeholder="Enter medication name"
              placeholderTextColor="#6A5ACD"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddMedication}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDosageModal}
        onRequestClose={() => setShowDosageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Set Dosage for {currentMed?.name}
            </Text>
            <View style={styles.dosageContainer}>
              <TouchableOpacity
                onPress={() => handleDosageChange(-0.5)}
                style={styles.dosageButton}
              >
                <Feather name="minus" size={24} color="#F4F3F1" />
              </TouchableOpacity>
              <Text style={styles.dosageValue}>
                {selectedMeds[currentMed?.id]?.dosage || 0} mg
              </Text>
              <TouchableOpacity
                onPress={() => handleDosageChange(0.5)}
                style={styles.dosageButton}
              >
                <Feather name="plus" size={24} color="#F4F3F1" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowDosageModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => setShowDosageModal(false)}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B1F",
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#F4F3F1",
    marginBottom: 40,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 100,
  },
  button: {
    width: "28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "rgba(106, 90, 205, 0.2)",
    borderRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#352F44",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: "#6A5ACD",
  },
  buttonText: {
    color: "#F4F3F1",
    fontSize: 12,
    textAlign: "center",
  },
  dosageText: {
    color: "#6A5ACD",
    fontSize: 10,
    marginTop: 4,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#352F44",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#6A5ACD",
  },
  progressDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#352F44",
  },
  activeDot: {
    backgroundColor: "#6A5ACD",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1C1B1F",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F4F3F1",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#352F44",
    color: "#F4F3F1",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#6A5ACD",
  },
  modalButtonText: {
    color: "#F4F3F1",
    fontWeight: "600",
  },
  dosageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dosageButton: {
    backgroundColor: "#352F44",
    padding: 10,
    borderRadius: 5,
  },
  dosageValue: {
    color: "#F4F3F1",
    fontSize: 18,
    marginHorizontal: 20,
  },
});
