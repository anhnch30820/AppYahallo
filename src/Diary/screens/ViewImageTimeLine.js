import React, { Component } from 'react';
import { BaseURL } from '../../utils/Constants';
import ImageViewer from 'react-native-image-zoom-viewer';


export default function ViewImageTimeLine({ navigation, route }) {
  const { img } = route.params
  let images = []
  for (let i = 0; i < img.length; i++)
    images.push( {url: BaseURL+ img[i].fileName})
  return (

    <ImageViewer imageUrls={images} />

  )

}
