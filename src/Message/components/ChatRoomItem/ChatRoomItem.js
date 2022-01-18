import React, {useState, useEffect} from 'react';
import {Image, Text, View, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../api/client';
import { TimeUtility } from '../../../utils/TimeUtility';
import { BaseURL } from '../../../utils/Constants';
export default function ChatRoomItem({chatRoom}) {
  const navigation = useNavigation();
  const [userData, setuserData] = useState();
  const [userId, setUserId] = useState();
  const [state, setState] = useState({});
  let userFriend = '';

  const getUser = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    let userId1 = await AsyncStorage.getItem('userId');
    setUserId(userId1);

    if (chatRoom.member[0] == userId1) userFriend = chatRoom.member[1];
    else userFriend = chatRoom.member[0];

    let auth = {
      headers: {
        authorization: 'token ' + userToken,
      },
    };
    try {
      const response = await apiClient.get(`users/show/${userFriend}`, auth);
      if (response.data) {
        return response.data.data;
      }
    } catch (e) {
      console.log(e.message)
      navigation.navigate("NoInternet")
      return
    }
  };

  useEffect(() => {
    getUser().then(setuserData);
    return () => {
      setState({}); // This worked for me
    };
  }, []);

  const _onPress = () => {
    navigation.navigate('ChatRom', {
      chatId: chatRoom._id,
      userData: userData,
      userId: userId,
    });
  };

  return (
    <>
      {userData && (
        <Pressable style={styles.container} onPress={_onPress}>
          <Image
            source={{
              uri: BaseURL + userData.avatar.fileName,
            }}
            style={styles.image}></Image>

          <View style={styles.rightContainer}>
            <View style={styles.row}>
              
              <Text style={styles.name}>{userData.username} </Text>

              <View style={{marginLeft: 'auto', marginRight: 10}}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 14,
                    color: '#333333',
                  }}>
                  {TimeUtility.getTimeStr(new Date(chatRoom.updatedAt))}{' '}
                </Text>
              </View>
            </View>
            <Text numberOfLines={1} style={styles.text}>
              {chatRoom.content}
            </Text>
          </View>
        </Pressable>
      )}
    </>
  );
}
