import React, { Component, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Pressable } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrangCaNhanScreen from "./screens/TrangCaNhanScreen";
import CaiDat from './screens/CaiDat';
import QuyenRiengTu from "./screens/QuyenRiengTu";
import BlockedDiaryList from "./screens/BlockedDiaryList";
import ChangeInfo from "./screens/ChangeInfo";
import ChangeImage from "./screens/Thaydoianh";
import ChangePass from "../Login/screens/ChangePassword";
import ViewImage from "./screens/ViewImage";
import ChangeImageLib from "./screens/ChangImage";
import OptionsPostProfile from "./screens/OptionsPostProfile";
import NoInternet from "../Login/screens/NoConnectionScreen";
import BlockedInboxList from "./screens/BlockedInboxList";

import ViewImageTimeLine from '../Diary/screens/ViewImageTimeLine';
import Comment from '../Diary/screens/Comment';

const Stack = createNativeStackNavigator();

export default function TrangCaNhanAll() {

    return (

        <Stack.Navigator>
            <Stack.Screen
                name="Trang cá nhân"
                component={TrangCaNhanScreen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Cài đặt"
                component={CaiDat}
            />

            <Stack.Screen
                name='Quyền riêng tư'
                component={QuyenRiengTu}
            />
            <Stack.Screen
                name='Danh sách chặn nhật ký'
                component={BlockedDiaryList}

            />

            <Stack.Screen
                name='Danh sách chặn tin nhắn'
                component={BlockedInboxList}

            />

            <Stack.Screen
                name="ChangeInfo"
                component={ChangeInfo}
                options={{ title: 'Thông tin cá nhân' }}
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
                name='Đổi mật khẩu'
                component={ChangePass}
            />
            <Stack.Screen
                name='Xem ảnh'
                component={ViewImage}
            />
            <Stack.Screen
                name='ChangeImageLib'
                component={ChangeImageLib}
                options={{ title: 'Thay đổi ảnh' }}
            />
            <Stack.Screen
                name='OptionsPostProfile'
                component={OptionsPostProfile}
                options={{ title: 'Tùy chọn bài viết' }}
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
}


const styles = StyleSheet.create({
    body: {
        height: 900,
    },
    backgroundImage: {
        flex: 1,
        height: '75%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    avatar: {
        height: 100,
        aspectRatio: 1,
        borderRadius: 100,
        marginTop: '50%',
    },
    wall: {
        flex: 2,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#6f3dd2',
    }
})