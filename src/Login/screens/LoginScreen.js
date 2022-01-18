import React, { useMemo } from "react";
import { Component, useState } from "react";
import {
  Text, View, TextInput, Keyboard, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, Alert
} from "react-native";
// import Icon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/AntDesign';
import { AuthContext } from "../../components/context";
import { Formik } from 'formik';
import * as Yup from 'yup';
import apiClient from "../../api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon1 from 'react-native-vector-icons/Entypo';

export default function Login({ navigation }) {
  const [hidePass, setHidePass] = useState(true);

  const validationSchema = Yup.object({
    phonenumber: Yup.string().trim()
      .length(10, 'Invalid phonenumber!')
      .required('Phonenumber is required!')
      .test('Invalid phone', 'Invalid phonenumber!', (val) => {
        try { return val[0] == 0; }
        catch (e) {

        }
      })
    ,
    password: Yup.string()
      .trim()
      .min(6, 'Password is too short!')
      .max(10, 'Password is too long!')
      .required('Password is required!')
      .notOneOf([Yup.ref('phonenumber'), null], "SĐT và mật khẩu không được trùng nhau!"),
  });

  const userInfo = {
    phonenumber: '0100000001',
    password: '123456'
  };
  // const { signIn } = React.useContext(AuthContext);
  const context = React.useContext(AuthContext)

  const login = async (values) => {
    try {
      const res = await apiClient.post('/users/login', {
        ...values,
      });
      if (res.status == 200) {

        context.dispatch({
          type: 'LOGIN', userToken: res.data.token
          // , username: res.data.data.username, userId :res.data.data.id
        })

        const userToken = res.data.token;
        const userId = res.data.data.id;
        const username = res.data.data.username;
        try {

          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('userId', userId);
          await AsyncStorage.setItem('username', username);

        } catch (e) {
          console.log(e);
        }
      }
    }
    catch (e) {
      if (e.response && e.response.status == 400) {
        console.log(e.response.data.message)
        Alert.alert('Thông báo!', 'Tài khoản hoặc mật khẩu không chính xác.', [
          { text: 'Okay' }
        ]);
  
        return;
    }
    console.log(e.message)
    navigation.navigate("NoInternet")
      
    }
  }
  return (
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={login}
      >
        {({
          handleChange, handleBlur, handleSubmit, values, touched, errors
        }) => {
          const { phonenumber, password } = values;
          return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
              <View style={{ flex: 1 }}>
                <View style={{ flex: 95 }}>
                  <View
                    style={{
                      // flex:1,
                      height: 40,
                      backgroundColor: '#D4D4D4',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 15,
                      }}>
                      Vui lòng nhập số điện thoại và tài khoản để đăng nhập
                    </Text>
                  </View>

                  <View style={{ marginLeft: 15, marginRight: 15 }}>

                    <TextInput style={{
                      height: 40,
                      fontSize: 15,
                      borderColor: '#6F3DD2',
                      borderBottomWidth: 1
                    }}
                      keyboardType='numeric'
                      placeholder='Số điện thoại'
                      returnKeyType='done'
                      onSubmitEditing={Keyboard.dismiss}
                      onChangeText={handleChange('phonenumber')}
                      onBlur={handleBlur('phonenumber')}
                      value={phonenumber}
                    />

                    {!touched.phonenumber && !errors.phonenumber ? <View style={{ margin: 10 }}></View> :
                      <Text style={{ fontSize: 14, color: 'red' }}>{errors.phonenumber}</Text>

                    }


                    <TextInput style={{
                      height: 40,
                      fontSize: 15,
                      borderColor: '#6F3DD2',
                      borderBottomWidth: 1
                    }}

                      placeholder='Mật khẩu'
                      returnKeyType='done'
                      secureTextEntry={hidePass}
                      onSubmitEditing={Keyboard.dismiss}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={password}
                    />
                    <TouchableOpacity style={styles.hidePass} onPress={() => setHidePass(!hidePass)}>
                      <Text>
                        {hidePass ? <Icon1 name="eye-with-line" size={20} color="grey" /> : <Icon1 name="eye" size={20} color="grey" />}
                      </Text>
                    </TouchableOpacity>
                    {!touched.password && !errors.password ? null :
                      <Text style={{ fontSize: 14, color: 'red' }}>{errors.password}</Text>

                    }

                  </View>
                </View>
                <View style={{ flex: 10, flexDirection: 'row-reverse', }}>
                  <TouchableOpacity onPress={handleSubmit}

                  // onPressIn={() => navigation.navigate('OtpSignUp')}
                  >
                    <View style={{ backgroundColor: '#6F3DD2', borderRadius: 20, height: 35, width: 35, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                      <Icon name="arrowright" size={24} color="white" />
                    </View>

                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )
        }}
      </Formik>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    height: 40,
    fontSize: 15,
    borderColor: '#6F3DD2',
    borderBottomWidth: 1
  },
  resetPhone: {
    position: 'absolute',
    right: 5,
    top: 14
  },
  hidePass: {
    position: 'absolute',
    right: 5,
    top: 70
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
})
