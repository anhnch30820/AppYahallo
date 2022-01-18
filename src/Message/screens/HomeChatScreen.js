import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import ChatRoomItem from '../components/ChatRoomItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

import {io} from 'socket.io-client';
const SOCKET_URL = 'http://192.168.6.104:3000';

export default function HomeChatScreen() {
  const isFocused = useIsFocused();

  const [data, setData] = useState();
  const [state, setState] = useState({});

  const [isSocket, setisSocket] = useState(false);
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect(SOCKET_URL);
    return () => {
      setState({});
    };
  }, []);

  socket.current?.on('messageBack', data => {
    setisSocket(!isSocket);
  });

  const getListChats = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    let auth = {
      headers: {
        authorization: 'token ' + userToken,
      },
    };

    try {
      const response = await apiClient.get('chats/getListChats', auth);
      if (response.data) {
        let data = response.data.data;
        data = await data.sort(function (a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        return data;
      }
    } catch (e) {
      console.log(e.message)
          navigation.navigate("NoInternet")
          return
    }
  };

  useEffect(() => {
    getListChats().then(setData);
    return () => {
      setState({}); // This worked for me
    };
  }, [isFocused, isSocket]);

  return (
    <>
      {data && (
        <SafeAreaView style={styles.page}>
          <FlatList
            data={data}
            keyExtractor={item => `${item._id}`}
            renderItem={({item}) => <ChatRoomItem chatRoom={item} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{marginTop: 10}}>
                <Text style={styles.describeText}>
                  Chưa có cuộc trò chuyện nào!
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#e6e6e6',
    flex: 1,
  },
  describeText: {
    fontSize: 20,
    paddingLeft: 16,
    paddingRight: 16,
    color: '#333333',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
});
