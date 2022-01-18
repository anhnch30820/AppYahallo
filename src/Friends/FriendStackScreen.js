/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import MyFriendList from './screens/MyFriendList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MySearchBar from './screens/MySearchBar';
import Receiver from './screens/Receiver';

import ChatMessengerScreen from '../Message/screens/ChatMessengerScreen';
import MessageSettingScreen from '../Message/screens/MessageSettingScreen';

import TrangCaNhanScreen from '../Profile/screens/TrangCaNhanScreen';
import ViewImage from '../Profile/screens/ViewImage';
import NoInternet from '../Login/screens/NoConnectionScreen';
import ChangeImageLib from '../Profile/screens/Thaydoianh';
import ChangeImage from '../Profile/screens/Thaydoianh';

import ViewImageTimeLine from '../Diary/screens/ViewImageTimeLine';
import Comment from '../Diary/screens/Comment';

const Stack = createNativeStackNavigator();

const FriendStackScreen = () => {

    return (

        <Stack.Navigator>
            <Stack.Screen
                name={'Bạn bè'}
                component={MyFriendList}
                options={{ headerShown: false }}

            />
            <Stack.Screen
                name={'Lời mời kết bạn'}
                component={Receiver}
                screen
                options={{
                    headerStyle: {

                        backgroundColor: '#6F3DD2'
                    },
                    headerTintColor: '#fff'
                }}
            />

            <Stack.Screen
                name={'Search'}
                component={MySearchBar}
                screen
                options={{
                    title: 'Tìm kiếm'
                }}
            />



            <Stack.Screen
                name="ChatRom"
                component={ChatMessengerScreen}
                options={{
                    headerBackTitleVisible: false,
                }}
            />
            <Stack.Screen
                name="MessageSetting"
                component={MessageSettingScreen}
                options={{
                    headerBackTitleVisible: false,
                    title: "Tùy chọn tin nhắn"
                }}
            />
            <Stack.Screen
                name="Trang cá nhân"
                component={TrangCaNhanScreen}

            />
            <Stack.Screen
                name="ChangeCover"
                component={ChangeImage}
                options={{ title: 'Ảnh bìa' }}
            />
            <Stack.Screen
                name="ChangeAvatar"
                component={ChangeImage}
                options={{ title: 'Ảnh đại diện' }}
            />
            <Stack.Screen
                name='ChangeImageLib'
                component={ChangeImageLib}
                options={{ title: 'Thay đổi ảnh' }}
            />
            <Stack.Screen
                name='Xem ảnh'
                component={ViewImage}
            />
            <Stack.Screen
                name='NoInternet'
                component={NoInternet}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="ViewImageTimeLine" component={ViewImageTimeLine} options={{ title: "Xem ảnh" }} />
            <Stack.Screen name="Comment" component={Comment} options={{ title: "Bình luận" }} />

        </Stack.Navigator>


    );
};



export default FriendStackScreen;
