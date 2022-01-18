import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Modal
} from 'react-native';
import { BaseURL } from '../../utils/Constants';
import ImageViewer from 'react-native-image-zoom-viewer';



export default function ViewImage({navigation, route}) {
    const {img} = route.params
    const images = [{
        url: BaseURL+ img
    }]
    return (
      
          <ImageViewer imageUrls={images}/>
     
  )
  
}
