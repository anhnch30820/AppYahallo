import React, {useState} from 'react';
import {Text, View, SafeAreaView, StyleSheet, FlatList, Image} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import { Switch } from 'react-native-elements/dist/switch/switch';

export default function QuyenRiengTu({navigation}) {

    

    const [strangerSeeDiary, setStrangerSeeDiary] = useState(false);
    const [strangerInbox, setStrangerInbox] = useState(false);

    return (
        <View style={styles.container}>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Cho người lạ xem nhật kí</ListItem.Title>
                </ListItem.Content>
                <Switch
                    value={strangerSeeDiary}
                    onValueChange={(value) => setStrangerSeeDiary(value)}
                />
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Cho người lạ nhắn tin</ListItem.Title>
                </ListItem.Content>
                <Switch
                    value={strangerInbox}
                    onValueChange={(value) => setStrangerInbox(value)}
                />
            </ListItem>
            <ListItem 
                bottomDivider
                onPress = {() => navigation.navigate('Danh sách chặn nhật ký')}
            >
                <ListItem.Content>
                    <ListItem.Title>Danh sách chặn nhật ký</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
            <ListItem 
                bottomDivider
                onPress = {() => navigation.navigate('Danh sách chặn tin nhắn')}
            >
                <ListItem.Content>
                    <ListItem.Title>Danh sách chặn tin nhắn</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
    },
    text: {
        color: '#000000',
        fontSize: 16,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 2,
        height: 60,
    },
    avatar: {
        borderRadius: 100,
    },
});


