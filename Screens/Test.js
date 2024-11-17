import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const initialChats = [
  {
    id: "1",
    name: "Angel Curtis",
    message: "Please help me find a good monitor for tracking migraines",
    time: "02:11",
    unread: 2,
    image: "https://picsum.photos/id/1050/200",
  },
  {
    id: "2",
    name: "Zaire Dorwart",
    message: "Checking in about your migraine diary",
    time: "02:11",
    unread: 0,
    image: "https://picsum.photos/id/1055/200",
  },
  {
    id: "3",
    name: "Support Group",
    message: "Emma: Thanks for sharing your experience!",
    time: "02:11",
    unread: 2,
    image: "https://picsum.photos/id/1060/200",
  },
  {
    id: "4",
    name: "Dr. Johnson",
    message: "You're scheduled for next week",
    time: "02:11",
    unread: 0,
    image: "https://picsum.photos/id/1065/200",
  },
  {
    id: "5",
    name: "Medication Reminder",
    message: "Time to take your evening dose",
    time: "02:11",
    unread: 1,
    image: "https://picsum.photos/id/1070/200",
  },
];

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function ChatScreen() {
  const [chats, setChats] = useState(initialChats);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text) {
      const filteredChats = initialChats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(text.toLowerCase()) ||
          chat.message.toLowerCase().includes(text.toLowerCase())
      );
      setChats(filteredChats);
    } else {
      setChats(initialChats);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((text) => {
      console.log("Search query:", text);
      handleSearch(text);
    }, 1500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.image }} style={styles.chatImage} />
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <View style={styles.chatMeta}>
        <Text style={styles.chatTime}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#6A5ACD"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#6A5ACD"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.chatsHeader}>
        <Text style={styles.chatsTitle}>Chats</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#4B0082" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6FA",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#4B0082",
    fontSize: 16,
  },
  chatsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6FA",
  },
  chatsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6FA",
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B0082",
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: "#6A5ACD",
  },
  chatMeta: {
    alignItems: "flex-end",
  },
  chatTime: {
    fontSize: 12,
    color: "#6A5ACD",
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: "#6A5ACD",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
