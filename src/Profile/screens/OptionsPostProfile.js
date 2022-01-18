import React,  { useContext, useEffect, useRef, useState } from 'react'
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native'
import {  Image as Divider } from "react-native-elements";

export default function OptionsPostProfile ({navigation, route}) {
 

  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
        // console.log('response data', JSON.stringify(response.assets[0].fileName));
        
      }
    });

  }
  // refAvatarImageOption.current.close();
    return (    
      
      <View
        style={{
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(240,240,240,1)",
            borderTopLeftRadius: 15,
            borderTopEndRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomStartRadius: 15,
            justifyContent: "center",
          }}
        >
          
          <Divider orientation="horizontal" />
          <TouchableHighlight
            style={styles.reportOption}
            onPress={() => {
              navigation.navigate("Xem ảnh", {
                img: img
              })
            }}
            activeOpacity={0.99}
            underlayColor="#989898"
          >
            <Text style={styles.reportOptionText}>Xem ảnh</Text>
          </TouchableHighlight>
          <Divider orientation="horizontal" />
          
          <Divider orientation="horizontal" />
          <TouchableHighlight
            style={styles.reportOption}
            onPress={() => {
              navigation.navigate("ChangeImage", {
                select: select
              })
            }}
            activeOpacity={0.99}
            underlayColor="#989898"
          >
            <Text style={styles.reportOptionText}>Chỉnh sửa bài viết</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.reportOption}
            onPress={() => {
              navigation.navigate("ChangeImage", {
                select: select
              })
            }}
            activeOpacity={0.99}
            underlayColor="#989898"
          >
            <Text style={styles.reportOptionText}>Xóa bài viết</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 15,
            borderTopEndRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomStartRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={() => navigation.goBack()}
          activeOpacity={0.999}
          underlayColor="#989898"
        >
          <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
            Hủy
          </Text>
        </TouchableHighlight>
      </View>
        
    )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    minHeight: "100%",
    flexDirection: "column",
  },
  input: {
    color: "white",
    fontSize: 16,
    marginLeft: 16,
    width: "100%",
    marginTop: 4,
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },
  story: {
    backgroundColor: "#fff",
  },
  createPostArea: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "row",
  },
  avatar: {
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 9,
  },

  storyImage: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    width: 75,
    height: 100,
    borderRadius: 10,
    borderColor: "#dedede",
    borderWidth: 2,
  },
  mediaArea: {
    flexDirection: "row",
    marginTop: 0,
    backgroundColor: "white",
    height: 43,
  },
  mediaPost: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#dedede",
    borderWidth: 0.5,
    alignItems: "center",
  },
  iconNotice: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: "auto",
    marginRight: 8,
    marginTop: 2,
  },
  iconNewPost: {
    width: 24,
    height: 24,
    color: "black",
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 2,
  },
  iconBack: {
    width: 20,
    height: 20,
    color: "white",
  },
  iconSearch: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: 10,
    marginTop: 2,
  },
  iconImage: {
    width: 20,
    height: 20,
    color: "green",
    marginLeft: "auto",
  },
  iconVideo: {
    width: 20,
    height: 20,
    color: "red",
    marginLeft: "auto",
  },
  iconAlbum: {
    width: 20,
    height: 20,
    color: "blue",
    marginLeft: "auto",
  },
  describeText: {
    fontSize: 14,
    paddingLeft: 16,
    paddingRight: 16,
    color: "#778993",
    marginTop: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  reportOption: {
    alignItems: "center",
    justifyContent: "center",
    height: 55,
  },
  reportOptionText: {
    color: "#0085ff",
    fontSize: 20,
    fontWeight: "400",
  },
  info: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
  },
  infoTitle: {
    width: 120,
  },
});

