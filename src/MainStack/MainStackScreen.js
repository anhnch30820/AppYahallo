import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text } from "react-native";

import TrangCaNhanAll from "../Profile/ProfileStackScreen";
import FriendStackScreen from "../Friends/FriendStackScreen";
import ChatNavigation from "../Message/navi/ChatNavigation";
import PostStackScreen from "../Diary/stacks/PostStackScreen";
export default MainStackScreens = () => {
  const MainStack = createBottomTabNavigator();

  return (
    <MainStack.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icons = {
            Message: 'ios-chatbox-ellipses-outline',
            Diary: 'newspaper-outline',
            Call: 'ios-call-outline',
            Profile: 'ios-person-outline',
          };

          return (
            <Ionicons
              name={icons[route.name]}
              color={focused ? "#6F3DD2" : "grey"}
              size={24}
            />
          );
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            "display": "flex"
          },
          null
        ],
        backgroundColor: "#124122",
        headerShown: false,
      })}
    >
      <MainStack.Screen name="Diary" component={PostStackScreen} />
      <MainStack.Screen name="Message" component={ChatNavigation} />
      <MainStack.Screen name="Call" component={FriendStackScreen} />   
      <MainStack.Screen name="Profile" component={TrangCaNhanAll} />

    </MainStack.Navigator>
  );
};