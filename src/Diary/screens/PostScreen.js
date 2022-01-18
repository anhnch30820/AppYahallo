import React from 'react'

import { StatusBar, ScrollView, FlatList, Text, Dimensions, View, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import Avatar from '../components/Avatar'
import AppBar from '../components/AppBar'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import apiClient from '../../api/client'
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
import { TimeUtility } from '../../utils/TimeUtility'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { BottomSheet, ListItem } from 'react-native-elements';
import { BaseURL } from '../../utils/Constants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'


export default PostScreen = ({ navigation, route }) => {
	const [dataPost, setDataPost] = useState()
	const [userInfo, setDataUser] = useState();
	const [isLoading, setLoading] = useState(true);
	const [del, setDel] = useState(false)
	const isFocused = useIsFocused();

	const getAll = async () => {
		const userToken = await AsyncStorage.getItem('userToken');
		let axiosConfig = {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				authorization: "token " + userToken,
			}
		};
		try {
			const response = await apiClient.get('/posts/list', axiosConfig)

			if (response.data) {
				let data = response.data.data;
				data = await data.sort(function (a, b) {
					return new Date(b.createdAt) - new Date(a.createdAt);
				});

				return data;
			}

		} catch (error) {
			console.log('Error when getting posts', error.message)
            navigation.navigate("NoInternet")
		}
	}
	const getUser = async () => {
		const userToken = await AsyncStorage.getItem('userToken');
		let axiosConfig = {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				authorization: "token " + userToken,
			}
		};
		try {
			const response = await apiClient.get('/users/show', axiosConfig)
			if (response.data) {
				// console.log("abc, ", response.data.data._id)
				return response.data.data;
			}

		} catch (error) {
			console.log('Error when getting user', error.message)
			navigation.navigate("NoInternet")
		}
	}
	const [state, setState] = useState({});
   
	useEffect(() => {


		setTimeout(() => { setLoading(false) }, 1000)

		getAll().then(setDataPost)


		getUser().then(setDataUser)
		return () => {
			setState({}); // This worked for me
		}
	}, [isFocused, del]);

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
			navigation.navigate("NoInternet")
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
			navigation.navigate("NoInternet")
		}
	}

	const [isVisible2, setIsVisible2] = useState(false);
	const [listAnother, setlistAnother] = useState([]);

	const TimeLineAnother = (data) => {

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
					navigation.navigate("Báo cáo xấu", {postId: data._id}), setIsVisible2(false)
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
			const response = await apiClient.post(`/postLike/action/${postId}`, null, axiosConfig)

			if (response.status == 200) {
				// console.log("like, ",response.data.data)
				setDel(!del)
				return response.data.data;
			}

		} catch (error) {
			console.log('Error when like post', error.message)
			navigation.navigate("NoInternet")
			return [];
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
		<>


			<SafeAreaView style={styles.Container}>
				{/* <AppBar /> */}

				{userInfo &&

					<View style={styles.Container11}>
						<View style={styles.Row11}>
							<Avatar source={userInfo.avatar.fileName} />
							<TouchableOpacity style={styles.Input11} onPress={() => navigation.navigate('upPost')}>
								<Text style={styles.MenuText21}>
									Hôm nay bạn thế nào
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.Divider11} />
						<View style={styles.Row11}>
							<TouchableOpacity style={styles.Menu11} onPress={() => navigation.navigate('upPost')}>
								<MaterialIcons
									name='photo-size-select-actual'
									size={20}
									color='#4CAF50'
								/>

								<Text style={styles.MenuText11}>Đăng ảnh</Text>
							</TouchableOpacity>
							<View style={styles.Separator11} />
							<TouchableOpacity style={styles.Menu11} onPress={() => navigation.navigate('upPost')}>
								<Ionicons name='ios-videocam' size={22} color='#F44337' />
								<Text style={styles.MenuText11}>Đăng video</Text>
							</TouchableOpacity>
							<View />
						</View>
					</View>


				}

				{dataPost &&
					<FlatList
						data={dataPost}
						keyExtractor={item => item._id}
						renderItem={({ item, index }) => (
							<View style={styles.Container2}>

								<View style={styles.Header}>
									<View style={styles.Row}>
										<Avatar
											source={item.author.avatar.fileName}
										/>
										<View style={{ paddingLeft: 10 }}>
											<TouchableOpacity onPress={() => {
												navigation.navigate("Trang cá nhân", {
													userId: item.author._id
												})
											}}>
												<Text style={styles.User}>{item.author.username}</Text>
											</TouchableOpacity>
											<View style={styles.Row}>
												<Text style={styles.Time}>{TimeUtility.getTimeStr(new Date(item.createdAt))}</Text>
											</View>
										</View>
									</View>
									<TouchableOpacity
										onPress={() => {
											userInfo._id === item.author._id ? TimeLineMe((dataPost[index])) : TimeLineAnother(dataPost[index])
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
					
					}
			</SafeAreaView>
		</>
	);

};


const styles = StyleSheet.create({
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



const Container11 = styled.View`
	width: 100%;
	height: 92px;
`
const Row11 = styled.View`
	flex-direction: row;
	background: #ffffff;
	width: 100%;
	padding: 0 11px;
	align-items: center;
`
const Input11 = styled.TouchableOpacity`
	height: 50px;
	width: 100%;
	padding: 0 8px;
`
const Divider11 = styled.View`
	width: 100%;
	height: 0.5px;
	background: #f0f0f0;
`
const Menu11 = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 42px;
`
const MenuText11 = styled.Text`
	padding-left: 11px;
	font-weight: 500;
	font-size: 12px;
`
const MenuText21 = styled.Text`
	padding-left: 11px;
	padding-top: 17px;
	font-weight: 500;
	font-size: 12px;
`
const Separator11 = styled.View`
	width: 1px;
	height: 26px;
	background: #f0f0f0;
`


