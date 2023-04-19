import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, AppState} from 'react-native';
import {connect} from "react-redux";
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import {EDIT_USER_MUTATION} from '../../../graphql/mutations';
import {Navigation} from 'react-native-navigation';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import ActionSheet from 'react-native-actionsheet';
import styles from './Style';
import {Camera} from '../../../../assets';
import {colors} from '../../../colors';
import {shadow} from '../../../common_style';
import FullWidthButton from '../../common/FullWidthButton/Component';
import Toast from '../../common/Toast/Component';
import {startInitialisation} from '../../../navigation/navigation_settings';
import {ImagePickerlaunchCamera, ImagePickerlaunchImageLibrary, getFileExtension} from '../../../utils/AppUtils';
import {getData} from '../../../storage';
import {uploadToS3} from '../../../utils/aws';
import BackHeader from '../../common/BackHeader/Component';

class ProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoPermission: '',
      cameraPermission: '',
      media: { url: undefined, height: undefined, width: undefined, size: undefined, extension: undefined },
      disabledButton: false,
      userName: undefined
    }
    Navigation.events().bindComponent(this)
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.checkPermission)
    this.setState({userName: JSON.parse(await getData('username'))})
  }

  componentDidAppear() {
    this.checkPermission()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.checkPermission)
  }

  checkPermission = () => {
    Permissions.checkMultiple(['camera', 'photo']).then((response) => {
      this.setState({
        photoPermission: response.photo,
        cameraPermission: response.camera,
      });
    });
  }

  setImage = (response) => {
    const { media } = this.state
    media['url'] = response.uri
    media['height'] = response.height
    media['width'] = response.width
    media['size'] = response.fileSize
    media['extension'] = getFileExtension(response.fileName).toLocaleLowerCase()
    this.setState({ media })
  }

  uploadImage = async () => {
    const { media } = this.state
    if(media && media.url) {
      this.setState({ disabledButton: true })
      try {
        const url = await uploadToS3(media.url, media.extension, media.width, media.height, media.size)
        if(url) {
          await this.props.editUser({
            variables: {
              image: url
            }
          })
          startInitialisation()
        } else {
          this.setState({ disabledButton: false })
          this.refs.toast.show('No se puede cargar avtar')
        }
      } catch (e) {
        this.setState({ disabledButton: false })
        this.refs.toast.show('No se puede cargar avtar')
      }
    } else {
      this.refs.toast.show('Selecciona tu foto')
    }
  }

  render() {
    const { media, userName, disabledButton } = this.state
    return (
      <View style={{flex: 1}}>
        <ActionSheet
            ref={o => this.ActionSheet = o}
            title={'Selecciona tu foto'}
            options={['Tomar una foto', 'Elegir de Galería', "Cancelar"]}
            cancelButtonIndex={2}
            onPress={(index) => {
                if (index == 0) {
                  ImagePickerlaunchCamera(this);
                } else if (index == 1) {
                  ImagePickerlaunchImageLibrary(this);
                }
            }}
        />
        <BackHeader screenId = {this.props.componentId}/>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.8} style={styles.imagePickerWrapper} onPress={() => this.ActionSheet.show()} disabled={disabledButton}>
            { media.url ? 
              <Image source={{uri: media.url}} style={styles.image} />
            :
              <View style={styles.iconWrapper}>
                <Camera />
                <Text style={styles.imagePickerText}>{`SUBIR\nFOTOGRAFIA\nDE PERFIL`}</Text>
              </View>
            }
          </TouchableOpacity>
          {userName && <Text style={styles.nameText}>hola {userName}</Text>}
          <View style={styles.buttonWrapper}>
            <FullWidthButton 
              buttonText={disabledButton ? 'Cargando usuario...' : 'continuar'}
              onPress={() => this.uploadImage()}
              style={{...shadow}}
              disabled={disabledButton}
            />
          </View>
          <Toast ref="toast" style={{ backgroundColor: colors.blue }} textStyle={{ color: colors.lightBlue }} />
        </View>
      </View>
    )
  }
}

// const withMutation = compose(
//   graphql(EDIT_USER_MUTATION, { name: 'editUser' })
// )(ProfilePic)
const withMutation = 
  graphql(EDIT_USER_MUTATION, { name: 'editUser' })
(ProfilePic)
export default withMutation;