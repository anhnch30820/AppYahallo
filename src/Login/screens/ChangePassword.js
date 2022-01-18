import React from 'react';
import { Component, useState } from 'react';
import { Text, View, TextInput, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Formik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon1 from 'react-native-vector-icons/Entypo';

const validationSchema = Yup.object({


    currentPassword: Yup.string()
        .trim()
        .min(6, 'Password is too short!')
        .max(10, 'Password is too long!')
        .required('Password is required!')
    // .notOneOf([Yup.ref('phonenumber'), null], "SĐT và mật khẩu không được trùng nhau!")
    ,
    newPassword: Yup.string()
        .trim()
        .min(6, 'Password is too short!')
        .max(10, 'Password is too long!')
        .required('Password is required!')
        .notOneOf([Yup.ref('currentPassword'), null], "Mật khẩu mới và mật khẩu cũ không được trùng nhau!")
    ,
    confirmPassword: Yup.string().equals(
        [Yup.ref('newPassword'), null],
        'New Password does not match!'
    ),
});

export default function ChangePass({ navigation }) {
    const [hidePass, setHidePass] = useState(true);

    const userInfo = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    const changePass = async (values) => {
        const userToken = await AsyncStorage.getItem('userToken');
        try {
            const res = await apiClient.post('/users/change-password', {
                ...values
            },
                {
                    headers: {
                        authorization: "token " + userToken,
                    }
                }
            );

            if (res.status == 200) {
                Alert.alert('Thành công!', 'Bạn đã đổi mật khẩu thành công', [
                    { text: 'Okay', onPress: () => navigation.navigate('Trang cá nhân') }
                ]);
            }



        } catch (e) {
            if (e.response && e.response.status == 400) {
                console.log(e.response.data.message)
                Alert.alert('Thông báo!', 'Mật khẩu không chính xác.', [
                  { text: 'Okay' }
                ]);
          
                return;
            }
            console.log(e)
            navigation.navigate("NoInternet")
        }
    };
    return (
        
            <Formik
                initialValues={userInfo}
                validationSchema={validationSchema}
                onSubmit={changePass}
            >
                {({
                    handleChange, handleBlur, handleSubmit, values, touched, errors
                }) => {
                    const {
                        currentPassword,
                        newPassword,
                        confirmPassword } = values;
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
                                            Vui lòng điền đầy đủ thông tin của bạn
                                        </Text>
                                    </View>

                                    <View style={{ marginLeft: 15, marginRight: 15 }}>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                fontSize: 15,
                                                borderColor: '#6F3DD2',
                                                borderBottomWidth: 1,
                                            }}
                                            placeholder="Mật khẩu cũ"
                                            autoFocus={true}
                                            onChangeText={handleChange('currentPassword')}
                                            onBlur={handleBlur('currentPassword')}
                                            value={currentPassword}
                                            returnKeyType="done"
                                            secureTextEntry={true}
                                            onSubmitEditing={Keyboard.dismiss}

                                        />
                                        {!touched.currentPassword && !errors.currentPassword ? <View style={{ margin: 10 }}></View> :
                                            <Text style={{ fontSize: 14, color: 'red' }}>{errors.currentPassword}</Text>

                                        }


                                        <TextInput style={{
                                            height: 40,
                                            fontSize: 15,
                                            borderColor: '#6F3DD2',
                                            borderBottomWidth: 1
                                        }}
                                            // keyboardType='numeric'
                                            placeholder='Mật khẩu mới'
                                            returnKeyType='done'
                                            secureTextEntry={hidePass}
                                            onSubmitEditing={Keyboard.dismiss}
                                            onChangeText={handleChange('newPassword')}
                                            onBlur={handleBlur('newPassword')}
                                            value={newPassword}
                                        />
                                        <TouchableOpacity style={styles.hidePass} onPress={() => setHidePass(!hidePass)}>
                                            <Text>
                                                {hidePass ? <Icon1 name="eye-with-line" size={20} color="grey" /> : <Icon1 name="eye" size={20} color="grey" />}
                                            </Text>
                                        </TouchableOpacity>
                                        {!touched.newPassword && !errors.newPassword ? <View style={{ margin: 10 }}></View> :
                                            <Text style={{ fontSize: 14, color: 'red' }}>{errors.newPassword}</Text>

                                        }

                                        <TextInput style={{
                                            height: 40,
                                            fontSize: 15,
                                            borderColor: '#6F3DD2',
                                            borderBottomWidth: 1
                                        }}

                                            placeholder='Xác nhận mật khẩu'
                                            returnKeyType='done'
                                            secureTextEntry={true}
                                            onSubmitEditing={Keyboard.dismiss}
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={confirmPassword}

                                        />
                                        {!touched.confirmPassword && !errors.confirmPassword ? <View style={{ margin: 10 }}></View> :
                                            <Text style={{ fontSize: 14, color: 'red' }}>{errors.confirmPassword}</Text>

                                        }

                                    </View>
                                </View>
                                <View style={{ flex: 10, flexDirection: 'row-reverse', }}>
                                    <TouchableOpacity onPress={handleSubmit}
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
 
    hidePass: {
      position: 'absolute',
      right: 5,
      top: 75
    },
    
  })
