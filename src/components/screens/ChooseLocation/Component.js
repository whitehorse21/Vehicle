import React, {Component} from 'react';
import {View, Text, TextInput, Image, Alert, Platform} from 'react-native';
import styles from './Style';
import { colors } from '../../../colors';
import {images} from '../../../../assets';
import config from '../../../../config';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Permissions from "react-native-permissions";
import AndroidOpenSettings from "react-native-android-open-settings";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Geolocation from '@react-native-community/geolocation';
import Spinner from '../../common/Spinner/Component';
import Toast from '../../common/Toast/Component';
import TopNavBar from '../../common/TopNavBar/Component';
import SimpleButton from '../../common/SimpleButton/Component';
import InformationBar from '../../common/InformationBar/Component';
import {navigateToScreen} from '../../../navigation/navigation_settings';

const default_region = {
  	latitude: -34.605914,
  	longitude: -58.453213,
  	latitudeDelta: 0.009,
  	longitudeDelta: 0.009,
}

class ChooseLocation extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	loading: true,
	    	originLocation: null,
	    	destinationLocation: null,
	    	origin: '',
	    	destination: '',
	    	region: default_region,
	    	distance: 0
	    }
	}

	componentWillMount() {
		this.checkLocationPermission()
	}

	checkLocationPermission = () => {
		Permissions.check('location').then((response) => {
	      	if (response === 'authorized') {
	        	this.getCurrentLocation()
	      	} else if (response === 'denied' || response === 'restricted') {
	        	this.alertForLocationPermission()
	      	} else {
	        	this.requestLocationPermission()
	      	} 
	    })
	}

	alertForLocationPermission = () => {
		this.setState({ loading: false })
		Alert.alert(
      		'Allow location access',
      		'Please enable location permission for fecit in your app settings',
      		[
        		{
          			text: 'Don\'t Allow',
          			onPress: () => this.setState({ loading: false }),
          			style: 'cancel'
        		},
        		{ text: 'OK', onPress: () => Platform.OS === 'android' ? AndroidOpenSettings.appDetailsSettings() : Permissions.openSettings() },
      		]
    	)
	}

	requestLocationPermission = () => {
		Permissions.request('location').then((response) => {
      		if (response === 'authorized') this.getCurrentLocation()
      		else this.setState({ loading: false })
    	})
	}

	getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition(
	      	(position) => {
	      		fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + config.google.apiKey)
			    .then((response) => response.json())
		        .then((responseJson) => {
		        	this.setState({
		        		originLocation: {latitude: position.coords.latitude, longitude: position.coords.longitude},
		        		origin: responseJson.results[0].formatted_address, 
		        		region: {latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: 0.009, longitudeDelta: 0.009},
		        		loading: false
		        	})
		  		})
		  		.catch((error) => { 
			        this.setState({loading: false})
		      	});
	      	},
	      	(error) => {
	       		this.setState({loading: false})
	      	},
	     	{ enableHighAccuracy: true, timeout: 20000 }
	    )
	}

	displayLocationIcon = (type) => {
		return (
			<Image 
				source={images.location} 
				resizeMode={'contain'} 
				style={[ styles.locationIcon, { tintColor: type === 'origin' ? colors.lightGreen : colors.navyBlue }]} 
			/>
		)
	}

	renderLocationInput = (type, placeholder) => {
		return (
			<GooglePlacesAutocomplete
				getDefaultValue={() => this.state[type]}
				renderLeftButton={() => this.displayLocationIcon(type)}
	            placeholder={placeholder}
	            minLength={2} 
	            returnKeyType={'search'} 
	            listViewDisplayed={false} 
	            fetchDetails={true}            
	            onPress={(data, details) => this.selectLocation(type, data, details)}
	          	query={{
	              key: config.google.apiKey,
	              language: 'en', 
	              location: -34.605914 + ',' + -58.453213,
	              radius: 200000,
	              strictbounds: true
	            }}
	            styles={{
	              textInputContainer: styles.textInputContainer,
	              textInput: styles.textInput
	            }}
	            enablePoweredByContainer={false}
	            debounce={200} 
	            textInputProps={{
	            	onChangeText: (text) => this.handleInputChange(type, text) 
	            }}
	        />
	    )
	}

	handleInputChange = (type, text) => {
		if(type === 'origin' && text.length === 0) {
			this.setState({ origin: '', originLocation: null, distance: 0 })
		} else if(type === 'destination' && text.length === 0) {
			this.setState({ destination: '', destinationLocation: null, distance: 0 })
		} 
	}

	selectLocation = async (type, data, details = null) => {
	    if(details) {
	     	const latDelta = Number(details.geometry.viewport.northeast.lat) - Number(details.geometry.viewport.southwest.lat)
	      	const lngDelta = Number(details.geometry.viewport.northeast.lng) - Number(details.geometry.viewport.southwest.lng)

	      	let region = {
	        	latitude: details.geometry.location.lat,
	        	longitude: details.geometry.location.lng,
	        	latitudeDelta: latDelta,
	        	longitudeDelta: lngDelta
	      	}

	      	if(type === 'origin') {
		      	await this.setState({
		        	originLocation: {latitude: details.geometry.location.lat, longitude: details.geometry.location.lng},
		        	region: region,
		        	origin: data.description
		      	})
		    } else {
		    	await this.setState({
		        	destinationLocation: {latitude: details.geometry.location.lat, longitude: details.geometry.location.lng},
		        	region: region,
		        	destination:  data.description
		      	})
		    }  
		    if(this.state.originLocation && this.state.destinationLocation) this.getDistance()
	    }
	}

	getDistance = () => {
		const origin = this.state.originLocation['latitude'] + "," + this.state.originLocation['longitude'];
       	const destination = this.state.destinationLocation['latitude'] + "," + this.state.destinationLocation['longitude'];
		fetch('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin + '&destinations=' + destination + '&key=' + config.google.apiKey)
		    .then((response) => response.json())
	        .then((responseJson) => {
	        	if(responseJson.status === 'OK') this.setState({ distance: (responseJson.rows[0].elements[0].distance.value / 1000).toFixed(1)})
	  		})
	  		.catch((error) => { 
		        console.log(error)
	      	})
	}

	handleButtonPress = () => {
		const { props } = this
		const {origin, destination, distance} = this.state
		if(origin === '') {
			this.refs.toast.show('Please select origin')
		} else if(destination === '') {
			this.refs.toast.show('Please select destination')
		} else {
			const data = {
				origin,
				destination,
				distance
			}
			if(props.data && props.data.dimensions) data['dimensions'] = props.data.dimensions
			if(props.data && props.data.weight) data['weight'] = props.data.weight
			navigateToScreen(this.props.componentId, 'FreightInfo', {data})
		}
	}

	render() {
		const { props } = this
		const { loading, originLocation, destinationLocation, distance } = this.state
		return (
			<View style={styles.container}>
				<TopNavBar title={props.title} componentId={this.props.componentId} />
				{ loading ? 
            		<Spinner backgroundColor={colors.white} indicatorColor={colors.blue} /> 
          		:
          			<View style={styles.container}>
						<InformationBar titleText={'Distancia'} value={`${distance} Kilómentros`} />
						<KeyboardAwareScrollView 
				          	contentContainerStyle={styles.keyboardAvoidingContainer}
				          	showsVerticalScrollIndicator={false}
				          	bounces={false}
				        >
					        <View style={styles.mapWrapper}>
					        	<MapView
									ref={ref => (this.myMapView = ref)}
					        		style={styles.map}
					        		initialRegion={this.state.region}
								    provider={PROVIDER_GOOGLE}
									showsUserLocation
          							showsMyLocationButton
									onMapReady={() => {
										
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
										
									}}
								>
									{originLocation &&
							            <Marker 
							              	pinColor={colors.lightGreen}
							              	coordinate={originLocation}
							            />
							        }
							        {destinationLocation &&
							            <Marker 
							              	pinColor={colors.navyBlue}
							              	coordinate={destinationLocation}
							            />
							        }
								</MapView>
					        </View>
					        <View style={styles.detailsWrapper}>
					        	<Text style={styles.titleText}>¿Cuál es el origen y el destino del flete?</Text>
					        	{this.renderLocationInput('origin', 'Origen')}
					        	{this.renderLocationInput('destination', 'Destino')}
					        	<SimpleButton buttonText={'continuar'} onPress={() => this.handleButtonPress()} />
					        </View>
					    </KeyboardAwareScrollView> 
					</View>
				}
				<Toast ref="toast" positionValue={80} />
			</View>
		)
	}
}

export default ChooseLocation