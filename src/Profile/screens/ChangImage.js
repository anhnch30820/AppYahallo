import React, { Fragment, Component } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';


export default class ChangeImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: ''
    }
  }

  Change = async (value) => {

    const userToken = await AsyncStorage.getItem('userToken');
    if (value == '1') {
      try {
        const response = await apiClient.post('/users/edit',
          {
            avatar: "data:image;base64," + this.state.data,
          },
          {
            headers: {
              authorization: "token " + userToken,
            }
          }
        );

        if (response.status == 200) {
          Alert.alert('Thành công!', 'Đã cập nhật ảnh đại diện', [
            { text: 'Okay', onPress: () => this.props.navigation.navigate('Trang cá nhân') }
          ]);
        }

        // }

      }
      catch (e) {
        Alert.alert('Thông báo!', 'Vui lòng chọn ảnh', [
          { text: 'Okay'}
        ]);
      }
    }
    if (value == '2') {
      try {

        const response = await apiClient.post('/users/edit',
          {
            cover_image: "data:image;base64," + this.state.data,
          },
          {
            headers: {
              authorization: "token " + userToken,
            }
          }
        );

        if (response.status == 200) {
          Alert.alert('Thành công!', 'Đã cập nhật ảnh bìa', [
            { text: 'Okay', onPress: () => this.props.navigation.navigate('Trang cá nhân') }
          ]);
        }

        // }

      }
      catch (e) {
        Alert.alert('Thông báo!', 'Vui lòng chọn ảnh', [
          { text: 'Okay'}
        ]);
      }
    }
  }



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
          data: response.assets[0].base64
        });
      }
    });

  }

  launchImageLibrary = () => {
    let options = {
      includeBase64: true,
      maxWidth: 400,
      maxHeight: 400,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {

        this.setState({
          data: response.assets[0].base64
        });
      }
    });

  }

  renderFileData() {
    if (this.state.data) {
      return <Image source={{ uri: `data:image/png;base64,${this.state.data}` }}
        style={styles.images}
      />
    } else {
      return null

    }
  }


  render() {

    const { navigation, route } = this.props;
    const { select } = route.params
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.ImageSections}>
              <View>
                {this.renderFileData()}
              </View>
            </View>

            <View style={styles.btnParentSection}>


              <TouchableOpacity onPress={this.launchCamera} style={styles.btnSection}  >
                <Text style={styles.btnText}>Chụp ảnh</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.launchImageLibrary} style={styles.btnSection}  >
                <Text style={styles.btnText}>Chọn ảnh từ thư viện</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.Change(select)} style={{
                width: 225,
                height: 50,
                backgroundColor: '#6F3DD2',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                marginBottom: 10, 
                marginTop: 20
              }}>
                <Text style={styles.btnText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },

  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 250,
    height: 250,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#6F3DD2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});