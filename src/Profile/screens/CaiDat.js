import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { AuthContext } from '../../components/context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaiDat({ navigation, route }) {
    const { username, getGender, birthday } = route.params
    const [state, setState] = useState({});
    const isFocused = useIsFocused();

    const Items = [
        { title: '', data: [{ id: 1, word: 'Thông tin cá nhân' }, { id: 2, word: 'Quyền riêng tư' }] },
        { title: '', data: [{ id: 3, word: 'Đổi mật khẩu' }, { id: 4, word: 'Thông báo' }, { id: 5, word: 'Ngôn ngữ và phông chữ' }, { id: 6, word: 'Thông tin về YaHaLo' }] },
        { title: '', data: [{ id: 7, word: 'Đăng xuất' }] },
    ];
    const { dispatch } = React.useContext(AuthContext)
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
        } catch (e) {
            console.log(e);
        }
        dispatch({ type: "LOGOUT" });
    };
    function onPressHandler(id) {
        if (id == 2) {
            navigation.navigate('Quyền riêng tư');
        }
        if (id == 3) {
            navigation.navigate('Đổi mật khẩu');
        }
        if (id == 7) {
            logout()
        }
        if (id == 1) {
            navigation.navigate('ChangeInfo', {
                username: username,
                getGender: getGender,
                birthday: birthday
            })
        }
    }
    
   
    useEffect(() => {
        return () => {
            setState({}); // This worked for me
        }
    }, [isFocused])

    const renderItem = ({ item }) => (
        <ListItem
            bottomDivider
            onPress={() => onPressHandler(item.id)}
        >
            <ListItem.Content>
                <ListItem.Title>{item.word}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );

    const renderSectionHeader = ({ section }) => (
        <View style={[styles.item, { backgroundColor: '#f1f1f1', height: 20 }]}>
            <Text style={[styles.text, { color: '#aeaeae' }]}>{section.title}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <SectionList
                sections={Items}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
    },
    text: {
        color: '#000000',
        marginLeft: 10,
        fontSize: 16,
    },
    item: {
        padding: 4,
        height: 40,
        backgroundColor: '#ffffff',
    },
})