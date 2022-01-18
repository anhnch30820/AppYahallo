import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import { Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';
import { Alert } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BaseURL } from '../../utils/Constants';
import { io } from 'socket.io-client';
const SOCKET_URL = 'http://192.168.6.104:3000';

export default function MessageSettingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const chatId = route.params?.chatId;
  const userData = route.params?.userData;
  const receiverId = userData._id;

  const [block, setblock] = useState(false);
  const [state, setState] = useState({});

  const socket = useRef();

  useEffect(() => {
    const initialize = async () => {
      const listBlocks = await listBlock();
      for (let i = 0; i < listBlocks.length; i++) {
        if (listBlocks[i]._id == receiverId) {
          setblock(true);
        }
      }
    };
    initialize();
    return () => {
      setState({}); // This worked for me
    };
  }, []);

  const deleteChat = async chatId => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await apiClient.get(`/chats/deleteChat/${chatId}`, {
        headers: {
          authorization: 'token ' + userToken,
        },
      });
      if (response.status == 200) {
        Alert.alert('Thông báo!', response.data.message, [{ text: 'Okay' }]);
      }
    } catch (e) {
      console.log(e.message)
      navigation.navigate("NoInternet")
      return
    }
  };

  const _onDelete = async () => {
    try {
      const deleteChats = await deleteChat(chatId);
      navigation.navigate('HomeChat');
    } catch (err) {
      console.log(err);
    }
  };

  const listBlock = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await apiClient.get(
        '/users/list-block-inbox',

        {
          headers: {
            authorization: 'token ' + userToken,
          },
        },
      );
      if (response.status == 200) {
        return response.data.data;
      }
    } catch (e) {
      console.log(e.message)
          navigation.navigate("NoInternet")
          return
    }
  };

  const _onBlock = async () => {
    try {
      socket.current = io.connect(SOCKET_URL);
      _setBlock().then(() => {
        socket.current?.emit('block', {
          receiverId: receiverId,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const _setBlock = async type => {
    type = '1';
    if (block) type = null;
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const res = await apiClient.post(
        '/users/set-block-user',
        {
          user_id: userData._id,
          type: type,
        },
        {
          headers: {
            authorization: 'token ' + userToken,
          },
        },
      );
      console.log("ga", res.data)
      setblock(!block);
    } catch (e) {
      console.log(e.message)
      navigation.navigate("NoInternet")
      return
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          margin: 20,
        }}>
        <Avatar
          rounded
          size={100}
          source={{
            uri: BaseURL + userData.avatar.fileName,
          }}
        />
      </View>

      <Text
        style={{
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 'bold',
          color: 'black',
          margin: 5,
        }}>
        {userData.username}
      </Text>

      <View style={{ marginTop: 40 }}>
        <View style={[styles.item]}>
          <AntDesign style={styles.icon} name="user" size={20} color="black" />
          <TouchableOpacity onPress={() => {
            navigation.navigate("Trang cá nhân", {
              userId: receiverId
            })
          }}>
            <Text style={[styles.text]}>Trang cá nhân </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Thông báo', 'Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện',
              [
                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Có', onPress: () => _onDelete() }
              ]
            );

            // setRemoveFriend(item._id) 
          }}
        >
          <View style={[styles.item]}>
            <FontAwesome
              style={styles.icon}
              name="trash"
              size={20}
              color="black"
            />
            <Text style={[styles.text]}>Xóa toàn bộ tin nhắn </Text>
          </View>
        </TouchableOpacity>

        {block ?
          <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Thông báo', 'Bạn có chắc chắn muốn bỏ chặn người này',
              [
                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Có', onPress: () => _onBlock() }
              ]
            );

          }}
        >
          <View style={[styles.item]}>
            <Entypo style={styles.icon} name="block" size={20} color="black" />
           
              <Text style={[styles.text]}>Bỏ chặn người dùng này </Text>
           
           
          </View>
        </TouchableOpacity>

        :
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Thông báo', 'Bạn có chắc chắn muốn chặn người này',
              [
                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Có', onPress: () => _onBlock() }
              ]
            );

          }}
        >
          <View style={[styles.item]}>
            <Entypo style={styles.icon} name="block" size={20} color="black" />
            
              <Text style={[styles.text]}>Chặn người dùng này </Text>
         
          </View>
        </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  text: {
    color: 'black',
    marginLeft: 10,
    fontSize: 20,
    paddingTop: 5,
  },
  item: {
    margin: 4,
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#ffffff',
  },
  icon: {
    paddingLeft: 20,
    paddingTop: 8,
  },
});
