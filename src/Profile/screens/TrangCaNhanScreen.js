import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, ImageBackground, Image, FlatList, Pressable, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AuthContext } from "../../components/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "../../api/client";
import { BaseURL } from "../../utils/Constants";
import { useIsFocused } from '@react-navigation/native';
import { TimeUtility } from "../../utils/TimeUtility";
import { BottomSheet, ListItem } from 'react-native-elements';
const { width } = Dimensions.get('window');
import Avatar from "../../Diary/components/Avatar";
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components/native'
export default function TrangCaNhanScreen({ navigation, route }) {


    const [dataInfo, setDataInfo] = useState();
    const [dataPost, setDataPost] = useState();
    const [del, setDel] = useState(false)

    const [state, setState] = useState({});

    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [userId1, setUserId1] = useState();


    const GetMe = async () => {
        const userToken = await AsyncStorage.getItem('userToken');

        let userId = await AsyncStorage.getItem('userId');
        setUserId1(userId)

        if (route.params?.userId)
            userId = route.params?.userId
        console.log(userId)
        try {

            const response = await apiClient.get(`/users/show/${userId}`,

                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            // console.log(response)
            if (response.status == 200) {
                // console.log(response.data)
                return response.data.data
            }

            // }

        }
        catch (e) {
            console.log(e)
            navigation.navigate("NoInternet")
        }
    }

    const listPostOfMe = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        if (route.params?.userId) {
            userId = route.params?.userId

        }
        try {
            console.log("gaga")
            const response = await apiClient.get(`/posts/list/?userId=${userId}`,
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );
            if (response.status == 200) {
                console.log(response.data.data)

                return response.data.data
            }

            // }

        }
        catch (e) {
            console.log(e.message)
            navigation.navigate("NoInternet")
        }

    }
    const [isVisibleCover, setIsVisibleCover] = useState(false);
    const [isVisibleAvatar, setIsVisibleAvatar] = useState(false);
    const listCover = [

        {
            title: 'Xem ảnh bìa', onPress: () => {
                navigation.navigate("Xem ảnh", {
                    img: dataInfo.cover_image.fileName
                }), setIsVisibleCover(false)
            }

        },
        {
            title: 'Thay đổi ảnh bìa', onPress: () => {
                navigation.navigate("ChangeImageLib", {
                    select: '2'
                }), setIsVisibleCover(false)
            }
        },
        {
            title: 'Hủy',
            containerStyle: { backgroundColor: '#6F3DD2' },
            titleStyle: { color: 'white' },
            onPress: () => setIsVisibleCover(false),
        },
    ];
    const listAvatar = [

        {
            title: 'Xem ảnh đại diện', onPress: () => {
                navigation.navigate("Xem ảnh", {
                    img: dataInfo.avatar.fileName
                }), setIsVisibleAvatar(false)
            }

        },
        {
            title: 'Thay đổi ảnh đại diện', onPress: () => {
                navigation.navigate("ChangeImageLib", {
                    select: '1'
                }), setIsVisibleAvatar(false)
            }
        },
        {
            title: 'Hủy',
            containerStyle: { backgroundColor: '#6F3DD2' },
            titleStyle: { color: 'white' },
            onPress: () => setIsVisibleAvatar(false),
        },
    ];



    const deletePost = async postId => {
        const userToken = await AsyncStorage.getItem('userToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                authorization: "token " + userToken,
            }
        };
        try {
            const response = await apiClient.get(`/posts/delete/${postId}`, axiosConfig)
            // response.data
            if (response.status == 200) {
                setTimeout(() => {
                    Alert.alert('Thành công!', 'Xóa thành công', [
                        {
                            text: 'Okay',
                        }
                    ]);
                }, 500)

                setDel(!del)
                // setLoading(true)



            }

        } catch (error) {
            console.log('Error when deleting posts', error.message)
        }
    }

    const [isVisible1, setIsVisible1] = useState(false);
    const [listMe, setlistMe] = useState([]);

    const TimeLineMe = (data) => {
        // console.log("1234", data.described)
        setIsVisible1(true)
        setlistMe([

            {
                title: 'Xem ảnh', onPress: () => {
                    navigation.navigate("ViewImageTimeLine", {
                        img: data.images
                    }), setIsVisible1(false)
                }

            },
            {
                title: 'Chỉnh sửa bài viết', onPress: () => {
                    navigation.navigate("EditPost", {
                        described: data.described,
                        img: data.images,
                        post_id: data._id
                    }), setIsVisible1(false)
                }
            },
            {
                title: 'Xóa bài viết', onPress: () => {

                    Alert.alert(
                        'Thông báo', 'Bạn có chắc chắn muốn xóa bài viết này',
                        [
                            { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Có', onPress: () => deletePost(data._id), }
                        ]
                    );


                    setIsVisible1(false)

                }
            },
            {
                title: 'Hủy',
                containerStyle: { backgroundColor: '#6F3DD2' },
                titleStyle: { color: 'white' },
                onPress: () => setIsVisible1(false),
            },
        ])

    }

    const setBlock = async (id) => {

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
                setTimeout(() => {
                    Alert.alert('Thành công!', 'Chặn thành công', [
                        {
                            text: 'Okay',
                        }
                    ]);
                }, 500)

                setDel(!del)
                // setLoading(true)

            }
        }
        catch (e) {
            console.log(e.message)
        }
    }

    const [isVisible2, setIsVisible2] = useState(false);
    const [listAnother, setlistAnother] = useState([]);

    const TimeLineAnother = (data) => {
        console.log("1234", data)

        setIsVisible2(true)
        setlistAnother([

            {
                title: 'Xem ảnh', onPress: () => {
                    navigation.navigate("ViewImageTimeLine", {
                        img: data.images
                    }), setIsVisible2(false)
                }

            },
            {
                title: 'Báo cáo xấu', onPress: () => {
                    navigation.navigate("EditPost", {
                        described: data.described,
                        img: data.images,
                        post_id: data._id
                    }), setIsVisible2(false)
                }
            },
            {
                title: 'Chặn xem nhật ký', onPress: () => {
                    Alert.alert(
                        'Thông báo', 'Bạn có chắc chắn muốn chặn xem nhật ký người này',
                        [
                            { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Có', onPress: () => setBlock(data.author._id), }
                        ]
                    );

                    setIsVisible2(false)
                }
            },

            {
                title: 'Hủy',
                containerStyle: { backgroundColor: '#6F3DD2' },
                titleStyle: { color: 'white' },
                onPress: () => setIsVisible2(false),
            },
        ])

    }

    const likePost = async (postId) => {

        const userToken = await AsyncStorage.getItem('userToken');
        let axiosConfig = {
            headers: {
                authorization: "token " + userToken,
            }
        };
        try {
            console.log('postId', postId)
            const response = await apiClient.post(`/postLike/action/${postId}`, null, axiosConfig)

            if (response.status == 200) {
                // console.log("like, ",response.data.data)
                setDel(!del)
                // return response.data.data;
            }

        } catch (error) {
            console.log('Error when like post', error.message)
            return [];
        }
    }


    useEffect(() => {
        // setLoading(true)
        setTimeout(() => { setLoading(false) }, 2000)
        GetMe().then(setDataInfo)
        listPostOfMe().then(setDataPost)
        return () => {
            setState({}); // This worked for me
        };

    }, [isFocused, del]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }

    //VirtualizedLists should never be nested inside plain ScrollViews with the same orientation
    const getHeader = () => {
        return (
            <>
                {dataInfo &&
                    <View>

                        <TouchableOpacity
                            //  onPress={() => navigation.navigate("ChangeCover", {
                            //     img: data.cover_image.fileName,
                            //     select: '2'

                            // })}
                            onPress={() => setIsVisibleCover(true)}
                        >


                            <ImageBackground
                                style={styles.backgroundImage}
                                source={{ uri: BaseURL + dataInfo.cover_image.fileName }}
                            >

                                <TouchableOpacity
                                    // onPress={() => navigation.navigate("ChangeAvatar", {
                                    //     img: data.avatar.fileName,
                                    //     select: '1'

                                    // })}
                                    onPress={() => setIsVisibleAvatar(true)}
                                >
                                    <Image
                                        style={styles.avatar}
                                        source={{ uri: BaseURL + dataInfo.avatar.fileName }}
                                    />
                                </TouchableOpacity>
                            </ImageBackground>
                            <Text style={{ margin: 10, fontSize: 20, alignSelf: 'center' }}>{
                                dataInfo.username
                                // context.loginState.username
                            }</Text>
                        </TouchableOpacity>



                    </View>
                }
            </>
        )
    }
    return (
        <Container>
            {
                route.params?.userId ? null :
                    <View style={{ backgroundColor: "#6f3dd2", flexDirection: 'row', justifyContent: "space-between", height: 40, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, marginLeft: 10 }}>Trang cá nhân</Text>
                        <>
                            {dataInfo &&
                                <Pressable
                                    style={{ marginRight: '1%' }}
                                    onPress={() => navigation.navigate("Cài đặt", {
                                        username: dataInfo.username,
                                        getGender: dataInfo.gender,
                                        birthday: dataInfo.birthday,


                                    })}
                                >
                                    <FontAwesome5 name={'cog'} size={25} color={'#ffffff'} />
                                </Pressable>

                            }
                        </>

                    </View>
            }
            <FlatList
                ListHeaderComponent={getHeader}
                keyExtractor={(item, index) => index.toString()}
                data={dataPost}
                renderItem={({ item, index }) => (


                    <View style={styles.Container2}>

                        <View style={styles.Header}>
                            <View style={styles.Row}>
                                <Avatar
                                    source={item.author.avatar.fileName}
                                />
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={styles.User}>{item.author.username}</Text>
                                    <View style={styles.Row}>
                                        <Text style={styles.Time}>{TimeUtility.getTimeStr(new Date(item.createdAt))}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    userId1 === item.author._id ? TimeLineMe((dataPost[index])) : TimeLineAnother(dataPost[index])
                                }}
                            >
                                <Entypo
                                    name='dots-three-horizontal'
                                    size={15}
                                    color='#222121'
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.Post}>
                            {item.described}
                        </Text>
                        <FlatList
                            data={item.images}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <Image source={{ uri: BaseURL + item.fileName }} style={styles.Photo} />
                            )}

                        />
                        <View style={styles.Footer}>
                            <View style={styles.FooterCount}>
                                <View style={styles.Row}>
                                    <TouchableOpacity style={styles.Button}
                                        onPress={() => {
                                            likePost(item._id)
                                        }}>
                                        <AntDesign
                                            name={item.isLike ? "heart" : "hearto"}
                                            size={24}
                                            color={item.isLike ? "red" : "gray"} />
                                    </TouchableOpacity>
                                    <Text style={styles.TextCount}>{item.like.length}</Text>
                                    <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate("Comment", {
                                        postId: item._id
                                    })}>
                                        <MaterialCommunityIcons name="comment-multiple-outline" size={24} color="gray" />
                                    </TouchableOpacity>
                                    <Text style={styles.TextCount}>{item.countComments}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.BottomDivider} />
                        <BottomSheet modalProps={{}} isVisible={isVisible1}>
                            {listMe.map((l, i) => (
                                <ListItem
                                    key={i}
                                    containerStyle={l.containerStyle}
                                    onPress={l.onPress}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            ))}
                        </BottomSheet>
                        <BottomSheet modalProps={{}} isVisible={isVisible2}>
                            {listAnother.map((l, i) => (
                                <ListItem
                                    key={i}
                                    containerStyle={l.containerStyle}
                                    onPress={l.onPress}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            ))}
                        </BottomSheet>

                    </View>

                )}
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
                            Chưa có bài đăng nào!
                        </Text>
                    </View>
                }
            />
            <BottomSheet modalProps={{}} isVisible={isVisibleCover}>
                {listCover.map((l, i) => (
                    <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                    >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
            <BottomSheet modalProps={{}} isVisible={isVisibleAvatar}>
                {listAvatar.map((l, i) => (
                    <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                    >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
            <BottomSheet modalProps={{}} isVisible={isVisible1}>
                {listMe.map((l, i) => (
                    <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                    >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
            <BottomSheet modalProps={{}} isVisible={isVisible2}>
                {listAnother.map((l, i) => (
                    <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                    >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

        </Container>
    );
}



const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        height: '75%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    avatar: {
        height: 100,
        aspectRatio: 1,
        borderRadius: 100,
        marginTop: '30%',
    },
    wall: {
        flex: 2,
        alignItems: 'center',
    },
    body: {
        margin: 3,
        padding: 3,
        backgroundColor: '#FFFFFF',
    },
    date: {
        fontSize: 15,
        color: '#b5b5b5',
    },
    caption: {
        fontSize: 15,
    },
    image: {
        height: 300,
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    likeButton: {
        marginLeft: 1,
        marginRight: 15,
        marginBottom: 8,
    },
    post: {
        flex: 1,
        flexDirection: 'row',
    },
    Container: {
        flex: 1
    },
    Container2: {
        flex: 1,
        backgroundColor: "#fff",
        marginLeft: 10,
        marginRight: 10
    },
    Header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,

    },
    Row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    User: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#222121'
    },
    Time: {
        fontSize: 9,
        color: '#747476'
    },
    Post: {
        fontSize: 12,
        color: '#222121',
        lineHeight: 16,
        marginTop: 5,
        marginLeft: 10
    },
    Photo: {
        marginTop: 9,
        width: width,
        height: 300
    },
    Footer: {
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 0,
        paddingRight: 0
    },
    FooterCount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 0,
        paddingRight: 0
    },
    TextCount: {
        fontSize: 11,
        color: '#424040',
        marginRight: 24,
    },
    Button: {
        flexDirection: 'row',
        marginRight: 6,
        marginLeft: 10
    },
    BottomDivider: {
        width: '100%',
        height: 9,
        backgroundColor: '#f0f2f5'
    },



    Container1: { width: '100%', height: 92 },
    Row1: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        width: '100%',
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 11,
        paddingRight: 11,
        alignItems: 'center',
    },
    Input1: {
        height: 50,
        width: '100%',
        paddingRight: 8,
        paddingLeft: 8,
    },
    Divider1: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    Menu1: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
    },
    MenuText1: {
        paddingLeft: 11,
        fontWeight: '500',
        fontSize: 12,
    },
    Separator1: {
        width: 10,
        height: 26,
        backgroundColor: '#f0f0f0',
    },
    BottomDivider1: {
        width: '100%',
        height: 9,
        backgroundColor: '#f0f2f5',
    },
    Container11: {
        width: '100%',
        height: 92,
        marginTop: 10
    },
    Row11: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        width: '100%',
        paddingLeft: 11,
        paddingRight: 11,
        alignItems: 'center',
    },
    Input11: {
        height: 50,
        width: '100%',
        paddingRight: 8,
        paddingLeft: 8,
    },
    Divider11: {
        width: '100%',
        height: 0.5,
        backgroundColor: '#f0f0f0',
    },
    Menu11: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
    },
    MenuText11: {
        paddingLeft: 11,
        fontWeight: '500',
        fontSize: 12,
    },
    MenuText21: {
        paddingLeft: 11,
        paddingTop: 17,
        fontWeight: '500',
        fontSize: 12,
    },
    Separator11: {
        width: 1,
        height: 26,
        backgroundColor: '#f0f0f0',
    },
    BottomDivider11: {
        width: '100%',
        height: 9,
        backgroundColor: '#f0f2f5',
    },
})

const Container = styled.SafeAreaView`
	flex: 1;
`
const Container2 = styled.View`
	flex: 1;
	background-color: #fff;
`
const Header = styled.View`
	height: 50px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 6px;
	padding: 0 11px;
`
const Row = styled.View`
	align-items: center;
	flex-direction: row;
`
const User = styled.Text`
	font-size: 12px;
	font-weight: bold;
	color: #222121;
`
const Time = styled.Text`
	font-size: 9px;
	color: #747476;
`
const Post = styled.Text`
	font-size: 12px;
	color: #222121;
	line-height: 16px;
	padding: 0 11px;
`
const Photo = styled.Image`
	margin-top: 9px;
	width: ${width}px;
	height: 300px;
`
const Footer = styled.View`
	padding: 0 11px;
`
const FooterCount = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 9px 0;
`
const IconCount = styled.View`
	background: #fff;
	width: 25px;
	height: 20px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin-right: 6px;
`
const TextCount = styled.Text`
	font-size: 11px;
	color: #424040;
	margin-right: 24px;
`
const Separator = styled.View`
	width: 100%;
	height: 1px;
	background: #f9f9f9;
`
const FooterMenu = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 9px 0;
`
const Button = styled.TouchableOpacity`
	flex-direction: row;
	margin-right: 6px;
`
const Icon = styled.View`
	margin-right: 6px;
`

const BottomDivider = styled.View`
	width: 100%;
	height: 9px;
	background: #f0f2f5;
`