import { View } from 'react-native'
import React,{useEffect} from 'react'
import {useNavigation,useIsFocused} from '@react-navigation/native'

const Test2 = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      navigation.navigate('Timer'); 
    }
  },[isFocused])
  return (
    <View>
    </View>
  )
}

export default Test2