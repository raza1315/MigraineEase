import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// Dummy data for messages
const initialMessages = [
  { id: '1', text: 'Hi there! How are you feeling today?', sender: 'other', timestamp: '10:00 AM' },
  { id: '2', text: 'I\'m having a bit of a headache, actually.', sender: 'me', timestamp: '10:02 AM' },
  { id: '3', text: 'I\'m sorry to hear that. Have you taken any medication?', sender: 'other', timestamp: '10:03 AM' },
  { id: '4', text: 'Not yet, I was thinking of trying some relaxation techniques first.', sender: 'me', timestamp: '10:05 AM' },
  { id: '5', text: 'That\'s a good idea. Deep breathing can sometimes help with tension headaches.', sender: 'other', timestamp: '10:06 AM' },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  const sendMessage = () => {
    if (inputMessage.trim().length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.gradient}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#4B0082" />
          <Text style={styles.headerTitle}>Chat with Support</Text>
          <Ionicons name="ellipsis-vertical" size={24} color="#4B0082" />
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          inverted
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type a message..."
            placeholderTextColor="#A0A0A0"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6A5ACD',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#E0E0E0',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    color: '#4B0082',
  },
  sendButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;