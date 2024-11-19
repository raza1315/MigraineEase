import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import { Ionicons, FontAwesome, Entypo, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { friendName, friendImage, friendId } = route.params;
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const scrollViewRef = useRef(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("chats")}>
            <Ionicons name="arrow-back" size={26} color="#4B0082" />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#4B0082",
              padding: 1.5,
            }}
          >
            <Image
              style={{ height: 38, width: 38, borderRadius: 100 }}
              source={{ uri: friendImage }}
            />
          </View>
          <Text style={{ color: "#4B0082", fontSize: 16, fontWeight: "500" }}>
            {friendName}
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "white",
      },
    });
  }, []);
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  };

  const GetTimeOfMsg = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return hours + ":" + minutes;
  };

  const getUserId = async () => {
    const id = await AsyncStorage.getItem("userId");
    setUserId(id);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getMessages?senderId=${userId}&receiverId=${friendId}`
      );
      const data = await res.json();

      if (res.status === 200) {
        const formattedMessages = data.map((msgData) => ({
          message: msgData.message,
          sentTo: msgData.receiver_id,
          time: GetTimeOfMsg(msgData.sent_at),
        }));
        setChats(formattedMessages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserId();
    if (userId) {
      console.log(userId);
      console.log(friendId, friendName);
      fetchMessages();
      const newSocket = io(`${process.env.EXPO_PUBLIC_SERVER_URL}`);
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on("clientListener", (message) => {
        const time = new Date();
        const formattedTime = GetTimeOfMsg(time);
        setChats((prevChats) => [
          ...prevChats,
          { ...message, time: formattedTime },
        ]);
        scrollToBottom();
      });
    }
  }, [socket]);

  const sendMessage = async () => {
    if (message.trim()) {
      socket.emit("serverListener", {
        message,
        senderId: userId,
        receiverId: friendId,
      });
      const time = new Date();
      const formattedTime = GetTimeOfMsg(time);
      setChats((prevMessages) => [
        ...prevMessages,
        { message: message, sentTo: friendId, time: formattedTime },
      ]);
      setMessage("");
      scrollToBottom();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#F0F8FF", "#E6E6FA"]} style={styles.gradient}>
        <KeyboardAvoidingView style={styles.chatContainer}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewContent}
          >
            {chats.map((msg, index) =>
              msg.sentTo == friendId ? (
                <View
                  key={index}
                  style={{
                    alignSelf: "flex-end",
                    justifyContent: "center",
                    paddingHorizontal: 11,
                    paddingVertical: 6,
                    backgroundColor: "rgba(75, 50, 170, 0.7)",
                    maxWidth: "77%",
                    marginBottom: 10,
                    marginRight: 5,
                    borderBottomLeftRadius: 13,
                    borderBottomRightRadius: 15,
                    borderTopLeftRadius: 15,
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,1)",
                      marginRight: "15%",
                      fontSize: 16,
                    }}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 12,
                      textAlign: "right",
                      marginTop: "-4.7%",
                    }}
                  >
                    {msg.time}
                  </Text>
                </View>
              ) : (
                <View
                  key={index}
                  style={{
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    paddingHorizontal: 11,
                    paddingVertical: 6,
                    backgroundColor: "rgba(75, 50, 170, 0.7)",
                    maxWidth: "77 %",
                    marginBottom: 10,
                    marginLeft: 5,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 13,
                    borderTopRightRadius: 15,
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,1)",
                      marginRight: "15%",
                      fontSize: 16,
                    }}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 12,
                      textAlign: "right",
                      marginTop: "-4.7%",
                    }}
                  >
                    {msg.time}
                  </Text>
                </View>
              )
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#6A5ACD"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={showProfile}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowProfile(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: friendImage }} style={styles.modalAvatar} />
              <Text style={styles.modalName}>{friendName}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowProfile(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: -50,
  },

  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: "77%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6A5ACD",
    borderBottomRightRadius: 5,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: "white",
    marginRight: "15%",
  },
  messageTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: "#4B0082",
  },
  sendButton: {
    backgroundColor: "#6A5ACD",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#6A5ACD",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  gradient: {
    flex: 1,
  },
});

export default ChatScreen;
