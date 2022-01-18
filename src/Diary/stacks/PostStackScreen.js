import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostScreen from '../screens/PostScreen'
import UploadPostScreen from '../screens/UploadPostScreen';
import ViewImageTimeLine from '../screens/ViewImageTimeLine'
import EditPost from '../screens/EditPost';
import Comment from '../screens/Comment';
import TrangCaNhanScreen from '../../Profile/screens/TrangCaNhanScreen';
import Report from '../screens/Report';
import NoInternet from '../../Login/screens/NoConnectionScreen';
const Stack = createNativeStackNavigator()
export default PostStackScreen = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen name="post" component={PostScreen} options={{ headerShown: false }} />
            <Stack.Screen name="upPost" component={UploadPostScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ViewImageTimeLine" component={ViewImageTimeLine} options={{ title: "Xem ảnh" }} />
            <Stack.Screen name="EditPost" component={EditPost} options={{ headerShown: false }} />
            <Stack.Screen name="Comment" component={Comment} options={{ title: "Bình luận" }} />
            <Stack.Screen
                name="Trang cá nhân"
                component={TrangCaNhanScreen}
            />
            <Stack.Screen
                name="Báo cáo xấu"
                component={Report}

                
            />
            <Stack.Screen name="NoInternet" component={NoInternet} options={{
            headerShown: false
          }}/>
        </Stack.Navigator>
    )
}