import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Welcome from "../Screens/Welcome";
import SignIn from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";
import Test from "../Screens/Test";
import Home from "../Screens/Home";

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="signIn">
          <Stack.Screen
            name="welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="test"
            component={Test}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
