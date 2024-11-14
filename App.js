import { View, Text } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./Navigation/Navigation";
const App = () => {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Navigation />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
