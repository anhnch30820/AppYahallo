import React, { useEffect, useState, useMemo } from 'react';
import { StatusBar, ScrollView } from 'react-native'
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginStackScreen from './src/Login/LoginStackScreen';
import MainStackScreen from './src/MainStack/MainStackScreen';
import { AuthContext } from './src/components/context';
import { NavigationContainer } from '@react-navigation/native';

export default App = () => {

  const initialLoginState = {
    isLoading: true,
    userToken: null,
    userId: null,
    socket: null,
    username: null,
  };


  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          username: action.username
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.userToken,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
          userId: null,
          socket: null,
          username: null,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          userId: action.userId,
          socket: action.socket,
          username: action.username
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const authContext = {
    loginState,
    dispatch,
  };


  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        username = await AsyncStorage.getItem('username');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken , username: username});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  }



  return (
    <AuthContext.Provider value={authContext}>

      <NavigationContainer>
        {loginState.userToken != null ?    
            <MainStackScreen/>
          : <LoginStackScreen />}


      </ NavigationContainer>
    </AuthContext.Provider>
  )
}
