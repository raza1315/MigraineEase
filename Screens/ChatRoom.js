import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function ChatRoom() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const originalChats = useRef([]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.log("User ID not found");
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getUsers/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const chatData = data.map((user) => ({
        id: user.user_id.toString(),
        name: user.username,
        message: "No messages yet",
        time: "",
        unread: 0,
        image: user.profile_picture || "https://picsum.photos/id/1050/200",
      }));
      setChats(chatData);
      originalChats.current = chatData; // Cache original chats
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback(
    (text) => {
      setSearchQuery(text);
      if (text) {
        const filteredChats = originalChats.current.filter(
          (chat) =>
            chat.name.toLowerCase().includes(text.toLowerCase()) ||
            chat.message.toLowerCase().includes(text.toLowerCase())
        );
        setChats(filteredChats);
      } else {
        setChats(originalChats.current);
      }
    },
    [] // No dependencies to ensure stability
  );

  const debouncedSearch = useCallback(
    debounce((text) => {
      console.log("Search query:", text);
      handleSearch(text);
    }, 1500),
    [handleSearch]
  );

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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            onChangeText={(text) => {
              setSearchQuery(text);
              debouncedSearch(text);
            }}
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
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No chats found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyListText: {
    fontSize: 16,
    color: "#6A5ACD",
    textAlign: "center",
    marginTop: 20,
  },
});
