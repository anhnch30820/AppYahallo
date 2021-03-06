import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableHighlight, ActivityIndicator, Alert } from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Block from 'react-native-vector-icons/Entypo';

import { useIsFocused } from '@react-navigation/native';
import { BaseURL } from '../../utils/Constants';


export default function MyFriendList({ route, navigation }) {


    keyExtractor = item => `${item._id}`;

    renderItem = ({ item, index }) => {
        return (
            <ListItem
                bottomDivider
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                linearGradientProps={{
                    colors: ['#fff1eb', '#ace0f9'],
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                }}
                ViewComponent={LinearGradient}
            >
                <View>

                    <Avatar
                        rounded
                        source={{ uri: BaseURL + item.avatar.fileName }}
                        size="large"

                    />

                   

                </View>
                <ListItem.Content>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Trang cá nhân", {
                            userId: item._id
                        })
                    }}>
                        <ListItem.Title style={{ fontWeight: 'bold', fontSize: 18 }}>{item.username}</ListItem.Title>
                    </TouchableOpacity>

                </ListItem.Content>
                <ListItem.Chevron />
                <TouchableOpacity onPress={() => { _onChat(item) }

                }>
                    <Icon1 name="message1" size={25} color="grey" style={{ margin: 5 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Thông báo', 'Bạn có chắc chắn muốn hủy kết bạn',
                        [
                            { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Có', onPress: () => setRemoveFriend(item._id) }
                        ]
                    );

                    // setRemoveFriend(item._id) 
                }}>
                    <Icon2 name="person-remove" size={25} color="grey" style={{ margin: 5 }} />
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Thông báo', 'Bạn có chắc chắn muốn chặn người này',
                        [
                            { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Có', onPress: () => setBlock(item._id) }
                        ]
                    );

                    // setRemoveFriend(item._id) 
                }}>
                    <Block name="block" size={25} color="grey" style={{ margin: 5 }} />
                </TouchableOpacity> */}

            </ListItem>
        )
    }
    const [state, setState] = useState({});

    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const isFocused = useIsFocused();
    const [del, setDel] = useState('');
    const [userId, setUserId] = useState();



    const listFriends = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const response = await apiClient.post('/friends/list',
                {

                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            if (response.status == 200) {
                // console.log(response.data.data.friends)
                return response.data.data.friends;
            }

            // }
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
    }

    useEffect(() => {
        setTimeout(() => { setLoading(false) }, 1000)

        listFriends().then(setData)
        return () => {
            setState({}); // This worked for me
        };

    }, [del, isFocused]); // Or [] if effect doesn't need props or state

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }



    const setRemoveFriend = async (id) => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const res = await apiClient.post('/friends/set-remove',
                {
                    user_id: id,
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );

            console.log("123", res.data);
            setDel(id);
   
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
    }

    const setBlock = async (id, type) => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const res = await apiClient.post('/users/set-block-diary',
                {
                    user_id: id,
                    type: '1',
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );


            if (res.status == 200) {


            }
        }
        catch (e) {
            console.log(e.message)
        }
    }

    const checkChat = async userId => {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId1 = await AsyncStorage.getItem('userId');
        setUserId(userId1);
        try {
            const response = await apiClient.get(`/chats/checkChat/${userId}`, {
                headers: {
                    authorization: 'token ' + userToken,
                },
            });
            if (response.status == 200) {
                return response.data.data;
            }
        } catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
    };

    const _onChat = async item => {

        let chatIdcall = null;
        chatIdcall = await checkChat(item._id);

        if (chatIdcall) {
            chatIdcall = chatIdcall._id;
        }

        // console.log(chatIdcall);

        navigation.navigate('ChatRom', {
            chatId: chatIdcall,
            userData: item,
            userId: userId,
        });
    };

    return (
        <View style={{}}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Search');
            }}
                activeOpacity={1}
                style={{}}
            >
                <View style={{ backgroundColor: '#6F3DD2', height: 45, }}>
                    <View style={{
                        backgroundColor: 'white', height: 30, borderRadius: 30, marginTop: 7,
                        flexDirection: 'row'
                    }}>
                        <Icon name="search" size={25} color="grey" style={{ margin: 5 }} />
                        <Text style={{ color: 'grey', fontSize: 16, marginLeft: 20, margin: 5 }}>Tìm bạn bè, tin nhắn</Text>
                    </View>

                </View>


            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Lời mời kết bạn');
                }}
            >
                <View style={{ height: 70, alignItems: 'center', flexDirection: 'row' }}>
                    <MaterialIcons
                        name='group'
                        size={40}
                        color="white"
                        style={{ backgroundColor: 'dodgerblue', width: 42, height: 42, borderRadius: 21, marginLeft: 15 }}
                    />
                    <Text style={{ fontSize: 20, color: '#000', marginLeft: 10 }}> Lời mời kết bạn </Text>
                </View>
            </TouchableOpacity>
            <View style={{ height: 1, marginTop: 2, marginBottom: 1, backgroundColor: 'gray' }}></View>
            <View style={{ height: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginBottom: 2 }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Danh sách bạn bè</Text>
 
            </View>
            <View style={{ height: 1, marginTop: 2, marginBottom: 1, backgroundColor: 'gray' }}></View>
            <FlatList
                keyExtractor={keyExtractor}
                data={data}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 150 }}

            />

        </View>

    )

}
