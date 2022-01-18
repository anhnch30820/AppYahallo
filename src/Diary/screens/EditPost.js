import styled from 'styled-components/native'
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet, ListItem } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Input = styled.TextInput`
	height: 200px;
	width: 100%;
	padding: 0 8px;
    textAlign: 'left';
`
import Ionicons from 'react-native-vector-icons/Ionicons'
const Container = styled.View`
	width: 100%;
	height: 58px;
	padding: 0 0;
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
	background: #6F3DD2;
`
const Text1 = styled.Text`
	color: #fff;
	font-size: 16px;
	font-weight: normal;
`
const Row = styled.View`
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
`
const Button = styled.TouchableOpacity`
	width: 42px;
	height: 42px;
	background: #6F3DD2;
	align-items: flex-start;
	justify-content: center;
	margin-left: 16px;
`

import React, { Fragment, Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { BaseURL } from '../../utils/Constants';


export default class EditPost extends Component {

  launchCamera = () => {
    let options = {
      includeBase64: true,
      maxWidth: 400,
      maxHeight: 400,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        this.setState({
          localPhotos: [...this.state.localPhotos, response.assets[0].base64],
          data: response.assets[0].base64
        });
      }
    });

  }

  launchImageLibrary = () => {
    let options = {
      includeBase64: true,
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {

        this.setState({
          localPhotos: [...this.state.localPhotos, response.assets[0].base64],
          data: response.assets[0].base64
        });
      }
    });

  }


  constructor(props) {
    super(props)
    this.state = {
      logs: 'ahihi',
      selectedPhotoIndex: 0,
      localPhotos: this.props.route.params?.img,
      described: this.props.route.params?.described,
      isVisible: false,
      data: '',
      post_id: this.props.route.params?.post_id,
    };

  }

  list = [

    {
      title: 'Chụp ảnh',
      onPress: () => {
        this.launchCamera()
        this.setState({
          isVisible: false
        })
      }

    },
    {
      title: 'Lấy ảnh từ thư viện',
      onPress: () => {
        this.launchImageLibrary()
        this.setState({
          isVisible: false
        })

      }
    },
    {
      title: 'Hủy',
      containerStyle: { backgroundColor: '#6F3DD2' },
      titleStyle: { color: 'white' },
      onPress: () => this.setState({
        isVisible: false
      }),
    },
  ];
  renderSelectPhotoControl = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select photos</Text>
        <ScrollView style={styles.photoList} horizontal={true}>
          <TouchableOpacity
            onPress={() => this.setState({
              isVisible: true
            })}
          >
            <View style={[styles.addButton, styles.photo]}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  editPost = async () => {
    const { localPhotos } = this.state;
    const images = localPhotos.map((image) => {
      // console.log(image)
      if(image?.fileName) return image._id
      else
      return "data:image/png;base64," + image
    })
    const userToken = await AsyncStorage.getItem('userToken');

    try {
      const response = await apiClient.post(`/posts/edit/${this.state.post_id}`, {
        described: this.state.described,
        images: images
      },
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            authorization: "token " + userToken,
          }
        })
       
      if (response.status == 200) {
        Alert.alert('Thành công!', 'Cập nhật bài viết thành công', [
          { text: 'Okay', onPress: () => this.props.navigation.navigate('post') }
        ]);
        
      }

    } catch (error) {
      console.log('Error when up post', error.message)
      return [];
    }


  }
  removeImage = (i) => {
    let images = Array.from(this.state.localPhotos);
    images.splice(i, 1);
    this.setState({ localPhotos: images });
  };
  render() {
    const { navigation, route } = this.props;

    return (
      <SafeAreaView>
        <Container>
          <Row>
            <Button onPress={() => navigation.navigate('post')}>
              <Ionicons name='arrow-back-outline' size={25} color='white' />
            </Button>
          </Row>
          <Row>
            <Button onPress={this.editPost}>
              <Text1>Done</Text1>
            </Button>
          </Row>
        </Container>
        <TextInput placeholder="Bạn đang nghĩ gì?"
          textAlignVertical='top' textAlign='left' style={styles.input}
          onChangeText={text => this.setState({ described: text })}
          value={this.state.described}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {this.renderSelectPhotoControl(this.state.localPhotos)}

          </View>
        </ScrollView>
        <View >
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.state.localPhotos}
            renderItem={({ item, index }) => (
              item?._id ?
            (
              <View>
              <Image source={{ uri: BaseURL + item.fileName }}
              style={{
                width: 100,
                height: 100,
                borderColor: 'black',
                borderWidth: 1,
                marginHorizontal: 3
              }}

            /> 
            <TouchableOpacity style={{ position: "absolute", top: 5, right: 5 }} onPress={() => {this.removeImage(index)}}>
            <Ionicons name='close' size={25} color='white' />
            </TouchableOpacity>
            </View>
            )
            : (
              <View>
              <Image source={{ uri: `data:image/png;base64,${item}` }}
            style={{
              width: 100,
              height: 100,
              borderColor: 'black',
              borderWidth: 1,
              marginHorizontal: 3
            }}

          />
          <TouchableOpacity style={{ position: "absolute", top: 5, right: 5 }} onPress={() => {}}>
            <Ionicons name='close' size={25} color='white' />
            </TouchableOpacity>
          </View>
            )
          )
            }
            horizontal={true}
          />
        </View>
        <BottomSheet modalProps={{}} isVisible={this.state.isVisible}>
          {this.list.map((l, i) => (
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
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  section: {
    backgroundColor: Colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  addPhotoTitle: {

    fontSize: 15,

    fontWeight: 'bold'
  },
  photoList: {
    height: 70,
    marginTop: 15,
    marginBottom: 15,
    marginRight: 10
  },
  photo: {
    marginRight: 10,
    width: 70,
    height: 70,
    borderRadius: 10
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3399cc'
  },
  photoIcon: {
    width: 50,
    height: 50
  },
  addButtonContainer: {
    padding: 15,
    justifyContent: 'flex-end'
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 48
  },
  input: {
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

