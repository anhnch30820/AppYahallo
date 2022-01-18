import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Report({navigation, route}) {
    const [text, settext] = useState('');
    const [content, setcontent] = useState('');
 
    const Report = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                authorization: "token " + userToken,
            }
        };
        try {
            const response = await apiClient.post(`/postReport/create/${route.params.postId}`, {
                subject: text,
                details: content,
            }, axiosConfig)
            
            if (response.status == 200) {
                Alert.alert('Thành công!', 'Báo cáo bài viết thành công', [
                    { text: 'Okay', onPress: () => navigation.navigate('post') }
                  ]);
            }

        } catch (error) {
            console.log('Error when getting user', error.message)
        }
    }

    return (
        <>
            <View>
                <Text style={styles.header}>Tiêu đề</Text>

                <TextInput
                    style={styles.text}
                    onChangeText={settext}
                    placeholder="Hãy nhập vào đây"
                    numberOfLines={5}
                    value={text}
                />
            </View>
            <View>
                <Text style={styles.header}>Mô tả chi tiết</Text>
                <TextInput
                    style={styles.content}
                    onChangeText={setcontent}
                    placeholder="Hãy nhập vào đây"
                    numberOfLines={5}
                    value={content}
                    multiline={true}
                />
            </View>
            <TouchableOpacity onPress={()=>Report()} style={{flex: 1, alignItems: 'center', marginTop: 10}}><Text style={{fontSize: 25, color: '#6F3DD2'}}>Gửi</Text></TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
    },
    content: {
        height: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 18,
        textAlign: 'left'
    },
    header: {
        fontSize: 20,
        color: 'black',
        paddingLeft: 16,
        paddingTop: 20,
        fontWeight: 'bold',
    },
});