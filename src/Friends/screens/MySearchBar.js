import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Ionicons from "react-native-vector-icons/Ionicons";
import apiClient from "../../api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-elements';
import { BaseURL } from "../../utils/Constants";


export default function MySearchBar({ navigation }) {

    const [search, setSearch] = useState();
    const [dataPhone, setDataPhone] = useState([]);
    const [dataFriend, setDataFriend] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [check, setCheck] = useState();
    const [userId, setUserId] = useState();


    const searchPhoneFriends = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {
            const res = await apiClient.post('/friends/search',
                {
                    phonenumber: search
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            if (res.status == 200) {
                console.log(res.data.data.friend)
                setDataPhone(res.data.data.friend);

            }
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }

        try {
            const res = await apiClient.post('/friends/searchFriend',
                {
                    user_name: search
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            if (res.status == 200) {
                setDataFriend(res.data.data.friends);

            }
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
        setCheck('1');
    }


    const setRequest = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (userId == dataPhone[0]._id) {
            Alert.alert('Thông báo!', "Không thể kết bạn với chính mình", [
                { text: 'Okay' }
            ])
            return;
        }
        try {
            const res = await apiClient.post('/friends/set-request-friend',
                {
                    user_id: dataPhone[0]._id,
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );

            console.log(res.data)
            if (res.status == 200) {
                Alert.alert('Thông báo!', res.data.message, [
                    { text: 'Okay' }
                ])
            }
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
    }

    useEffect(() => {
        setTimeout(() => { setLoading(false) }, 1000)
    }, []);



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

        console.log(chatIdcall);

        navigation.navigate('ChatRom', {
            chatId: chatIdcall,
            userData: item,
            userId: userId,
        });
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 350 }}>

                    <SearchBar
                        placeholder="Tìm bạn bè, tin nhắn..."
                        onChangeText={(text) => setSearch(text)}
                        value={search}
                        inputContainerStyle={{ backgroundColor: 'white', height: 35 }}
                        containerStyle={{ backgroundColor: '#6F3DD2' }}
                        round={true}
                    />

                </View>

                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => { searchPhoneFriends() }}>
                        <Ionicons
                            name='add-circle-outline'
                            color='white'
                            size={30}
                        />
                    </TouchableOpacity>
                </View>

            </View>

            {dataPhone &&
                <View>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={dataPhone}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                <View style={{ width: '10%', marginRight: 20, marginTop: 5 }}>

                                    <Avatar
                                        rounded
                                        source={{ uri: BaseURL + item.avatar.fileName }}
                                        size="medium"
                                    />

                                </View>

                                <View style={{
                                    marginBottom: 10,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: "space-between"
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate("Trang cá nhân", {
                                            userId: item._id
                                        })
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: 'black',
                                            marginTop: 15,
                                            fontWeight: 'bold',

                                        }}>{item.username}</Text>
                                    </TouchableOpacity>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => { setRequest() }}
                                        >
                                            <View style={{
                                                backgroundColor: 'dodgerblue',
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                borderColor: '#fff',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 100,
                                                height: 30,
                                                marginTop: 15,
                                                marginRight: 20
                                            }}>

                                                <Text style={{
                                                    color: '#fff',
                                                    marginTop: 2,
                                                    marginBottom: 2,
                                                    fontWeight: 'bold'
                                                }}>KẾT BẠN</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            }
            {dataFriend &&
                <View>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={dataFriend}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Trang cá nhân", {
                                        userId: item._id
                                    })
                                }}>
                                    <View style={{ width: '10%', marginRight: 20, marginTop: 5 }}>
                                        <Avatar
                                            rounded
                                            source={{ uri: BaseURL + item.avatar.fileName }}
                                            size="medium"
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{
                                    marginBottom: 10,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: "space-between"
                                }}><TouchableOpacity onPress={() => {
                                    navigation.navigate("Trang cá nhân", {
                                        userId: item._id
                                    })
                                }}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: 'black',
                                            marginTop: 15,
                                            fontWeight: 'bold',

                                        }}>{item.username}</Text>
                                    </TouchableOpacity>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => { _onChat(item) }}
                                        >
                                            <View style={{
                                                backgroundColor: 'dodgerblue',
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                borderColor: '#fff',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 100,
                                                height: 30,
                                                marginTop: 15,
                                                marginRight: 20
                                            }}>

                                                <Text style={{
                                                    color: '#fff',
                                                    marginTop: 2,
                                                    marginBottom: 2,
                                                    fontWeight: 'bold'
                                                }}>NHẮN TIN</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            }
            {
                dataPhone.length == 0 && dataFriend.length == 0 && check ? <Text style={{ fontSize: 20, marginTop: 5 }}>Không tìm thấy kết quả phù hợp</Text> : null
            }
        </View>

    )


}

const styles = StyleSheet.create({
    icon: {
        backgroundColor: '#6F3DD2',
        width: 46,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})