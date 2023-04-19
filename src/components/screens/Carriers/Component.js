import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, FlatList, Platform, Alert} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from "moment";
import Permissions, {PERMISSIONS, RESULTS} from "react-native-permissions";
import Geolocation from '@react-native-community/geolocation';
import AndroidOpenSettings from "react-native-android-open-settings";
import apolloClient from '../../../graphql/client';
import {GET_CARRIER_USERS, SEND_FREIGHT_REQUEST} from '../../../graphql/queries';
import styles from './Style';
import {colors} from '../../../colors';
import {images, Close} from '../../../../assets';
import Spinner from '../../common/Spinner/Component';
import Toast from '../../common/Toast/Component';
import TopNavBar from '../../common/TopNavBar/Component';
import InformationBar from '../../common/InformationBar/Component';
import ModalBox from '../../common/ModalBox/Component';
import CloseModalButton from '../../common/CloseModalButton/Component'

class Carriers extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	loading: true,
	    	users: [],
	    	displayModal: false,
	    	filter: {
	    	 	fromDate: props.shipment && props.shipment.fromDate ? props.shipment.fromDate : undefined, 
	    	 	toDate: props.shipment && props.shipment.toDate ? props.shipment.toDate : undefined, 
	    	 	dimension: props.shipment && props.shipment.dimensions ? props.shipment.dimensions : undefined, 
	    	 	weight: props.shipment && props.shipment.weight ? props.shipment.weight : undefined,
	    	 	cashPayment: false,
	    	 	online: false,
	    	 	sort: undefined,
	    		sortByRating: false,
	    		closerCarriers: false
	    	},
	    	oldFilter: { cashPayment: false, online: false, sort: undefined, sortByRating: false, closerCarriers: false },
	    	userLocation: { lat: '', lng: ''}
	    }
	    Navigation.events().bindComponent(this)
	}

	async componentDidAppear() {
		console.log("1212121212")
		await this.getCarrierUsers()
	}

	getCarrierUsers = async () => {
		this.setState({ loading: true })
		const { filter, userLocation } = this.state
		let filterObj = {filter: {}, sort: ''}
		if(filter.sort) filterObj.sort = filter.sort
		if(filter.dimension) filterObj.filter['dimension'] = filter.dimension
		if(filter.weight) filterObj.filter['weight'] = filter.weight
		if(filter.cashPayment) filterObj.filter['cashPayment'] = true
		if(filter.online) filterObj.filter['online'] = true
		if(filter.sortByRating) filterObj.sortByRating = 'hr'
		if(filter.closerCarriers && userLocation && userLocation.lat && userLocation.lng) {
			filterObj.filter['closer'] = true
			filterObj['location'] = userLocation
		}
		
		try {
	      	const result = await apolloClient.query({
	        	query: GET_CARRIER_USERS,
	        	variables: {
	        		...filterObj
	        	},
	        	fetchPolicy: 'no-cache'
	      	})
	      	if (result && result.data && result.data.getCarrierUsers) {
	        	this.setState({ users: result.data.getCarrierUsers })
	      	}
	      	this.setState({ loading: false })
	    } catch (error) {
	     	this.setState({ loading: false, users: [] })
	    }
	}

	sendQuoteRequest = async (carrierId) => {
		if(this.props.shipment && this.props.shipment.shipmentId) {
			try {
		      	const result = await apolloClient.query({
		        	query: SEND_FREIGHT_REQUEST,
		        	variables: {
		        		userId: carrierId,
		        		shipmentId: this.props.shipment.shipmentId
		        	},
		        	fetchPolicy: 'no-cache'
		      	})
		      	if (result && result.data && result.data.sendFreightRequest) {
		        	this.refs.toast.show('Solicitud enviada')
		      	}
		    } catch (error) {
		    	try {
		    		if(error.graphQLErrors[0].message === 'Freight request already sent to this user') this.refs.toast.show('Solicitud de carga ya enviada a este usuario')
		    		else this.refs.toast.show(error.graphQLErrors[0].message)
			    } catch (e) {
			        this.refs.toast.show('no se puede enviar la solicitud')
			    }
		    }
		} else {
			this.refs.toast.show('no se puede enviar la solicitud')
		}
	}

	handleCloserCarriersFilter = () => {
		const { filter } = this.state
		if(filter['closerCarriers'] === true) {
			filter['closerCarriers'] = false
			this.setState({ filter })
		} else {
			this.checkLocationPermission()
		}	
	}

	checkLocationPermission = () => {
		Permissions.check('location').then((response) => {
	      	if (response === 'authorized') {
	        	this.getUserLocation()
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
          			onPress: () => console.log('Denied location permission'),
          			style: 'cancel'
        		},
        		{ text: 'OK', onPress: () => Platform.OS === 'android' ? AndroidOpenSettings.appDetailsSettings() : Permissions.openSettings() },
      		]
    	)
	}

	requestLocationPermission = () => {
		if(Platform.OS == "android") {
			Permissions.request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((response) => {
				if (response === 'authorized' || response === RESULTS.GRANTED) {
				  this.getUserLocation();
			  } else {
				  console.log(JSON.stringify(response))
			  }
		  })
		} else if(Platform.OS == "ios") {
			Permissions.request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((response) => {
				if (response === 'authorized' || response === RESULTS.GRANTED ) {
				  this.getUserLocation();
			  } else {
				  console.log(JSON.stringify(response))
			  }
		  })
		}
		
	}

	getUserLocation = () => {
		Geolocation.getCurrentPosition(info => {
			const { filter } = this.state
			filter['closerCarriers'] = true
			this.setState({ userLocation: {lat: info.coords.latitude, lng: info.coords.longitude}, filter })
		}, (error) => {
			this.refs.errorToast.show('Permiso de ubicación requerido')
		});

	}

	openModal = () => {
		const { oldFilter } = this.state
		this.setState({ displayModal: true, filter: {...this.state.filter, cashPayment: oldFilter.cashPayment, online: oldFilter.online, sort: oldFilter.sort, sortByRating: oldFilter.sortByRating, closerCarriers: oldFilter.closerCarriers } })
	}

	closeModal = () => {
		this.setState({ displayModal: false })
	}

	removeFilter = async (type) => {
		const { filter } = this.state
		if(type === 'date') {
			filter['fromDate'] = undefined
			filter['toDate'] = undefined
		} else {
			filter[type] = undefined
		}	
		await this.setState({ filter })
		await this.getCarrierUsers()
	}

	handleFilter = (type) => {
		const { filter } = this.state
		if(filter[type] === true) filter[type] = false
		else filter[type] = true
		this.setState({ filter })
	}

	handleSortType = (type) => {
		const { filter } = this.state
		if(filter['sort'] === type) filter['sort'] = undefined
		else filter['sort'] = type
		this.setState({ filter })
	}

	applyFilter = async () => {
		const { filter } = this.state
		await this.setState({ displayModal: false, oldFilter: { cashPayment: filter.cashPayment, online: filter.online, sort: filter.sort, sortByRating: filter.sortByRating, closerCarriers: filter.closerCarriers } })
		await this.getCarrierUsers()
	}

	renderFilter = (text, type) => {
		return (
			<View style={styles.innerWrapper}>
	  			<Text style={styles.filterText} numberOfLines={1} ellipsizeMode={'tail'}>{text}</Text>
	  			<TouchableOpacity style={styles.deleteWrapper} onPress={() => this.removeFilter(type)}>
	  				<Text style={styles.deleteIcon}>&#xf00d;</Text>
	  			</TouchableOpacity>
	  		</View>
		)
	}

	renderFilteredCarriers = () => {
		if(this.state.users &&  this.state.users.length > 0) {
			return (
				<View style={styles.flatListWrapper}>
	     			<FlatList
			            keyExtractor={(user, index) => index.toString()}
			            data={this.state.users}
			            extraData={this.state}
			            renderItem={user => this.renderCarrierInfo(user)}
		              	bounces={false}
	          		/>
	     		</View>
			)
		} else {
			return <Text style={styles.notFoundText}>No carriers found</Text>
		}
	}

	renderCarrierInfo = ({ item, index }) => {
		return (
			<View style={styles.rowWrapper} key={item._id}>
				{ item.profile && item.profile.image ?
					<Image source={{ uri: item.profile.image }} style={styles.image} />
				:
					<View style={styles.imageWrapper}>
						<Image source={images.camera} style={styles.cameraIcon} />
	    			</View>
				}
	    		<View style={styles.statusWrapper}>
	    			{(item.profile && item.profile.vehical && item.profile.vehical.status) && (
	    				<View style={styles.bubble} />
		    		)}
		    	</View>
	    		<View style={styles.rightWrapper}>
	    			<View style={styles.wrapper}>
	    				<Text style={styles.nameText} numberOfLines={1} ellipsizeMode={'tail'}>{item.username}</Text>
	    				{item.rating > 0 && <Text style={styles.ratingText}>{item.rating} / 5</Text>}
	   				</View>
	   				<View style={styles.wrapper}>
   						{(item.profile && item.profile.neighborhood) && (
   							<View style={styles.buttonContainer}>
	   							<Image source={images.location} resizeMode={'contain'} style={styles.locationIcon} />
	   						 	<Text style={styles.originText} numberOfLines={1} ellipsizeMode={'tail'}>{item.profile.neighborhood}</Text>
	   						</View>
	   					)}
	   					{(item.profile && item.profile.vehical && item.profile.vehical.valuePerKm) && (
		   					<View style={styles.valueWrapper}>
		   						<Text style={styles.valueText}>$ {item.profile.vehical.valuePerKm} Km</Text>
		   					</View>
		   				)}
	   				</View>
	   				<TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.8} onPress={() => this.sendQuoteRequest(item._id)}>
	   					<Text style={styles.btnText}>Enviar solicitud</Text>
	   				</TouchableOpacity>
	    		</View>
			</View>
		)
	}

	renderButton = (buttonText, type) => {
		const { filter } = this.state
		return (
			<TouchableOpacity 
				style={[styles.button, {backgroundColor: filter[type] === true ? colors.aquaBlue : colors.blue }]} 
				activeOpacity={0.8} 
				onPress={() => this.handleFilter(type)}
			>
				<Text style={styles.btnText}>{buttonText}</Text>
			</TouchableOpacity>
		)
	}

	renderModal = () => {
		const { filter } = this.state
	    return (
		    <ModalBox
		        displayModal={this.state.displayModal}
		        closeModal={() => this.closeModal()}
		        backgroundColor={colors.aquaBlue}
		    >
		    	<View style={styles.modalView}>
		    		<View style={styles.wrapper}>
						<View style={styles.closeWrapper}>
							<CloseModalButton onPress={this.closeModal}/>
						</View>
		    			{/* <TouchableOpacity activeOpacity={0.8} onPress={() => this.closeModal()} style={styles.closeWrapper}>
		    				<Close />
		    			</TouchableOpacity> */}
		    			<TouchableOpacity activeOpacity={0.8} onPress={() => this.applyFilter()}>
		    				<Text style={styles.applyText}>Aplicar</Text>
		    			</TouchableOpacity>
		    		</View>
		    		<View style={styles.mainWrapper}>
		    			<View style={styles.buttonContainer}>
		    				<TouchableOpacity 
		    					style={[styles.priceBtnWrapper, {backgroundColor: filter.sort && filter.sort === 'lp' ? colors.aquaBlue : colors.blue }]} 
		    					activeOpacity={0.8} 
		    					onPress={() => this.handleSortType('lp')}
		    				>
		    					<Text style={styles.btnText}>Menor precio</Text>
		    				</TouchableOpacity>
		    				{this.renderButton('Pago en\nefectivo', 'cashPayment')}
		    				<TouchableOpacity 
								style={[styles.button, {backgroundColor: filter['closerCarriers'] === true ? colors.aquaBlue : colors.blue }]} 
								activeOpacity={0.8} 
								onPress={() => this.handleCloserCarriersFilter()}
							>
								<Text style={styles.btnText}>{`Más\ncercanos`}</Text>
							</TouchableOpacity>
		    			</View>
		    			<View style={[styles.buttonContainer, styles.top]}>
		    				<TouchableOpacity 
		    					style={[styles.priceBtnWrapper, {backgroundColor: filter.sort && filter.sort === 'hp' ? colors.aquaBlue : colors.blue }]} 
		    					activeOpacity={0.8} 
		    					onPress={() => this.handleSortType('hp')}
		    				>
		    					<Text style={styles.btnText}>Mayor precio</Text>
		    				</TouchableOpacity>
		    				{this.renderButton('Mejores\ncalificaciones', 'sortByRating')}
		    				{this.renderButton('Online', 'online')}
		    			</View>
		    		</View>
		    		<Toast ref="errorToast" position={'top'} positionValue={250} />
		    	</View>
		    </ModalBox>
	    )
	}

	getDimension = (dimension) => {
		if(dimension) {
			let dimensionValue = ''
			if(dimension.width) dimensionValue = dimension.width 
			if(dimension.height) dimensionValue += 'x' + dimension.height 
			if(dimension.length) dimensionValue += 'x' + dimension.length 
			return dimensionValue
		}
		return;
	}

	render() {
		const { loading, filter } = this.state

		return (
			<View style={styles.container}>
				<TopNavBar title={'RESULTADOS DE BÚSQUEDA'} componentId={this.props.componentId} />
				<InformationBar from={'filterScreen'} onPress={() => this.openModal()} />
		        <View style={styles.filterWrapper}>
			       	<View style={styles.filterContainer}>
			       		{(filter.fromDate && filter.toDate) && this.renderFilter(`${moment(filter.fromDate).format('DD/MM') } - ${moment(filter.toDate).format('DD/MM')}`, 'date')}
			       		{filter.dimension && this.renderFilter(this.getDimension(filter.dimension), 'dimension')}
			       	</View>
			       	{filter.weight && this.renderFilter(filter.weight, 'weight')}
			    </View>
			    {loading ? 
          			<Spinner backgroundColor={colors.lightBlue} indicatorColor={colors.blue} />  
        		:
			    	this.renderFilteredCarriers()
			    }
			    <Toast ref="toast" style={{ backgroundColor: colors.blue }} textStyle={{ color: colors.lightBlue }} />
			    {this.renderModal()}
			</View>
		)
	}
}

export default Carriers