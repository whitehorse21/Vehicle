import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, Switch, TextInput, FlatList, Alert, Platform, Keyboard, PermissionsAndroid, ActivityIndicator} from 'react-native';
import {connect} from "react-redux";
import {Navigation} from 'react-native-navigation';
import Modal from 'react-native-modalbox';
import RNFetchBlob from "rn-fetch-blob";
import Permissions from "react-native-permissions";
import AndroidOpenSettings from "react-native-android-open-settings";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import {ADD_PROMOTION, REMOVE_PROMOTION, UPDATE_CARRIER_USER_STATUS, UPDATE_LOCATION, EDIT_USER_MUTATION, SET_USER_DEVICE_TOKEN} from '../../../graphql/mutations';
import {PROMOTIONS_LIST, GET_USER_DETAILS, CARRIER_DELIVERY_CONFIRMATION, DOWNLOAD_USERS_DATA} from '../../../graphql/queries';
import apolloClient from '../../../graphql/client';
import styles from './Style';
import {colors} from '../../../colors';
import {Close, Camera, Logo} from '../../../../assets';
import ModalBox from '../../common/ModalBox/Component';
import TopNavBar from '../../common/TopNavBar/Component';
import BottomNavBar from '../../common/BottomNavBar/Component';
import Spinner from '../../common/Spinner/Component';
import InformationBar from '../../common/InformationBar/Component';
import ChangePassword from '../../common/ChangePassword/Component';
import Toast from '../../common/Toast/Component';
import AlertBox from '../../common/AlertBox/Component';
import SimpleButton from '../../common/SimpleButton/Component';
import {goToAuth, navigateToScreen} from '../../../navigation/navigation_settings';
import {getData, deleteData} from '../../../storage';
import {validateEmail} from '../../../utils/validators';
import config from '../../../../config';
import { getDeviceToken } from '../../../notifications';

const default_region = {
  latitude: -34.605914,
  longitude: -58.453213,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      modalContentType: '',
      loading: true,
      userType: undefined,
      user: {email: '', username: '', image: '', valuePerKm: '', rating: 0, status: false, shipment: null},
      promotions: [],
      discount: '',
      loadingPromotion: false,
      displayAlert: false,
      promotionId: undefined,
      region: default_region,
      currentLocation: null,
      mapBottom: 1,
      keyboardHeight: 0,
      displayProgressModal: false 
    }
    this.watchID = null
    Navigation.events().bindComponent(this)
    this.screenEventListener = Navigation.events().registerComponentDidDisappearListener(async ({ componentId }) => {
      if (componentId === 'SideMenu') {
        const userType = JSON.parse(await getData('userType'))
        if(userType) this.getUserDetails()
      }
    })

    
  }

  async UNSAFE_componentWillMount() {
    this.setState({userType: JSON.parse(await getData('userType'))})
   }

  async componentDidAppear() { 
    
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
    await this.getUserDetails()
    
  }

  componentDidDisappear() {
    if(this.keyboardDidShowListener) this.keyboardDidShowListener.remove()
    if(this.keyboardDidHideListener) this.keyboardDidHideListener.remove()
  }

  componentWillUnmount() {
    if(this.watchID !== null) {
      navigator.geolocation.clearWatch(this.watchID)
      navigator.geolocation.stopObserving()
    }
  }

  keyboardDidShow = (e) => {
    this.setState({ keyboardHeight: e.endCoordinates.height })
  }

  keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 })
  }

  checkLocationPermission = () => {
    Permissions.check('location').then((response) => {
      if (response === 'authorized') {
        this.watchLocationChanges()
      } else if (response === 'denied' || response === 'restricted') {
        this.alertForLocationPermission()
      } else {
        this.requestLocationPermission()
      } 
    })
  }

  alertForLocationPermission = () => {
    Alert.alert(
      'Allow location access',
      'Please enable location permission for fecit in your app settings',
      [
        {
            text: 'Don\'t Allow',
            onPress: () => console.log('permission denied'),
            style: 'cancel'
        },
        { text: 'OK', onPress: () => Platform.OS === 'android' ? AndroidOpenSettings.appDetailsSettings() : Permissions.openSettings() },
      ]
    )
  }

  requestLocationPermission = () => {
    Permissions.request('location').then((response) => {
      if (response === 'authorized') {
        this.watchLocationChanges()
      }
    })
  }

  watchLocationChanges = () => {
    const { user } = this.state
    this.watchID = navigator.geolocation.watchPosition(
      async (position) => {
        this.setState({
          region: {latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: 0.009, longitudeDelta: 0.009}, 
          currentLocation: {latitude: position.coords.latitude, longitude: position.coords.longitude}
        })
        if(user && user.status) {
          await this.props.updateLocation({
            variables: {
              currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}
            }
          })
        }
        await this.getDistance(position.coords.latitude, position.coords.longitude)
      },
      (error) => { 
        console.log(error) 
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000, distanceFilter: 5 }
    ) 
  }

  getDistance = async (latitude, longitude) => {
    const { user } = this.state
    if(user && user.shipment && user.shipment.destination && user.shipment.destination.location) {
      const currentPoint = latitude + "," + longitude
      const destinationPoint = user.shipment.destination.location['lat'] + "," + user.shipment.destination.location['lng']
      const distance = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + currentPoint + '&destinations=' + destinationPoint + '&key=' + config.google.apiKey)
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status === 'OK') return responseJson.rows[0].elements[0].distance.value 
          else return;
        })
        .catch((error) => { 
          return;
        })
      if(user && user.shipment && user.shipment._id && distance && distance <= 50) {
        try {
          await apolloClient.query({
            query: CARRIER_DELIVERY_CONFIRMATION,
            variables: {
              shipmentId: user.shipment._id
            },
            fetchPolicy: 'network-only'
          })
        } catch (error) {
          console.log(error)
        }
      }
    } 
    return;
  }

  getUserDetails = async () => {
    try {
      const resultList = await apolloClient.query({
        query: GET_USER_DETAILS,
        fetchPolicy: 'no-cache'
      })
      if(resultList && resultList.data && resultList.data.getUserDetails) {
        let user = resultList.data.getUserDetails
        if(user && user.profile && !user.profile.deviceToken) await this.setUserDeviceToken()
        if(user && user.email) this.setUserDetails({key: 'email', value: user.email})
        if(user && user.username) this.setUserDetails({key: 'username', value: user.username})
        if(user && user.profile && user.profile.image) this.setUserDetails({key: 'image', value: user.profile.image})
        if(user && user.roles === 'carrier' && user.profile && user.profile.vehical && user.profile.vehical.valuePerKm) this.setUserDetails({key: 'valuePerKm', value: user.profile.vehical.valuePerKm})
        if(user && user.roles === 'carrier' && user.rating) this.setUserDetails({key: 'rating', value: user.rating})
        if(user && user.roles === 'carrier' && user.profile && user.profile.vehical && user.profile.vehical.status) this.setUserDetails({key: 'status', value: user.profile.vehical.status})
        if(user && user.roles === 'carrier' && user.shipment) this.setUserDetails({key: 'shipment', value: user.shipment})
        else this.setUserDetails({key: 'shipment', value: null})
      }
      if(this.watchID === null) this.checkLocationPermission() 
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  setUserDeviceToken = async () => {
    const deviceToken = getDeviceToken()
    if(deviceToken) {
      try {
        const res = await this.props.setUserDeviceToken({
          variables: {
            deviceToken
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  setUserDetails = ({key, value}) => {
    const { user } = this.state
    user[key] = value
    this.setState({user})
  }

  getPromotions = async () => {
    this.setState({ displayModal: true, modalContentType: 'promotions', loadingPromotion: true })
    try {
      const resultList = await apolloClient.query({
        query: PROMOTIONS_LIST,
        fetchPolicy: 'no-cache'
      })
      if (resultList && resultList.data && resultList.data.getPromotions) {
        this.setState({ promotions: resultList.data.getPromotions})
      }
      this.setState({ loadingPromotion: false })
    } catch (error) {
      this.setState({ loadingPromotion: false })
    }
  } 

  addPromotion = async () => {
    if(this.state.discount && this.state.discount.length > 0) {
      try {
        const result = await this.props.addPromotion({
          variables: {
            discount: this.state.discount
          }
        });
        if (result && result.data && result.data.addPromotion) {
          const { promotions } = this.state
          promotions.push(result.data.addPromotion)
          await this.setState({promotions})
          this.refs.promotionToast.show('Promotion added successfully')
          setTimeout(() => {this.flatList.scrollToEnd()}, 100)
        }
      } catch (error) {
        this.refs.promotionToast.show('Cannot add promotion')
      }
      this.setState({ discount: '' })
    } else {
      this.refs.promotionToast.show('Please insert discount')
    }
  }

  removePromotion = async () => {
    if(this.state.promotionId) {
      try {
        const isRemoved = await this.props.removePromotion({
          variables: {
            promotionId: this.state.promotionId
          }
        });
        if(isRemoved) {
          const updatedPromotionList = this.state.promotions.filter((promotion) => {
            return promotion._id !== this.state.promotionId
          })
          await this.setState({promotions: updatedPromotionList, promotionId: undefined, displayAlert: false})
          this.refs.promotionToast.show('Promotion removed successfully')
        }
      } catch (error) {
        this.refs.promotionToast.show('Cannot remove promotion')
      }
    }
  }

  updateCarrierStatus = async (value) => {
    try {
      const result = await this.props.updateCarrierStatus({
        variables: {
          status: value
        }
      });
      if (result && result.data && result.data.updateCarrierStatus) {
        this.setUserDetails({key: 'status', value})
      }
    } catch (error) {
      console.log(error)
    }
  }

  editEmail = async (email) => {
    this.setUserDetails({ key: 'email', value: email})
    if(validateEmail(email)) {
      try {
        const res = await this.props.editUser({
          variables: {
              email
          }
        })
      } catch (error) {
        try {
          this.refs.errorToast.show(this.errorMap(error.graphQLErrors[0].message))
        } catch (e) {
            this.refs.errorToast.show('No se puede editar el correo electrónico')
        }
      }
    }
  }

  errorMap = (value) => {
    switch (value) {
      case 'Email already exists': 
        return 'Correo electrónico ya existe';
        
      case 'Invalid email':
        return 'Correo electrónico inválido';
        
      default: 
        return 'No se puede editar el correo electrónico';
    }
  }

  openModal = (modalContentType) => {
    this.setState({ displayModal: true, modalContentType})
  }

  closeModal = () => {
    this.setState({ displayModal: false, discount: ''})
  }

  renderModal = () => {
    const {modalContentType} = this.state
      return (
        <ModalBox
          displayModal={this.state.displayModal}
          closeModal={() => this.closeModal()}
        >
          {this.renderModalView()}
        </ModalBox>
      )
  }

  renderModalView = () => {
    const {modalContentType} = this.state
    if(modalContentType === 'changePassword') {
      return <ChangePassword onPress={() => this.passwordChangeMsg()} onClosePress = {() => this.closeModal()}/>
    }
    if(modalContentType === 'promotions') {
      return this.promotionView()
    }
  }

  passwordChangeMsg = async () => {
    await this.setState({displayModal: false})
    await this.refs.toast.show('Contraseña modificada con éxito')
  }

  handleRemovePromotion = (promotionId) => {
    this.setState({ displayAlert: true, promotionId })
  }

  renderPromotions = () => {
    if(this.state.promotions &&  this.state.promotions.length > 0) {
      return (
        <FlatList
          ref={elm => this.flatList = elm}
          keyExtractor={(promotion, index) => index.toString()}
          contentContainerStyle={styles.flatlistContainerStyle}
          data={this.state.promotions}
          extraData={this.state}
          renderItem={promotion => this.renderPromotion(promotion)}
          indicatorStyle={'white'}
          bounces={false}
        />
      )
    } else {
      return <Text style={styles.notFoundText}>No promotions found</Text>
    }
  }

  renderPromotion = ({item, index}) => {
    return (
      <View style={[styles.promotionView, {marginTop: index !== 0 ? 10 : 0}]} key={index}>
        <Text 
          style={styles.buttonText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {item.discount}%   Código {item.code}
        </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => this.handleRemovePromotion(item._id)}>
          <Close />
        </TouchableOpacity>
      </View>
    )
  }

  promotionView = () => {
    const { loadingPromotion, displayAlert } = this.state
    return (
      <View style={styles.container}>
        <InformationBar titleText={'PROMOCIONES'} onClosePress = {() => this.closeModal()}/>
        <View style={styles.container}>
          <Text style={styles.promotionText}>Mis promociones vigentes</Text>
          { loadingPromotion ? 
            <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} /> 
          :
            <View style={styles.flatlistWrapper}>
              {this.renderPromotions()}
            </View>
          }
          <View style={styles.createPromotionWrapper}>
            <Text style={styles.actionButtonText}>Nueva promoción</Text>
            <View style={styles.rowWrapper}>
              <TextInput
                style={styles.discountInputBox}
                autoCapitalize="none"
                selectionColor={colors.aquaBlue}
                onChangeText={changedText => this.handleDiscountChanged(changedText)}
                value={this.state.discount} 
                underlineColorAndroid={'transparent'}
                keyboardType={'numeric'}
                placeholder={'%'}
                placeholderTextColor={'white'}
                blurOnSubmit={false}
                onSubmitEditing={() =>  this.addPromotion()}
              />
              <TouchableOpacity style={styles.createPromotionButton} activeOpacity={0.8} onPress={() => this.addPromotion()}>
                <Text style={styles.actionButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Toast ref="promotionToast" position={'top'} positionValue={230} />
        </View>
        {displayAlert && this.renderAlert()}
      </View>
    )
  }

  renderAlert = () => {
    return (
      <AlertBox
        visible={this.state.displayAlert}
        closeAlert={() => this.closeAlert()}
        message={'Are you sure you want to delete this promotion?'}
        onPress={() => this.removePromotion()}
      />
    )
  }

  closeAlert = () => {
    this.setState({ displayAlert: false, promotionId: undefined })
  }

  handleDiscountChanged = (value) => {
    if(value.length === 0) this.setState({ discount: '' })
    else if(Number(value) > 0  && Number(value) <= 100) this.setState({ discount: value })
  }

  renderActionButton = (buttonText, onPress) => {
    return (
      <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.actionButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    )
  }

  displayInvalidEmailMsg = () => {
    if(!validateEmail(this.state.user['email'])) {
      this.refs.errorToast.show('Correo electrónico inválido')
    }
  }

  requestDownloadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      return JSON.stringify(granted)
    } catch (err) {
      this.refs.errorToast.show('no se puede descargar')
    }
    return 
  }

  handleDownloadData = async () => {
    try {
      if (Platform.OS === 'ios') await this.fetchData()
      else {
        const granted = JSON.parse(await this.requestDownloadPermission())
        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) await this.fetchData()
      }
    } catch (error) {
      this.refs.errorToast.show('No se puede descargar')
    }
  }

  fetchData = async () => {
    this.setState({ displayProgressModal: true })
    try {
      const response = await apolloClient.query({
        query: DOWNLOAD_USERS_DATA,
        fetchPolicy: 'no-cache'
      })
      if(response && response.data && response.data.downloadUsersData) {
        const path = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir
        if(response.data.downloadUsersData.usersDataUrl) await this.downloadFile(path, response.data.downloadUsersData.usersDataUrl)
        if(response.data.downloadUsersData.shipmentDataUrl) await this.downloadFile(path, response.data.downloadUsersData.shipmentDataUrl)
        this.setState({ displayProgressModal: false })
        this.refs.toast.show('Descargado exitosamente')
      } else {
        this.setState({ displayProgressModal: false })
        this.refs.errorToast.show('No se puede descargar')
      }
    } catch (error) {
      console.log(error)
      this.setState({ displayProgressModal: false })
      this.refs.errorToast.show('No se puede descargar')
    }
  }

  downloadFile = async (path, url) => {
    const randomNum = parseInt(new Date().getTime() / 1000) 
    const pathToWrite = `${path}/CSV_${randomNum}.csv`

    await RNFetchBlob.config({
      path: pathToWrite,
      addAndroidDownloads : {
        path: pathToWrite,
        useDownloadManager: true,
        notification: true
      }
    })
    .fetch('GET', url)
    .then((res) => {
      console.log('downloaded')
    })
    .catch((error) => {
      console.log(error)
      this.refs.errorToast.show('No se puede descargar')
    })
  }

  renderAdminUserView = () => {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.keyboardAvoidingContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.logo} >
            <Logo width={250} height={250} />
          </View>
          <View style={styles.wrapper}>
            <TextInput
              style={styles.inlineLabelTextInput}
              autoCapitalize="none"
              selectionColor={colors.aquaBlue}
              onChangeText={changedText => this.editEmail(changedText)}
              placeholder={'Correo electrónico'}
              placeholderTextColor={colors.aquaBlue}
              value={this.state.user['email']} 
              underlineColorAndroid={'transparent'}
              onBlur={() => this.displayInvalidEmailMsg()}
            />
            <TouchableOpacity style={styles.chagePasswordButton} activeOpacity={0.8} onPress={() => this.openModal('changePassword')}>
              <Text style={styles.chagePasswordButtonText}>Cambiar contraseña</Text>
            </TouchableOpacity>
            {this.renderActionButton('USUARIOS', () => navigateToScreen(this.props.componentId, 'Users'))}
            {this.renderActionButton('PROMOCIONES', () => this.getPromotions())}
            {this.renderActionButton('NOTIFICACIONES', () => navigateToScreen(this.props.componentId, 'CreateNotification'))}
            {this.renderActionButton('DESCARGAR DATOS', () => this.handleDownloadData())}
          </View>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={() => this.handleLogout()}>
            <Text style={styles.actionButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  renderProressModal = () => {
    const { displayProgressModal } = this.state
    return (
      <Modal
        isOpen={displayProgressModal}
        coverScreen={true}
        style={styles.modal}
        swipeToClose={false}
        backButtonClose={false}
        backdropPressToClose={false}
      >
        <ActivityIndicator size={'large'} color={colors.white} />
        <Text style={styles.downloadingText}>Descargando...</Text>
      </Modal>
    )
  }

  handleLogout = async () => {
    await deleteData('userId')
    await deleteData('token')
    await deleteData('userType')
    await deleteData('email')
    await deleteData('username')
    await deleteData('userVehicle')
    goToAuth()
    await apolloClient.clearStore()
  }

  renderButton = (buttonText, onPress) => {
    return (
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    )
  }

  renderClientUserView = () => {
    const { user } = this.state
    return (
      <View style={styles.mainWrapper}>
        { user && user.image ? 
          <Image source={{ uri: user.image }} style={styles.profilePic} />
        :
          <View style={styles.picWrapper}>
            <Camera />
          </View>
        }
        <Text style={styles.titleText}>¿Cómo quieres realizar tu flete?</Text>
        {this.renderButton('Ayuda con mi traslado', () => navigateToScreen(this.props.componentId, 'ChooseLocation', {title: 'AYUDA CON MI TRASLADO'}))}
        {this.renderButton('Conozco el vehículo\nque necesito', () => navigateToScreen(this.props.componentId, 'ChooseVehicle'))}
      </View>
    )
  }

  onMapReady = () => {
    this.setState({ mapBottom: 0 })
    Geolocation.getCurrentPosition(info => {
      const { latitude, longitude } = info.coords;
      var region = { 
        latitude,
        longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009 
      };
      this.myMapView.animateToRegion(region);
      this.setState({ region: region });
    }, (error) => {
      
    });
  }

  renderCarrierUserView = () => {
    const { user, currentLocation } = this.state
    return (
      <View style={styles.container}>
        <InformationBar titleText={'Valor por hora'} value={`$${user['valuePerKm']}`} />
        <View style={styles.mapWrapper}>
          <MapView
            ref={ref => (this.myMapView = ref)}
            style={[styles.map, {marginBottom: this.state.mapBottom}]}
            initialRegion={this.state.region}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            onMapReady={this.onMapReady}
          >
            {(user && user.shipment && user.shipment.origin && user.shipment.origin.location) &&
              <Marker 
                pinColor={colors.lightGreen}
                coordinate={{latitude: Number(user.shipment.origin.location.lat), longitude: Number(user.shipment.origin.location.lng)}}
              />
            }
            {(user && user.shipment && user.shipment.destination && user.shipment.destination.location) &&
              <Marker 
                pinColor={colors.navyBlue}
                coordinate={{latitude: Number(user.shipment.destination.location.lat), longitude: Number(user.shipment.destination.location.lng)}}
              />
            }
            {(currentLocation && user && user.shipment && user.shipment.destination && user.shipment.destination.location) && 
              <MapViewDirections
                origin={{
                  'latitude': currentLocation.latitude,
                  'longitude': currentLocation.longitude
                }}
                destination={{
                  'latitude': Number(user.shipment.destination.location.lat),
                  'longitude': Number(user.shipment.destination.location.lng)
                }}
                strokeWidth={5}
                apikey={config.google.apiKey}
                resetOnChange={false}
              />
            }
          </MapView>
        </View>
        <View style={styles.bottomWrapper}>
          <View style={styles.switchWrapper}>
            <Text style={styles.buttonText}>Off / On</Text>
            <Switch 
              trackColor={{false: colors.blue, true: colors.blue}}
              thumbColor={colors.lightGreen}
              value={this.state.user['status']}
              onValueChange={value => this.updateCarrierStatus(value)}
            />
          </View>
          <View style={styles.detailsWrapper}>  
            { user && user.image ? 
              <Image source={{ uri: user.image }} style={styles.image} />
            :
              <View style={styles.imageWrapper}>
                <Camera />
              </View>
            }
            <View>
              <Text style={styles.userNameText}>{user.username}</Text>
              {user['rating'] > 0 && (
                <View style={styles.ratingWrapper}>
                  <Text style={styles.buttonText}>{user['rating']} / 5</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { loading, userType, user, displayModal, keyboardHeight, displayProgressModal } = this.state
    if (loading) return <Spinner backgroundColor={colors.lightBlue} indicatorColor={colors.blue} />  
    return (
      <View style={[styles.container, {backgroundColor: userType && userType === 'admin' ? colors.white : colors.lightBlue}]}>
        {(userType && userType !== 'admin') && <TopNavBar title={userType && userType === 'client' ? user['username'] : 'fecit transportista'} type = {"side_menu"} componentId={this.props.componentId} />}
        {(userType && userType === 'admin') && this.renderAdminUserView()}
        {(userType && userType === 'client') && this.renderClientUserView()}
        {(userType && userType === 'carrier') && this.renderCarrierUserView()}
        {(userType && userType !== 'admin') && <BottomNavBar componentId={this.props.componentId} />}
        <Toast 
          ref="errorToast" 
          keyboardHeight={keyboardHeight} 
          style={{ backgroundColor: colors.red }} 
          textStyle={{ color: colors.white }} 
        />
        <Toast ref="toast" />
        {displayModal && this.renderModal()}
        {displayProgressModal && this.renderProressModal()}
      </View>
    );
  }
}

const withMutation = compose(
  graphql(ADD_PROMOTION, { name: 'addPromotion' }),
  graphql(REMOVE_PROMOTION, { name: 'removePromotion' }),
  graphql(UPDATE_CARRIER_USER_STATUS, { name: 'updateCarrierStatus' }),
  graphql(UPDATE_LOCATION, { name: 'updateLocation' }),
  graphql(EDIT_USER_MUTATION, { name: 'editUser' }),
  graphql(SET_USER_DEVICE_TOKEN, { name: 'setUserDeviceToken' })
)(Home);

export default withMutation;
