import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, View, TouchableHighlight, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native'

import IconUnCheck from 'react-native-vector-icons/MaterialIcons';
import IconCheck from 'react-native-vector-icons/AntDesign';
import { TextField } from 'rn-material-ui-textfield';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TimeUtility } from '../../utils/TimeUtility';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../api/client';
import { AuthContext } from '../../components/context';

export default function ChangeInfo({ navigation, route }) {
  const { username, getGender, birthday} = route.params
  
  const context = React.useContext(AuthContext);
  const [name, setName] = useState(username);
  const [hasModify, setHasModify] = useState(false);
  const [gender, setGender] = useState(getGender);
  const [isShowFullNameClear, setShowFullNameClear] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dob, setDob] = useState(birthday);

  const onchangeFullName = (text) => {
    if (!hasModify) {
      setHasModify(true);
    }
    setName(text);
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDatePicker = (date) => {
    setDob(date);
    if (!hasModify) {
      setHasModify(true);
    }
    hideDatePicker();
  };

  let inputHeaderStyle = { fontSize: 12, color: "#a0a0a0" };
  let inputHeaderSelectedStyle = { fontSize: 12, color: "#6F3DD2" };

  const saveUser = async () => {
    try {
      if (name) {
        let body = {
          username: name,
          gender: gender,
          birthday: dob,
        }
        // if(needChangeAvatar){
        //     body.avatar = "data:image;base64," + currAvatar.base64;
        // }

        let res = await apiClient.post("users/edit",
          {
            username: name,
            gender: gender,
            birthday: dob,
          },
          {
            headers: {
              authorization: "token " + context.loginState.userToken,
            }
          }
        );    

        if (res.status == 200) {
                  Alert.alert('Thành công!', 'Đã cập nhật thông tin', [
                    { text: 'Okay', onPress: () => navigation.navigate('Trang cá nhân') }
                  ]);
                }
      } else {
        if(name){
          console.log(e.message)
          navigation.navigate("NoInternet")
          return
        }
        Alert.alert("Thất bại", "Vui lòng nhập đầy đủ họ tên", [{ text: "OK" }]);
        
      }
    } catch (err) {
      console.log(e)
    navigation.navigate("NoInternet")
    }
  };

  const enableColor = ["#0085ff", "#05adff"];
  const disableColor = ["#c0d3e2", "#c0d3e2"];
  return (

    <View flex={1} style={{ marginLeft: 8, marginTop: 4, marginLeft: 12 }}>
      <View style={{ marginLeft: 4, marginRight: 8 }}>
        <TextField
          label='Tên đầy đủ'
          labelTextStyle={styles.textFieldLable}
          fontSize={18}
          contentInset={{ top: 5, input: 10, right: 54 }}
          tintColor="#6F3DD2"
          value={name}
          onChangeText={text => onchangeFullName(text)}
        />
        <View style={{ position: "absolute", top: 26, right: 0 }}>
          <View style={{ flexDirection: "row" }}>
            <IconCheck name="edit" size={20} color="grey" style={{ marginLeft: 6 }} />
          </View>

        </View>
      </View>
      <Text>{isShowFullNameClear}</Text>
      <View style={{ marginLeft: 4, marginRight: 8, flexDirection: "row", height: 48 }}>
        <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center" }}
          onPress={() => {
            if (gender !== "male") {
              if (!hasModify) {
                setHasModify(true);
              }
              setGender("male");
            }
          }}
        >
          {gender == "male" ? <IconCheck name="checkcircle" size={30} color="#6F3DD2" /> : <IconUnCheck name="radio-button-unchecked" size={30} color="#6F3DD2" />}
          <Text style={{ fontSize: 18, marginLeft: gender == "male" ? 5 : 7, alignSelf: "center" }}>Nam</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center", marginLeft: 54 }}
          onPress={() => {
            if (gender !== "female") {
              if (!hasModify) {
                setHasModify(true);
              }
              setGender("female");
            }
          }}
        >
          {gender == "female" ? <IconCheck name="checkcircle" size={30} color="#6F3DD2" /> : <IconUnCheck name="radio-button-unchecked" size={30} color="#6F3DD2" />}
          <Text style={{ fontSize: 18, marginLeft: gender == "female" ? 5 : 7, alignSelf: "center" }}>Nữ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center", marginLeft: 54 }}
          onPress={() => {
            if (gender !== "secret") {
              if (!hasModify) {
                setHasModify(true);
              }
              setGender("secret");
            }
          }}
        >
          {gender == "secret" ? <IconCheck name="checkcircle" size={30} color="#6F3DD2" /> : <IconUnCheck name="radio-button-unchecked" size={30} color="#6F3DD2" />}
          <Text style={{ fontSize: 18, marginLeft: gender == "secret" ? 5 : 7, alignSelf: "center" }}>Secret</Text>
        </TouchableOpacity>
      </View>

      <View style={{ borderBottomWidth: 1, borderBottomColor: "#cfd0cf", marginBottom: 12 }}></View>
      <View style={{ marginLeft: 4, marginRight: 8 }}>

        <Text style={isDatePickerVisible ? inputHeaderSelectedStyle : inputHeaderStyle}>Ngày sinh</Text>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setDatePickerVisibility(true);
          }}
          style={{ flexDirection: "row" }}
        >

          <Text style={{ fontSize: 18, paddingTop: 3, paddingBottom: 10 }}>
            {dob ? TimeUtility.dateToDDMMYYYY(new Date(dob)) : "Chưa có"}
          </Text>
          <View style={{ top: 4, right: 0, marginLeft: "auto" }}>
            <View style={{ flexDirection: "row" }}>
              <IconCheck name="edit" size={20} color="grey" style={{ marginLeft: 6 }} />
            </View>

          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDatePicker}
          onCancel={hideDatePicker}
          date={dob ? new Date(dob) : new Date()}
          confirmTextIOS="Chọn"
          cancelTextIOS="Huỷ"
        />

      </View>
      <TouchableOpacity
        style={styles.wrapButton}
        activeOpacity={0.8}
        underlayColor="#3f3f3f"
        onPress={() => saveUser()}
        disabled={!hasModify}
      >



        <LinearGradient
          colors={hasModify ? enableColor : disableColor}

          style={styles.button
          }
        >
          <View style={styles.centerView} >
            <Text style={{ color: 'white', fontWeight: '500', marginTop: 8 }}>Cập nhật</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  textFieldLable: {
    paddingTop: 3
  },
  wrapButton: {
    flex: 1,
    width: '50%',
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 20,
  },
  centerView: {
    // flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    borderRadius: 20,
  },
});

