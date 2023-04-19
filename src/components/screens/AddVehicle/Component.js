import React, {Component} from 'react';
import ReactNative, {View, Text, TextInput, TouchableOpacity, Image, FlatList, findNodeHandle, AppState} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Permissions from 'react-native-permissions';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import {EDIT_USER_MUTATION} from '../../../graphql/mutations';
import {GET_VEHICLE_TYPES} from '../../../graphql/queries';
import apolloClient from '../../../graphql/client';
import styles from './Style';
import {colors} from '../../../colors';
import {Camera, images} from '../../../../assets';
import config from '../../../../config';
import FullWidthButton from '../../common/FullWidthButton/Component';
import ModalBox from '../../common/ModalBox/Component';
import VehicleTypes from '../../common/VehicleTypes/Component';
import WrongInputWarning from '../../common/WrongInputWarning/Component';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import {ImagePickerlaunchCamera, ImagePickerlaunchImageLibrary, getFileExtension} from '../../../utils/AppUtils';
import {setData} from '../../../storage';
import {uploadToS3} from '../../../utils/aws';
import BackHeader from '../../common/BackHeader/Component';

class AddVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoPermission: '',
      cameraPermission: '',
      media: { url: undefined, height: undefined, width: undefined, size: undefined, extension: undefined },
      vehicle: {brand: '', color: '', model: '', plateNumber: '', valuePerKm: '', origin: '', vehicleType: {id: '', name: ''}, neighborhood: ''},
      errorText: undefined,
      displayModal: false,
      selectBoxTop: 0,
      disabledButton: false,
      neighborhoods: [],
      displaySelectBox: false
    }
    Navigation.events().bindComponent(this)
  }

  componentDidMount() {
    AppState.addEventListener('change', this.checkPermission);
  }

  componentDidAppear() {
    this.checkPermission()     
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.checkPermission);
  }

  checkPermission = () => {
    Permissions.checkMultiple(['camera', 'photo']).then((response) => {
      this.setState({
        photoPermission: response.photo,
        cameraPermission: response.camera,
      })
    })
  }

  getNeighborhoods = (text) => {
    this.setState({ displaySelectBox: true })
    this.handleInput({ key: 'neighborhood', value: text })
    if (text.length >= 2) {
      // fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-34.611555,-58.451842&radius=50000&type=neighborhood&key=AIzaSyDjn0Uytv_FSUwwpOUTVCvL4vKYU7Ev7VU')
      fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' + text + '&location=-34.605914,-58.453213&radius=200000&strictbounds&key=' + config.google.apiKey)
        .then((response) => response.json())
          .then((responseJson) => {
            const neighborhoods = [] 
            responseJson.predictions.forEach((place) => {
              neighborhoods.push(place.description)
            })
            this.setState({ neighborhoods })
        })
        .catch((error) => { 
          console.log(error)
        });
    } else {
      this.setState({ neighborhoods: [] })
    }
  }

  addVehicle = async () => {
    // navigateToScreen(this.props.componentId, 'FreemiumRegister')
    if (this.validateInputs()) {
      const { vehicle, media } = this.state
      try {
        this.setState({ disabledButton: true })
        const url = await uploadToS3(media.url, media.extension, media.width, media.height, media.size)
        if(url) {
          const result = await this.props.editUser({
            variables: {
              image: url,
              neighborhood: vehicle.neighborhood,
              vehicalTypeId: vehicle.vehicleType['id'],
              brand: vehicle.brand,
              color: vehicle.color,
              model: vehicle.model,
              plateNumber: vehicle.plateNumber,
              valuePerKm: vehicle.valuePerKm
            }
          })
          if (result && result.data && result.data.editUser && result.data.editUser.profile && result.data.editUser.profile.vehical) {
            await setData('userVehicle', result.data.editUser.profile.vehical)
            navigateToScreen(this.props.componentId, 'FreemiumRegister')
          }
        } else {
          this.setState({ disabledButton: false, errorText: 'No se puede cargar avtar' })
        }
      } catch (error) {
        this.setState({ disabledButton: false, errorText: 'No se puede agregar vehículo' })
      }
    }
  }

  validateInputs = () => {
    const { vehicle, media } = this.state
    if (vehicle.neighborhood === '') {
      this.setState({ errorText: 'Por favor ingrese barrio de procedencia' })
      this.scrollToWarning()
      return false
    }
    if (vehicle.vehicleType['id'] === '') {
      this.setState({ errorText: 'Por favor seleccione el tipo de vehículo' })
      this.scrollToWarning()
      return false
    }
    if (vehicle.brand === '') {
      this.setState({ errorText: 'Por favor ingrese marca' })
      this.scrollToWarning()
      return false
    }
    if (vehicle.color === '') {
      this.setState({ errorText: 'Por favor ingrese color' })
      this.scrollToWarning()
      return false
    } 
    if (vehicle.model === '') {
      this.setState({ errorText: 'Por favor ingrese modelo' })
      this.scrollToWarning()
      return false
    } 
    if (vehicle.plateNumber === '') {
      this.setState({ errorText: 'Por favor ingrese patente' })
      this.scrollToWarning()
      return false
    } 
    if (vehicle.valuePerKm === '') {
      this.setState({ errorText: 'Por favor ingrese valor por km' })
      this.scrollToWarning()
      return false
    } 
    if (!media.url) {
      this.setState({ errorText: 'Favor subir fotografia de perfil' })
      this.scrollToWarning()
      return false
    }
    return true
  }

  scrollToWarning = () => {
    this.scroll.scrollTo({x: 0, y: 0, animated: true})
  }

  handleInput = ({ key, value }) => {
    const vehicle = this.state.vehicle
    vehicle[key] = value
    this.setState({ vehicle })
  }

  scrollToInput (reactNode: any) {
    this.setState({ displaySelectBox: false })
    this.scroll?.props?.scrollToFocusedInput(reactNode)
  }

  renderTextInput = (placeholder, key, value, keyboardType, reference, blurOnSubmit, onSubmit, style) => {
    return (
      <TextInput
        style={[styles.inlineLabelTextInput, style]}
        autoCapitalize="none"
        selectionColor={colors.blue}
        keyboardType={keyboardType}
        onChangeText={changedText => this.handleInput({key, value: changedText})}
        placeholder={placeholder}
        placeholderTextColor={colors.violet}
        value={value} 
        underlineColorAndroid={'transparent'}
        blurOnSubmit={blurOnSubmit}
        ref={reference}
        onSubmitEditing={onSubmit}
        onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
      /> 
    )
  }

  renderModal = () => {
    return (
      <ModalBox
        displayModal={this.state.displayModal}
        closeModal={() => this.setState({ displayModal: false })}
      >
        <VehicleTypes handleVehicleType={(vehicleType) => this.handleVehicleType(vehicleType)} closeModal={() => this.setState({ displayModal: false })} />
      </ModalBox>
    )
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

  handleVehicleType = (vehicleType) => {
    const { vehicle } = this.state
    vehicle.vehicleType['id'] = vehicleType._id
    vehicle.vehicleType['name'] = vehicleType.name
    this.setState({ vehicle, displayModal: false })
  }

  handleNeighborhoodSelection = (neighborhood) => {
    this.setState({ displaySelectBox: false })
    this.handleInput({ key: 'neighborhood', value: neighborhood })
  }

  renderNeighborhoods = () => {
    return (
      <View style={styles.menuWrapper}>
        {this.state.neighborhoods.map((neighborhood, index) => {
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.handleNeighborhoodSelection(neighborhood)} key={index}>
              <Text style={styles.menuItemText} numberOfLines={1}>{neighborhood}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  neighborhoodTextInputFocus = () => {
    this.setState({ neighborhoods: [] })
    this.handleInput({ key: 'neighborhood', value: ''})
  }

  render() {
    const { media, vehicle, selectBoxTop, errorText, disabledButton, neighborhoods, displaySelectBox } = this.state  
    return (
      <View style={styles.container}>
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
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.keyboardAvoidingContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          innerRef={ref => { this.scroll = ref }}
        >
          <TouchableOpacity activeOpacity={0.8} style={styles.imagePickerWrapper} onPress={() => this.ActionSheet.show()} disabled={disabledButton}>
            { media.url ? 
              <Image source={{uri: media.url}} style={styles.image} />
            :
              <View style={styles.imageWrapper}>
                <Camera />
                <Text style={styles.imagePickerText}>{`SUBIR\nFOTOGRAFIA\nDE PERFIL`}</Text>
              </View>
            }
          </TouchableOpacity>
          {errorText && (
            <WrongInputWarning warningText={errorText} style={styles.wrongInputWarningWrapper} />
          )}
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={changedText => this.getNeighborhoods(changedText)}
            placeholder={'Barrio de procedencia'}
            placeholderTextColor={colors.white}
            value={vehicle['neighborhood']} 
            selectionColor={colors.white}
            underlineColorAndroid={'transparent'}
            onFocus={() => this.neighborhoodTextInputFocus()}
          /> 
          {(displaySelectBox && (neighborhoods && neighborhoods.length > 0)) && this.renderNeighborhoods()}
          <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.8} onPress={() => this.setState({ displayModal: true })}>
            <Text style={styles.buttonText}>{vehicle.vehicleType['name'] ? vehicle.vehicleType['name'] : 'Tipo de vehículo'}</Text>
          </TouchableOpacity>
          <View style={styles.rowWrapper}>
            {this.renderTextInput('Marca', 'brand', vehicle['brand'], 'default', (input) => { this.brand = input }, false, () => this.color.focus(), styles.customeWidth)}
            {this.renderTextInput('Color', 'color', vehicle['color'], 'default', (input) => { this.color = input }, false, () => this.model.focus(), styles.customeWidth)}
          </View>
          {this.renderTextInput('Modelo', 'model', vehicle['model'], 'default', (input) => { this.model = input }, false, () => this.plateNo.focus())} 
          {this.renderTextInput('Patente', 'plateNumber', vehicle['plateNumber'], 'default', (input) => { this.plateNo = input }, false, () => this.valuePerKm.focus())}
          {this.renderTextInput('Valor por hora', 'valuePerKm', vehicle['valuePerKm'], 'number-pad', (input) => { this.valuePerKm = input }, true, () => this.addVehicle())}
          <View style={styles.buttonContainer}>
            <FullWidthButton buttonText={'continuar'} onPress={() => this.addVehicle()} disabled={disabledButton} />
          </View>
        </KeyboardAwareScrollView> 
        {this.renderModal()}
      </View>
    )
  }
}

const withMutation = 
  graphql(EDIT_USER_MUTATION, { name: 'editUser' })
(AddVehicle);
export default withMutation;
// const withMutation = compose(
//   graphql(EDIT_USER_MUTATION, { name: 'editUser' })
// )(AddVehicle);
// export default withMutation;