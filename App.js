import { View, Text, StatusBar } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./Navigation/Navigation";
const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={{ flex: 1 }}>
        <Navigation />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
