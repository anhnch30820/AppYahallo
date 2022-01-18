import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements';
import apiClient from '../../../src/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from '../../utils/Constants';
import { useIsFocused } from '@react-navigation/native';

export default function BlockedInboxList({ navigation }) {
    const [data, setData] = useState();
    const [state, setState] = useState({});
    const [isLoading, setLoading] = useState(true);
    const isFocused = useIsFocused();
    const [del, setDel] = useState('');

    const listBlock = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const response = await apiClient.get('/users/list-block-inbox',

                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            if (response.status == 200) {
                console.log(response.data.data)
                return response.data.data;
            }

        }
        catch (e) {
            console.log(e)
            navigation.navigate("NoInternet")
        }
    }

    const setRemoveBlock = async (id) => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {

            const res = await apiClient.post('/users/set-block-user',
                {
                    user_id: id,
                    type: null,
                },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );

            setDel(id);
            // if (res.status == 200) {
            //     setData(res.data.data.friend);

            // }
        }
        catch (e) {
            console.log(e)
            navigation.navigate("NoInternet")
        }
    }

    useEffect(() => {
        setTimeout(() => { setLoading(false) }, 1000)

        listBlock().then(setData)
        return () => {
            setState({});
        };

    }, [del]);

    const renderItem = ({ item }) => {
        return (
            <ListItem>
                <Avatar source={{ uri: BaseURL + item.avatar.fileName }} />
                <ListItem.Content>
                    <ListItem.Title style={styles.text}>{item.username}</ListItem.Title>
                </ListItem.Content>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Thông báo', 'Bạn có chắc chắn muốn bỏ chặn',
                        [
                            { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Có', onPress: () => setRemoveBlock(item._id) }
                        ]
                    );
                }}>
                    <Text style={{ color: '#6F3DD2' }}>Bỏ chặn</Text>
                </TouchableOpacity>
            </ListItem>
        )
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
    },
    text: {
        color: '#000000',
        marginLeft: 10,
        fontSize: 16,
        textAlignVertical: 'center',
    },
    item: {
        padding: 2,
        height: 60,
    },
    avatar: {
        borderRadius: 100,
    },
})