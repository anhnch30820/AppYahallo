import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  
} from 'react';
import Clipboard from '@react-native-community/clipboard';

import AsyncStorage from '@react-native-async-storage/async-storage';

import apiClient from '../../api/client';

import {io} from 'socket.io-client';
const SOCKET_URL = 'http://192.168.6.104:3000';

import {useRoute, useNavigation} from '@react-navigation/core';
import {useIsFocused} from '@react-navigation/native';

import {Avatar, Icon} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  getMessages,
  sendMessage,
  deleteMessage,
} from '../components/ChatRoomItem/apiMessager';
import { BaseURL } from '../../utils/Constants';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

export default function ChatMessengerScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {chatId, userData, userId} = route.params;
  const receiverId = userData._id;
  const senderId = userId;

  const [state, setState] = useState({});

  const [messages, setMessages] = useState([]);
  const [listBlocks, setlistBlocks] = useState([]);
  const [block, setblock] = useState(false);

  const [isSocket, setisSocket] = useState(false);

  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect(SOCKET_URL);
    return () => {
      setState({}); // This worked for me
    };
  }, []);

  socket.current?.on('messageBack', data => {
    setisSocket(!isSocket);
  });
  socket.current?.on('blockBack', data => {
    setisSocket(!isSocket);
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Icon
            name={'chevron-left'}
            size={40}
            onPress={() => navigation.goBack()}
          />
          <Avatar
            rounded
            source={{
              uri: BaseURL + userData.avatar.fileName,
            }}
          />
        </View>
      ),
      title: `  ${userData.username}`,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            style={{marginRight: 8}}
            name="md-call-outline"
            size={28}
            color="black"
          />
          <AntDesign
            style={{marginRight: 8}}
            name="videocamera"
            size={28}
            color="black"
          />
          <Icon onPress={_setting} name={'menu'} size={30} />
        </View>
      ),
    });
  }, []);

  if (chatId) {
    useEffect(() => {
      const initialize = async () => {
        const newMessages = await fetchMessages();
        setMessages(
          newMessages
            .map(msg => ({
              _id: msg._id,
              text: msg.content,
              createdAt: msg.createdAt,
              user: {
                _id: msg.user._id,
                name: msg.user.username,
                avatar: BaseURL + userData.avatar.fileName,
              },
            }))
            .reverse(),
        );
      };
      initialize();
      return () => {
        setState({}); // This worked for me
      };
    }, [isFocused, isSocket]);
  }

  useEffect(() => {
    const initialize = async () => {
      const listBlocks = await listBlock();
      setblock(false);
      for (let i = 0; i < listBlocks.length; i++) {
        if (listBlocks[i]._id == receiverId) {
          setblock(true);
          break;
        }
      }

      const listBlockUsers = await listBlockUser();

      for (let i = 0; i < listBlockUsers.length; i++) {
        if (listBlockUsers[i]._id == senderId) {
          setblock(true);
        }
      }
    };
    initialize();
    return () => {
      setState({}); // This worked for me
    };
  }, [isFocused, isSocket]);

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
        console.log("1", response.data.data);
        return response.data.data;
      }
    } catch (e) {
      console.log(e.message)
      navigation.navigate("NoInternet")
      return    }
  };

  const listBlockUser = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await apiClient.get(
        `/users/list-block-inbox/${receiverId}`,

        {
          headers: {
            authorization: 'token ' + userToken,
          },
        },
      );
      if (response.status == 200) {
        console.log("2", response.data.data);
        return response.data.data;
      }
    } catch (e) {
      console.log(e.message)
          navigation.navigate("NoInternet")
          return
    }
  };

  const _setting = () => {
    navigation.navigate('MessageSetting', {
      chatId: chatId,
      userData: userData,
    });
  };

  const fetchMessages = async () => {
    try {
      const res = await getMessages(chatId);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const onSend = useCallback(async (messages = []) => {
    if (messages.length > 0) {
      const newMsgObj = messages[0];
      try {
        const sendResult = await sendMessage(
          chatId,
          senderId,
          receiverId,
          newMsgObj.text,
        );
      } catch (err) {
        console.log(err);
      }

      socket.current?.emit('sendMessages', {
        user: senderId,
        data: newMsgObj.text,
      });

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    }
  }, []);

  const onDelete = async messageIdToDelete => {
    try {
      const deleteMess = await deleteMessage(messageIdToDelete);

      setMessages(
        messages.filter(message => message._id !== messageIdToDelete),
      );

      socket.current?.emit('deleteMessages', {
        data: messageIdToDelete,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onLongPress = (context, message) => {
    const options = ['Copy', 'Delete Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(message.text);
            break;
          case 1:
          
              Alert.alert(
                'Thông báo', 'Bạn có chắc chắn muốn xóa tin nhắn không',
                [
                  { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                  { text: 'Có', onPress: () => onDelete(message._id) }
                ]
              );

            break;
        }
      },
    );
  };

  const onShowInput = () => {
    return true;
  };
  const onShowBlock = () => {
    return (
      <Text
        style={{
          color: 'red',
          marginLeft: 20,
          marginRight: 20,
          textAlign: 'center',
          fontSize: 18,
        }}>
        Bạn hoặc đối phương đang block nhau nên không thể trò chuyện
      </Text>
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome5 name="arrow-alt-circle-down" size={22} color="blue" />;
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={{flex: 1, paddingTop: 75, backgroundColor: 'white'}}>
        {block ? (
          <GiftedChat
            messages={messages}
            placeholder="Tin nhắn"
            renderInputToolbar={onShowInput}
            renderChatFooter={onShowBlock}
            showAvatarForEveryMessage={true}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            onSend={messages => onSend(messages)}
            onLongPress={onLongPress}
            user={{
              _id: userId,
            }}
          />
        ) : (
          <GiftedChat
            messages={messages}
            placeholder="Tin nhắn"
            showAvatarForEveryMessage={true}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            onSend={messages => onSend(messages)}
            onLongPress={onLongPress}
            user={{
              _id: userId,
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
  },
});
