import React from "react";
import { Component } from "react";
import {
    Text, View, Image
} from "react-native";

export default class NoInternet extends Component {
    render() {
        return (
            <View style={{
                flex: 1,

            }}
            >
                <View style={{
                    marginTop: 35,
                    flex: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 40, color: '#6F3DD2'}}>Yahallo</Text>
                </View>

                <View style={{
                    flex: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 100
                }}>
                    <View>

                        <Image
                          style={{width: 75, height: 75, margin: 5}}
                            source={require('../assets/network.png')}
                        />
                    </View>
                    <Text style={{ color: 'red' }}>Không có kết nối Internet</Text>
                    <Text>Vui lòng kiểm tra lại đường truyền</Text>
                    <Text>Tài khoản sẽ tự động đăng nhập khi có kết nối internet</Text>

                </View>
            </View>

        );
    }
}