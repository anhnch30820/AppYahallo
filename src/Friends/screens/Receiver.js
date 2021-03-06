import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
// import { FlatList, TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from 'react-native-elements';
import apiClient from "../../api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from "../../utils/Constants";
// const persons = [
//     {
//         name: 'Akira',
//         image_dir: require('../assets/images/001.jpg'),
//     },
//     {
//         name: 'Hanako',
//         image_dir: require('../assets/images/002.jpg'),
//     },
//     {
//         name: 'Chin',
//         image_dir: require('../assets/images/001.jpg'),
//     },
// ]

export default function Receiver({ route, navigation }) {

    const [state, setState] = useState({});
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(true);
    const [del, setDel] = useState('');


    const listRequest = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const response = await apiClient.post('/friends/get-requested-friend',
                {

                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            if (response.status == 200)

                return response.data.data.friends;

            // }
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
    }

    useEffect(() => {
        setTimeout(() => { setLoading(false) }, 1000)

        listRequest().then(setData)
        return () => {
            setState({});
        };
    }, [del]);



    const setAccept = async (id, is_accept) => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const res = await apiClient.post('/friends/set-accept',
                {
                    user_id: id,
                    is_accept: ('1' === is_accept) ? '1' : '2'
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            // console.log("123", res.data);
            if (res.status == 200) {
                Alert.alert('Th??ng b??o!', res.data.message, [
                    { text: 'Okay' }
                ])
            }
            setDel(id);
            // }
        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }
    return (

        <View>

            <FlatList
                keyExtractor={item => `${item._id}`}
                data={data}

                renderItem={({ item }) => (

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ width: '10%', marginRight: 20, marginTop: 18 }}>
                            <Avatar
                                rounded
                                source={{ uri: BaseURL + item.avatar.fileName }}
                                size="medium"
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#000',
                                marginBottom: 5,
                                marginTop: 15,
                                fontWeight: 'bold'
                            }}>{item.username}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { setAccept(item._id, '1') }
                                }
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
                                    }}>

                                        <Text style={{
                                            color: '#fff',
                                            marginTop: 2,
                                            marginBottom: 2,
                                            fontWeight: 'bold'
                                        }}>?????NG ??</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setAccept(item._id, '2') }}

                                >
                                    <View style={{
                                        backgroundColor: '#eeeeee',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 100,
                                        height: 30,
                                        marginLeft: 18
                                    }}>

                                        <Text style={{
                                            color: '#000',
                                            marginTop: 2,
                                            marginBottom: 2,
                                            fontWeight: 'bold',
                                        }}>T??? CH???I</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ fontSize: 20, marginTop: 5 }}>Kh??ng c?? y??u c???u k???t b???n n??o</Text>}
            />



        </View>


    )

}