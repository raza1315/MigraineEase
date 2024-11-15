import { View, Text, TouchableOpacity, Vibration } from "react-native";
import React, { useState } from "react";
import axios from "axios";

const Test = () => {
  const [data, setData] = useState([]);
  const handledbtest = async () => {
    try {
      const res = await axios.get("http://192.168.0.165:3000/auth");
      console.log("test");
      setData(res.data);

      Vibration.vibrate(100);
      console.log(res.status, res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Text>Test</Text>
      <TouchableOpacity
        style={{ backgroundColor: "red", marginTop: 100 }}
        onPress={() => {
          handledbtest();
        }}
      >
        <Text>Testing btn</Text>
      </TouchableOpacity>

      {data?.map((item,index) => {
        return (
          <View key={index}>
            <Text>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default Test;
