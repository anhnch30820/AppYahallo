import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NoInternet from './screens/NoConnectionScreen';

const LoginStack = createNativeStackNavigator()

export default function LoginStackScreen(){
    return(
      <LoginStack.Navigator
        
      >
        <LoginStack.Screen name="WelcomeScreen" component={WelcomeScreen} 
        options={{
            headerShown: false
          }}
        />
        <LoginStack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }}/>
        <LoginStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký' }}/>
        <LoginStack.Screen name="NoInternet" component={NoInternet} options={{
            headerShown: false
          }}/>
      </LoginStack.Navigator>
    )
}
