import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from '../../utils/Constants';
import { TimeUtility } from '../../utils/TimeUtility';
export default function Comment({ navigation, route }) {
    const [data, setData] = useState();
    const [del, setDel] = useState(false);

    const getAllComment = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                authorization: "token " + userToken,
            }
        };
        try {
            const response = await apiClient.get(`/postComment/list/${route.params.postId}`, axiosConfig)
            if (response.status == 200) {
                let data = response.data.data;
                data = await data.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                return data;
            }

        } catch (error) {
            console.log('Error when getting posts', error.message)
        }
    }

    const createComment = async (myComment) => {
        const userToken = await AsyncStorage.getItem('userToken');
        let commentAnswered = null;
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                authorization: "token " + userToken,
            }
        };
        try {
            const response = await apiClient.post(`/postComment/create/${route.params.postId}`,
            {
                content: myComment,
                commentAnswered: commentAnswered,
            },
            axiosConfig)

            if (response.status == 200) {
            setDel(!del)

                
            }

        } catch (error) {
            console.log('Error when getting posts', error.message)
        }
    }
    const [state, setState] = useState({});
    
    useEffect(() => {
 
        getAllComment().then(setData)
        return () => {
          setState({}); // This worked for me
      };
    }, [del]);

    var MyComment = props => {
        const [myComment, setMyComment] = useState('');

        return (
            <KeyboardAvoidingView
                style={styles.myComment}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.sendButton}></View>
                    <View style={styles.enterCommentText}>
                        <TextInput
                            style={styles.enterComment}
                            placeholder="Nhập bình luận"
                            returnKeyType="none"
                            enablesReturnKeyAutomatically={false}
                            onChangeText={text => setMyComment(text)}
                            defaultValue={myComment}></TextInput>
                    </View>
                    <View style={styles.sendButton}>
                        <TouchableOpacity
                            disabled={!myComment.match(/\S/)}
                            onPress={() => {
                                createComment(myComment);
                                setMyComment('');
                            }}>
                            {myComment.match(/\S/) ? (
                                <Icon1 name="send" size={25} color="#6F3DD2" />
                            ) : (
                                <Icon1 name="send" size={25} color="grey" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    };

    return (
        <>
          <FlatList
            style={styles.root}
            data={data}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            keyExtractor={item => {
              return item._id;
            }}
            renderItem={item => {
              const Notification = item.item;
              return (
                <View style={styles.container}>
                  <TouchableOpacity onPress={() => {}}>
                    <Image
                      style={styles.image}
                      source={{uri:  BaseURL + Notification.user.avatar.fileName}}
                    />
                  </TouchableOpacity>
                  <View style={styles.content}>
                    <View style={styles.contentHeader}>
                      <Text style={styles.name}>{Notification.user.username}</Text>
                      <Text style={styles.time}>{TimeUtility.getTimeStr(new Date(Notification.createdAt))}</Text>
                    </View>
                    <Text rkType="primary3 mediumLine">{Notification.content}</Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
							<View style={{ }}>
								<Text style={{
									 
										fontSize: 20,
										paddingLeft: 16,
										paddingRight: 16,
										color: '#333333',
										marginTop: 12,
										marginBottom: 4,
										textAlign: 'center',
									
								}}>
									Chưa có bình luận nào! Hãy là người bình luận đầu tiên.
								</Text>
							</View>
						}
          />
          {MyComment()}
        </>
    );
}

const styles = StyleSheet.create({
    root: {
      backgroundColor: '#ffffff',
      marginTop: 10,
    },
    container: {
      paddingLeft: 19,
      paddingRight: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    content: {
      marginLeft: 16,
      flex: 1,
    },
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },
    image: {
      width: 45,
      height: 45,
      borderRadius: 20,
      marginLeft: 20,
    },
    time: {
      fontSize: 11,
      color: '#808080',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    
    istruction: {
      backgroundColor: '#f9fafc',
      width: '100%',
      height: 40,
      paddingTop: 10,
      paddingLeft: 12,
    },
    button: {
      width: '100%',
      height: 40,
      alignSelf: 'center',
      borderRadius: 20,
    },
    wrapLoginButton: {
      width: '50%',
      marginTop: 'auto',
      alignSelf: 'center',
      borderRadius: 20,
    },
    centerView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationText: {
      color: '#f00',
      left: 20,
    },
    textFieldLable: {
      paddingTop: 3,
    },
    postAndComment: {
      flex: 1,
    },
    post: {
      borderBottomColor: '#ebebeb',
      borderBottomWidth: 1,
    },
    comment: {
      flex: 1,
    },
    footer: {
      flex: 1,
    },
    enterComment: {
      padding: 10,
      height: 50,
      backgroundColor: '#fff',
      fontSize: 18,
      marginTop: 3,
    },
    avatar: {
      flex: 2,
    },
    commentUser: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    commentContent: {
      paddingTop: 4,
      fontSize: 14,
      color: 'black',
    },
    commentDate: {
      paddingTop: 4,
      fontSize: 13,
      color: 'gray',
    },
    enterCommentText: {
      flex: 1,
    },
    sendButton: {
      alignSelf: 'center',
      margin: 10,
    },
    describeText: {
      fontSize: 14,
      paddingLeft: 16,
      paddingRight: 16,
      color: '#778993',
      marginTop: 12,
      marginBottom: 12,
    },
    myComment: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e6e6e6',
    },
  });