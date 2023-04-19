import Permissions from "react-native-permissions";
import AndroidOpenSettings from "react-native-android-open-settings";
import { Alert, Platform, Text, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


export function openImagePicker(component) {
  

  ImagePicker.showImagePicker(options, (responseFromImagePicker) => {
    if (responseFromImagePicker.customButton) {
      if (responseFromImagePicker.customButton === 'photos') {
          if (component.state.photoPermission === 'authorized') {
            launchImageLibrary(component, options)
          } else if (component.state.photoPermission === 'denied' || component.state.cameraPermission === 'restricted') {
            alertForPhotosPermission()
          } else {
            requestPhotoPermission(component, options)
          } 
      } else if (responseFromImagePicker.customButton === 'camera') {
        if (component.state.cameraPermission === 'authorized') {
          launchCamera(component, options)
        } else if (component.state.cameraPermission === 'denied' || component.state.cameraPermission === 'restricted') {
          alertForCameraPermission()
        } else {
          requestCameraPermission(component, options)
        }
      } 
    }
  })
}

const options = {
  title: 'Selecciona tu foto',
  mediaType: 'photo',
  quality: 1.0,
  maxWidth: 300,
  maxHeight: 300,
  storageOptions: {
    skipBackup: true
  },
  customButtons: [{ title: 'Tomar una foto', name: 'camera' }, { title: 'Elegir de Galería', name: 'photos' }],
  takePhotoButtonTitle: null,
  chooseFromLibraryButtonTitle: null,
}

const alertForPhotosPermission = () => {
  Alert.alert(
    "Fecit would like to access your library",
    "Allow this app to access your library to upload your photos as profile picture",
    [
      {
        text: 'Don\'t Allow',
        onPress: () => console.log('Permission denied'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => Platform.OS === 'android' ? AndroidOpenSettings.appDetailsSettings() : Permissions.openSettings() },
    ],
  );
}

const alertForCameraPermission = () => {
  Alert.alert(
    "Fecit would like to access the photo camera",
    "Allow this app to access your camera to upload your photos taken with this app as a profile picture",
    [
      {
        text: 'Don\'t Allow',
        onPress: () => console.log('Permission denied'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => Platform.OS === 'android' ? AndroidOpenSettings.appDetailsSettings() : Permissions.openSettings() },
    ],
  );
}

const requestPhotoPermission = (component, option) => {
  Permissions.request('photo').then((response) => {
    component.setState({ photoPermission: response })
    if (response === 'authorized') {
     launchImageLibrary(component, option)
    }
  })
}

const requestCameraPermission = (component, option) => {
  Permissions.request('camera').then((response) => {
    component.setState({ cameraPermission: response })
    if (response === 'authorized') {
      launchCamera(component, option)
    }
  })
}

export const ImagePickerlaunchImageLibrary = (component) => {
  launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error) {
        component.setImage(response)
      }
  })
}

export const ImagePickerlaunchCamera = (component) => {
  launchCamera(options, (response) => {
      if (!response.didCancel && !response.error) {
        component.setImage(response)
      }
  })
}

export const getFileExtension = (filename) => {
  if (filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
  }
  return ""
} 