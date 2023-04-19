import React, {Component} from "react";
import {TouchableOpacity, Image, View, Text, Platform, ScrollView, TextInput, FlatList, AppState, Keyboard} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { graphql } from 'react-apollo';
import {connect} from "react-redux";
import apolloClient from '../../../graphql/client';
import config from '../../../../config';
import {GET_VEHICLE_TYPES, GET_USER_DETAILS, GET_AGENDA, GET_FREIGHT_REQUESTS} from '../../../graphql/queries';
import {EDIT_USER_MUTATION} from '../../../graphql/mutations';
import CalendarPicker from 'react-native-calendar-picker';
import Permissions from 'react-native-permissions';
import ActionSheet from 'react-native-actionsheet';
import styles from './Style';
import {colors} from '../../../colors';
import {goToAuth, navigateToScreen} from '../../../navigation/navigation_settings';
import Spinner from '../../common/Spinner/Component';
import ModalBox from '../../common/ModalBox/Component';
import TermsAndService from '../../common/TermsAndService/Component';
import PremiumPayment from '../../common/PremiumPayment/Component';
import SimpleButton from '../../common/SimpleButton/Component';
import ChangePassword from '../../common/ChangePassword/Component';
import WrongInputWarning from '../../common/WrongInputWarning/Component';
import Toast from '../../common/Toast/Component';
import VehicleTypes from '../../common/VehicleTypes/Component';
import {Bar, Camera, Chat, Close, images} from '../../../../assets';
import {getData, deleteData, setData} from '../../../storage';
import {ImagePickerlaunchCamera, ImagePickerlaunchImageLibrary, getFileExtension} from '../../../utils/AppUtils';
import {uploadToS3} from '../../../utils/aws';
import {validateEmail} from '../../../utils/validators';
import CloseModalButton from '../../common/CloseModalButton/Component'

var moment = require('moment');
require('moment/locale/es');

class SideMenu extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	loading: false,
	    	userType: undefined,
	      	displayModal: false,
	      	type: '',
	      	username: '',
	      	email: '',
	      	activeTab: 'inProgressTrips',
	      	carrierType: undefined,
	      	displayVehicleTypes: false,
	      	vehicle: {brand: '', color: '', model: '', plateNumber: '', valuePerKm: '', vehicleType: {id: '', name: ''}},
	      	displayFreightInfo: false,
	      	displaySelectBox: false,
      		neighborhoods: [],
	      	carrierNeighborhood: undefined,
	      	errorText: undefined,
	      	agenda: [],
	      	selectedFreight: undefined,
	      	tripsHistory: [],
	      	photoPermission: '',
		    cameraPermission: '',
		    media: undefined,
		    disabledButton: false,
		    keyboardHeight: 0,
		    selectedDate: null
    	}
    	Navigation.events().bindComponent(this)
    	this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    	this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
	}

	async componentWillMount() {
		AppState.addEventListener('change', this.checkPermission)
		const userType = JSON.parse(await getData('userType'))
    	const username = JSON.parse(await getData('username'))
    	this.setState({ userType, username })
	    try {
	      	const result = await apolloClient.query({
	        	query: GET_USER_DETAILS,
	        	fetchPolicy: 'no-cache'
	      	})
	      	
	      	if(result && result.data && result.data.getUserDetails) {
	        	let user = result.data.getUserDetails
	        	if(user && user.email) this.setState({email:  user.email})
	        	if(user && user.profile && user.profile.image) this.setState({media:  user.profile.image})
	        	if(user && user.roles === 'carrier' && user.profile && user.profile.carrierType) this.setState({ carrierType: user.profile.carrierType })
	        	if(user && user.roles === 'carrier' && user.profile && user.profile.neighborhood) this.setState({ carrierNeighborhood: user.profile.neighborhood })
	        }
	    } catch (error) {
	      	console.log(error)
	    }
	}	

  	componentDidAppear() {
    	this.checkPermission()
  	}

  	componentWillUnmount() {
    	AppState.removeEventListener('change', this.checkPermission)
    	this.keyboardDidShowListener.remove()
     	this.keyboardDidHideListener.remove()
  	}

  	checkPermission = () => {
    	Permissions.checkMultiple(['camera', 'photo']).then((response) => {
      		this.setState({
        		photoPermission: response.photo,
        		cameraPermission: response.camera,
      		});
    	});
  	}

  	keyboardDidShow = (e) => {
	    this.setState({ keyboardHeight: e.endCoordinates.height })
	}

	keyboardDidHide = () => {
	    this.setState({ keyboardHeight: 0 })
	}

	editUserName = async (username) => {
		this.setState({username})
		if(username && username.length > 0) {
			try {
			    const res = await this.props.editUserMutation({
			        variables: {
			          	username
			        }
			    })
			    await setData('username', username)
		    } catch (error) {
		      console.log(error)
		    }
		}
	}

	editEmail = async (email) => {
		this.setState({email})
		if(validateEmail(email)) {
			try {
			    const res = await this.props.editUserMutation({
			        variables: {
			          	email
			        }
			    })
			    await setData('email', email)
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

	editVehicle = async () => {
	    if (this.validateVehicleInputs()) {
		    const { vehicle } = this.state
		      try {
		        const result = await this.props.editUserMutation({
		          variables: {
		            vehicalTypeId: vehicle.vehicleType['id'],
		            brand: vehicle.brand,
		            color: vehicle.color,
		            model: vehicle.model,
		            plateNumber: vehicle.plateNumber,
		            valuePerKm: vehicle.valuePerKm
		          }
		        })
		        if (result && result.data && result.data.editUser) {
		          	await setData('userVehicle',result.data.editUser.profile.vehical)
		          	await this.setState({ displayModal: false })
		          	this.refs.toast.show('Datos del vehículo actualizados')
		        }
		    } catch (error) {
		        await this.setState({ displayModal: false })
		        this.refs.errorToast.show('no puede actualizar datos del vehículo')
		    }
	    }
  	}	

  	editCarrierType = async(type) => {
  		try {
		    const res = await this.props.editUserMutation({
		        variables: {
		          	carrierType: type
		        }
		    })
		    if(res && res.data && res.data.editUser && res.data.editUser.profile && res.data.editUser.profile.carrierType) {
		    	await this.setState({ carrierType: res.data.editUser.profile.carrierType })
		    	this.refs.toast.show('Type updated successfully')
		    }
		    this.setState({ displayModal: false })
	    } catch (error) {
	    	this.setState({ displayModal: false })
	      	this.refs.errorToast.show('Cannot update type')
	    }
  	}

  	setImage = async (response) => {
	    if(response && response.uri) {
	    	this.setState({ disabledButton: true })
	      	try {
	        	const url = await uploadToS3(response.uri, getFileExtension(response.fileName), response.width, response.height, response.size)
	        	if(url) {
	          		await this.props.editUserMutation({
	            		variables: {
	              			image: url
	            		}
	          		})
	          		this.setState({ media: response.uri, disabledButton: false })
	          		this.refs.toast.show('Foto de perfil Actualizada')
		        } else {
		        	this.setState({ disabledButton: false })
		          	this.refs.errorToast.show('Foto de perfil no Actualizada')
		        }
	    	} catch (e) {
	    		this.setState({ disabledButton: false })
	        	this.refs.errorToast.show('Foto de perfil no Actualizada')
	      	}
	    }
  	}

  	openVehicleDataView = async () => {
  		this.setState({ type: 'vehicleData', displayModal: true })
	    const userVehicle = JSON.parse(await getData('userVehicle'))
	    if(userVehicle) {
	    	this.setState({ loading: true, vehicle: {brand: userVehicle.brand, color: userVehicle.color, model: userVehicle.model, plateNumber: userVehicle.plateNumber, valuePerKm: userVehicle.valuePerKm, vehicleType: {id: userVehicle.vehicalTypeId, name: ''}} })
	    	try {
			    const result = await apolloClient.query({
			        query: GET_VEHICLE_TYPES,
			        variables: { 
			        	vehicleId: userVehicle.vehicalTypeId 
			       	},
			        fetchPolicy: 'no-cache'
			    })
			    if (result && result.data && result.data.getVehicalTypes) {
			    	const { vehicle } = this.state
				    vehicle.vehicleType['name'] = result.data.getVehicalTypes[0].name
				    this.setState({ vehicle })
			    }     
			    this.setState({ loading: false })
		    } catch (error) {
		      this.setState({ loading: false })
		    }
	    }
	}

	openAgendaView = async () => {
		this.setState({ type: 'agenda', displayModal: true, loading: true })
		const agenda = []
		try {
		    const result = await apolloClient.query({
		        query: GET_AGENDA,
		        fetchPolicy: 'no-cache'
		    })
		    if (result && result.data && result.data.getAgenda) {
			    this.setState({ agenda: result.data.getAgenda })
		    }     
		    this.setState({ loading: false })
	    } catch (error) {
	      	this.setState({ loading: false })
	    }
	}

	setTripsHistory = async () => {
		const status = this.state.activeTab && this.state.activeTab === 'inProgressTrips' ? 0 : 1
		try {
	      	this.setState({ loading: true });
	      	const result = await apolloClient.query({
	        	query: GET_FREIGHT_REQUESTS,
	        	variables: {
	          		status
	        	},
	        	fetchPolicy: 'no-cache'
	      	})
	      	if (result && result.data && result.data.getFreightRequests) {
	        	this.setState({ tripsHistory: result.data.getFreightRequests })
	      	}
	      	this.setState({ loading: false })
	    } catch (error) {
	      	this.setState({ loading: false })
	    }
	}

	openHistoryView = () => {
		this.setState({ displayModal: true, type: 'tripsHistory'})
		this.setTripsHistory()
	}

  	validateVehicleInputs = () => {
	    const { vehicle } = this.state
	    if (vehicle.vehicleType['id'] === '') {
	      this.setState({ errorText: 'Por favor seleccione el tipo de vehículo' })
	      return false
	    }
	    if (vehicle.brand === '') {
	      this.setState({ errorText: 'Por favor ingrese marca' })
	      return false
	    }
	    if (vehicle.color === '') {
	      this.setState({ errorText: 'Por favor ingrese color' })
	      return false
	    } 
	    if (vehicle.model === '') {
	      this.setState({ errorText: 'Por favor ingrese modelo' })
	      return false
	    } 
	    if (vehicle.plateNumber === '') {
	      this.setState({ errorText: 'Por favor ingrese patente' })
	      return false
	    } 
	    if (vehicle.valuePerKm === '') {
	      this.setState({ errorText: 'Por favor ingrese valor por km' })
	      return false
	    } 
	    return true
	}

	openModal = (type) => {
		this.setState({ type, displayModal: true})
	}

	closeModal = () => {
		this.setState({ displayModal: false, activeTab: 'inProgressTrips', displayVehicleTypes: false, errorText: undefined, displayFreightInfo: false, selectedFreight: undefined, selectedDate: null})
	}

	renderModal = () => {
		const {type} = this.state
	    return (
		    <ModalBox
		        displayModal={this.state.displayModal}
		        closeModal={() => this.closeModal()}
		        style={{ backgroundColor: type === 'premiumPayment' ? colors.white : colors.blue, height: type === 'agenda' ? 350 : 318 }}
		        backgroundColor={type === 'premiumPayment' ? colors.white : colors.blue}
		    >
		    	{this.renderModalView()}
		    </ModalBox>
	    )
	}

	renderModalView = () => {
		const {type} = this.state
		if(type === 'termsAndService') {
			return <TermsAndService onClosePress={() => this.closeModal()} />
		}
		if(type === 'changePassword') {
			return <ChangePassword onPress={() => this.passwordChangeMsg()} onClosePress={() => this.closeModal()}/>
		}
		if(type === 'tripsHistory') {
			return this.tripsHistoryView()
		}
		if(type === 'changeAccountType') {
			return this.changeAccountTypeView()
		}
		if(type === 'premiumPayment') {
			return <PremiumPayment value={100} onPress={() => this.closePremiumPaymentModal()} closeModal={() => this.closeModal()}/> 
		}
		if(type === 'vehicleData') {
			return this.vehicleDataView()
		}
		if(type === 'agenda') {
			return this.agendaView()
		}
	}

	closePremiumPaymentModal = async () => {
		await this.setState({displayModal: false, carrierType: 'premium'})
		await this.refs.toast.show('Type updated successfully')
	}

	passwordChangeMsg = async () => {
		await this.setState({displayModal: false})
		await this.refs.toast.show('Contraseña modificada con éxito')
	}

	handleNeighborhoodSelection = async (selectedNeighborhood) => {
		try {
		    const res = await this.props.editUserMutation({
		        variables: {
		          	neighborhood: selectedNeighborhood
		        }
		    })
		    if(res && res.data && res.data.editUser && res.data.editUser.profile && res.data.editUser.profile.neighborhood) {
		    	this.setState({ carrierNeighborhood: selectedNeighborhood })
		    	this.refs.toast.show('Neighborhood updated successfully')
		    }
		    this.setState({ displaySelectBox: false })
	    } catch (error) {
	    	this.setState({ displaySelectBox: false })
	      	this.refs.errorToast.show('Cannot update neighborhood')
	    }
	}

	handleTabChanged = async (type) => {
	    await this.setState({ activeTab: type })
	    this.setTripsHistory()
	}

	renderRecord = ({item, index}) => {
		const { activeTab, userType } = this.state 
		return (
			<View key={index}>
				<View style={styles.rowWrapper}>
					<Image source={activeTab === 'inProgressTrips' ? images.boxIcon : images.package} style={styles.boxImage} resizeMode={'contain'} />
					<View>
						<Text style={styles.recordText}>Envio: {item.shipment.description}</Text>
						<Text style={styles.recordText}>Origen: {item.shipment.origin.address}</Text>
						<Text style={styles.recordText}>Destino: {item.shipment.destination.address}</Text>
						{item.shipment.distance > 0 && <Text style={styles.recordText}>Recorrido: {item.shipment.distance} kilómetros</Text>}
						<Text style={styles.recordText}>Fecha: {moment(item.shipment.fromDate).format('D / M')} - {moment(item.shipment.toDate).format('D / M')}</Text>
					</View>
				</View>
				<View style={styles.rowWrapper}>
					{ item.profile && item.profile.image ? 
						<Image source={{ uri: item.profile.image }} style={styles.avtarWrapper} />
					:
						<View style={styles.avtarWrapper}>
							<Camera />
						</View>
					}
					<View>
						{item.profile && item.profile.name && <Text style={styles.recordText}>{userType && userType === 'client' ? `Transportista: ${item.profile.name}` : `Cliente: ${item.profile.name}`}</Text>}
						{(userType && userType === 'client' && item.profile && item.profile.vehical) && (
							<View>
								<Text style={styles.recordText}>Tipo de vehículo: {item.profile.vehical.vehicalName}</Text>
								<View style={styles.row}>
									<Text style={styles.infoText}>Marca: {item.profile.vehical.brand}</Text>
									<Text style={styles.infoText}>Color: {item.profile.vehical.color}</Text>
								</View>
								<View style={styles.row}>
									<Text style={styles.infoText}>Modelo: {item.profile.vehical.model}</Text>
									<Text style={styles.infoText}>Patente: {item.profile.vehical.plateNumber}</Text>
								</View>
							</View>
						)}
						{item.order && item.order.paymentMethod && item.order.amount && (
							<View style={styles.paymentWrapper}>
								<Text style={styles.text}>{item.order.paymentMethod === 'cash' ? `Pago en efectivo` : `Pago en mercadopago` }: ${item.order.amount}</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		)
	}

	tripsHistoryView = () => {
		const { loading, activeTab, tripsHistory } = this.state 
		if(loading) {
			return <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} />
		}
		return (
			<View style={{flex: 1}}>
				<CloseModalButton onPress={() => this.closeModal()}/>
				<View style={styles.modalView}>
					<View style={styles.tabWrapper}>
						<TouchableOpacity onPress={() => this.handleTabChanged('inProgressTrips')} disabled={activeTab === 'inProgressTrips'}>
							<Text style={[styles.textStyle, { color: activeTab === 'inProgressTrips' ? colors.lightBlue : colors.aquaBlue }]}>En progreso</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.handleTabChanged('successfulTrips')} disabled={activeTab === 'successfulTrips'}>
							<Text style={[styles.textStyle, { color: activeTab === 'successfulTrips' ? colors.lightBlue : colors.aquaBlue }]}>Exitosos</Text>
						</TouchableOpacity>
					</View>
					{ tripsHistory && tripsHistory.length > 0 ?
						<FlatList
							data={this.state.tripsHistory}
							extraData={this.state}
							renderItem={(item) => this.renderRecord(item)}
							keyExtractor={(item, index) => index.toString()}
							bounces={false} 
							indicatorStyle={'white'}
						/>
					:
						<View style={styles.modalContentView}>
							<Text style={styles.text}>{activeTab === 'inProgressTrips' ? 'No se encontraron viajes en progreso' : 'No se encontraron viajes exitosos'}</Text>
						</View>
					}
				</View>
			</View>
		)
	}

	changeAccountTypeView = () => {
		const {carrierType} = this.state
		return (
			<View style={styles.modalContentView}>
				<CloseModalButton onPress={() => this.closeModal()}/>
				<View style={styles.modalContentView}>
					<Text style={styles.btnText}>{`Tu cuenta es ${carrierType}\n¿Quieres cambiar?`}</Text>
					<View style={styles.wrapper}>
						<TouchableOpacity 
							style={[styles.outerlineButton, {borderColor: carrierType && carrierType === 'premium' ? colors. white : colors. aquaBlue}]} 
							activeOpacity={0.8} 
							onPress={() => this.setState({type: 'premiumPayment'})}
							disabled={carrierType === 'premium'}
						>
							<Text style={[styles.btnText, {color: carrierType && carrierType === 'premium' ? colors. white : colors. aquaBlue}]}>USUARIO PREMIUM</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.outerlineButton, {borderColor: carrierType && carrierType === 'free' ? colors. white : colors. aquaBlue}]} 
							activeOpacity={0.8} 
							onPress={() => this.editCarrierType('free')}
							disabled={carrierType === 'free'}
						>
							<Text style={[styles.btnText, {color: carrierType && carrierType === 'free' ? colors. white : colors. aquaBlue}]}>USUARIO FREE</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}

	handleInput = ({ key, value }) => {
	    const vehicle = this.state.vehicle
	    vehicle[key] = value
	    this.setState({ vehicle })
	}

	renderVehicleInfoTextInput = (key, value, placeholder, reference, blurOnSubmit, onSubmit, style) => {
		return (
			<TextInput
                style={[styles.vehicleInfoTextInputStyle, style]}
                autoCapitalize="none"
                selectionColor={colors.blue}
                onChangeText={value => this.handleInput({key, value})}
                placeholder={placeholder}
                value={value} 
                underlineColorAndroid={'transparent'}
                blurOnSubmit={blurOnSubmit}
        		ref={reference}
        		onSubmitEditing={onSubmit}
            /> 
		)
	}

	handleVehicleType = (vehicleType) => {
	    const { vehicle } = this.state
	    vehicle.vehicleType['id'] = vehicleType._id
	    vehicle.vehicleType['name'] = vehicleType.name
	    this.setState({ vehicle, displayVehicleTypes: false })
	}

	vehicleDataView = () => {
		const {loading, vehicle, displayVehicleTypes, errorText} = this.state
		if(loading) {
			return <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} />
		}
		if(displayVehicleTypes) {
			return <VehicleTypes handleVehicleType={(vehicleType) => this.handleVehicleType(vehicleType)} />
		}
		return (
			<View style={{flex: 1}}>
				<CloseModalButton onPress={() => this.closeModal()}/>
				<View style={styles.modalContentView}>
					{errorText && (
						<WrongInputWarning warningText={errorText} style={styles.wrongInputWarningWrapper} />
					)}
					<TextInput
						style={styles.valueTextInputStyle}
						autoCapitalize="none"
						selectionColor={colors.white}
						onChangeText={changedText => this.handleInput({key: 'valuePerKm', value: changedText})}
						placeholder={'Valor por hora'}
						placeholderTextColor={colors.white}
						value={`${vehicle.valuePerKm}`} 
						underlineColorAndroid={'transparent'}
						blurOnSubmit={false}
						onSubmitEditing={() => this.brand.focus()}
						keyboardType={'number-pad'}
					/>
					<TouchableOpacity style={styles.vehicleTypeButton} activeOpacity={0.8} onPress={() => this.setState({ displayVehicleTypes: true })}>
						<Text style={styles.vehicleTypeText}>{vehicle.vehicleType['name'] ? vehicle.vehicleType['name'] : 'Tipo de vehículo'}</Text>
						<Image source={images.downArrow} resizeMode={'contain'} style={styles.downArrowIcon} />
					</TouchableOpacity>
					<View style={styles.textInputContainer}>
						{this.renderVehicleInfoTextInput('brand', vehicle.brand, 'Marca', (input) => { this.brand = input }, false, () => this.model.focus())}
						{this.renderVehicleInfoTextInput('model', vehicle.model, 'Modelo', (input) => { this.model = input }, false, () => this.plateNumber.focus(), {marginLeft: 10})}
					</View>
					<View style={styles.textInputContainer}>
						{this.renderVehicleInfoTextInput('plateNumber', vehicle.plateNumber, 'Patente', (input) => { this.plateNumber = input }, false, () => this.color.focus())}
						{this.renderVehicleInfoTextInput('color', vehicle.color, 'Color', (input) => { this.color = input }, false, () => this.editVehicle(), {marginLeft: 10})}
					</View>
					<SimpleButton buttonText={'guardar'} onPress={() => this.editVehicle()} />
				</View>
			</View>
		)
	}

	agendaView = () => {
		const {displayFreightInfo, loading, agenda} = this.state
		let customDatesStyle = []
		if(agenda && agenda.length > 0) {
			agenda.forEach((data) => {
				if(data && data.deliveredDate && data.deliveredDate.date) customDatesStyle.push({ date: data.deliveredDate.date, style: { ...styles.futureFreightDateStyle }, textStyle: { color: colors.aquaBlue }})
				if(data && data.confirmedDate && data.confirmedDate.date) customDatesStyle.push({ date: data.confirmedDate.date, style: { ...styles.pastFreightDateStyle }, textStyle: { color: colors.white }})
				if(data && data.fromDate && data.fromDate.date) customDatesStyle.push({ date: data.fromDate.date, style: { ...styles.currentDateStyle } })
		    })
	    }

		if(loading) {
			return <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} />
		}
		return (
			<View style={styles.modalView}>
				<CloseModalButton onPress={() => this.closeModal()}/>
				<View style={styles.modalView}>
					<CalendarPicker
						weekdays={['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab']}
						months={['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']}
						textStyle={styles.calenderTextStyle}
						onDateChange={(date) => this.openFreightInfo(date)}
						previousTitle="Anterior"
						nextTitle="Próximo"
						customDatesStyles={customDatesStyle}
						selectedDayStyle={{}}
						selectedDayTextColor={colors.white}
						todayTextStyle={{}}
						todayBackgroundColor={{}}
					/>
					{displayFreightInfo && this.renderFreightInfoView()}
				</View>
			</View>
		)
	}

	openFreightInfo = (date) => {
		const selectedFreight = this.state.agenda.find((data) => {
			if(data && data.deliveredDate && data.deliveredDate.date && moment(data.deliveredDate.date).isSame(moment(date), 'day')) return data
			if(data && data.fromDate && data.fromDate.date && moment(data.fromDate.date).isSame(moment(date), 'day')) return data
		})
		if(selectedFreight) this.setState({ displayFreightInfo: true, selectedFreight, selectedDate: date })
	}


	closeFreightInfo = () => {
		this.setState({ displayFreightInfo: false, selectedFreight: undefined, selectedDate: null })
	}

	getBoxImage = () => {
		const { selectedFreight, selectedDate } = this.state
		if(selectedFreight && selectedFreight.deliveredDate && selectedFreight.deliveredDate.date &&  moment(selectedFreight.deliveredDate.date).isSame(moment(selectedDate), 'day')) return images.package 
		if(selectedFreight && selectedFreight.fromDate && selectedFreight.fromDate.date &&  moment(selectedFreight.fromDate.date).isSame(moment(selectedDate), 'day')) return images.boxIcon 
		return images.boxIcon 
	}

	getDate = () => {
		const { selectedDate } = this.state
		if(selectedDate) return `${moment(selectedDate).format('D')} de ${moment(selectedDate).format('MMMM')}`
		return null
	}

	getDistance = () => {
		const { selectedFreight, selectedDate } = this.state
		if(selectedFreight && selectedFreight.fromDate && selectedFreight.fromDate.date && moment(selectedFreight.fromDate.date).isSame(moment(selectedDate), 'day') && selectedFreight.shipment.distance > 0) return `- ${selectedFreight.shipment.distance} Kmts`
		return null
	}

	renderFreightInfoView = () => {	
		const { selectedFreight } = this.state
		return (
			<View style={styles.freightWrapper}>
	        	<Image source={this.getBoxImage()} style={styles.boxImageStyle} />
	        	<View>
	        		<View style={styles.row}>
	    				<Text style={styles.date}>{this.getDate()}</Text>
	    				<TouchableOpacity activeOpacity={0.8} onPress={() => this.closeFreightInfo()}>
	    					<Close />
	    				</TouchableOpacity>
	    			</View>
	        		<Text style={styles.freightInfoText}>{selectedFreight.shipment.description.length > 15 ? `${selectedFreight.shipment.description.slice(0, 15)}...` : selectedFreight.shipment.description} {this.getDistance()}</Text>
        		</View>
        	</View>
	    )
	}

	renderButton = (buttonText, onPress) => {
		const { userType } = this.state
		return (
			<TouchableOpacity style={[styles.buttonWrapper, {height: userType && userType === 'client' ? 44 : 36}]} activeOpacity={0.8} onPress={onPress}>
		        <Text style={styles.buttonText}>{buttonText}</Text>
		    </TouchableOpacity>
		)
	}

	closeSideMenu = () => {
	    Navigation.mergeOptions(this.props.componentId, {
	      sideMenu: {
	        left: {
	          visible: false
	        }
	      }
	    });
	}

	openScreen = () => {
		const animation = { animations: { push: { enabled: false } } }
		this.closeSideMenu()
		if (Platform.OS === 'android') {
			navigateToScreen('Home', 'ChatList', '', animation)
		} else {
		 	setTimeout(() => navigateToScreen('Home', 'ChatList', '', animation), 1000)
		}
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

	displayInvalidEmailMsg = () => {
		if(!validateEmail(this.state.email)) {
			this.refs.errorToast.show('Correo electrónico inválido')
		}
	}

	getNeighborhoods = (text) => {
	    this.setState({ displaySelectBox: true, carrierNeighborhood: text })
	    if(text.length >= 2) {
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
	        })
	    } else {
	      this.setState({ neighborhoods: [] })
	    }
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

  	render() {
  		const {userType, carrierNeighborhood, displaySelectBox, selectBoxTop, media, disabledButton, neighborhoods, keyboardHeight, carrierType} = this.state
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
	      		<TouchableOpacity style={styles.closeIconWrapper} onPress={() => this.closeSideMenu()}>
	            	<Bar />
	        	</TouchableOpacity>
		        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer} bounces={false}>
		        	<TouchableOpacity style={styles.imagePickerWrapper} onPress={() => this.ActionSheet.show()} activeOpacity={0.8} disabled={disabledButton}>
			        	{ media ? 
			        		<Image source={{uri: media}} style={styles.image} />
			        	:
			        		<View style={styles.iconWrapper}>
			        			<Camera />
				          		{(userType && userType === 'carrier') && <Text style={styles.picText}>{`SUBIR\nFOTOGRAFIA\nDE PERFIL`}</Text>}
				          	</View>
			          	}
			        </TouchableOpacity>
        			{(userType && userType === 'client') && (
	        			<TouchableOpacity style={styles.outerlineButton} activeOpacity={0.8} onPress={() => this.openModal('termsAndService')}>
					        <Text style={styles.tosText}>TERMINOS Y CONDICIONES</Text>
					    </TouchableOpacity>
					)}
					{(userType && userType === 'carrier') && (
	        			<TouchableOpacity style={styles.outerlineButton} activeOpacity={0.8} onPress={() => this.openModal('changeAccountType')}>
					        <Text style={styles.tosText}>{carrierType && carrierType === 'premium' ? 'USUARIO PREMIUM' : 'USUARIO FREE'}</Text>
					    </TouchableOpacity>
					)}
					<TextInput
		                style={[styles.inlineLabelTextInput, {height: userType && userType === 'client' ? 44 : 36}]}
		                autoCapitalize="none"
		                selectionColor={colors.blue}
		                onChangeText={changedText => this.editUserName(changedText)}
		                placeholder={'Nombre de usuario'}
		                value={this.state.username} 
		                underlineColorAndroid={'transparent'}
		            /> 
		            <TextInput
		                style={[styles.inlineLabelTextInput, {height: userType && userType === 'client' ? 44 : 36}]}
		                autoCapitalize="none"
		                selectionColor={colors.blue}
		                onChangeText={changedText => this.editEmail(changedText)}
		                placeholder={'Correo electronico'}
		                value={this.state.email} 
		                underlineColorAndroid={'transparent'}
		                onBlur={() => this.displayInvalidEmailMsg()}
		            /> 
				    {this.renderButton('Cambiar contraseña', () => this.openModal('changePassword'))}
				    {(userType && userType === 'carrier') && (
				    	<View>
				    		{(displaySelectBox && (neighborhoods && neighborhoods.length > 0)) && this.renderNeighborhoods()}
				    		<TextInput
					            style={styles.neighborhoodTextInput}
					            autoCapitalize="none"
					            selectionColor={colors.blue}
					            onChangeText={changedText => this.getNeighborhoods(changedText)}
					            placeholder={'Barrio de procedencia'}
					            placeholderTextColor={colors.blue}
					            value={carrierNeighborhood} 
					            underlineColorAndroid={'transparent'}
					            onFocus={() => this.setState({ neighborhoods: [], carrierNeighborhood: '', oldNeighborhood: carrierNeighborhood })}
					            onBlur={() => this.setState({ carrierNeighborhood: carrierNeighborhood === '' ? this.state.oldNeighborhood : carrierNeighborhood })}
					        /> 
				          	{this.renderButton('Datos del vehículo', () => this.openVehicleDataView())}
				        </View>
				    )}
				    <TouchableOpacity style={[styles.button, {marginTop: userType && userType === 'client' ? 25 : 15}]} activeOpacity={0.8} onPress={() => this.openHistoryView()}>
				        <Text style={styles.textStyle}>HISTORIAL</Text>
				    </TouchableOpacity>
				    {(userType && userType === 'carrier') && (
				    	<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.openAgendaView()}>
				        	<Text style={styles.textStyle}>AGENDA</Text>
				    	</TouchableOpacity>
				    )}
			    	<SimpleButton 
			    		buttonText={'CERRAR SESIÓN'} 
			    		onPress={() => this.handleLogout()} 
			    		style={{ borderRadius: userType && userType === 'carrier' ? 32 : 6, marginTop: userType && userType === 'carrier' ? 20 : 40 }} 
			    	/>
			    </ScrollView>
		      	{(userType && userType === 'client') && (
			      	<TouchableOpacity style={styles.chatIconWrapper} activeOpacity={0.8} onPress={() => this.openScreen()}>
			            <Chat />
			        </TouchableOpacity>
			    )}
			    <Toast 
			    	ref="errorToast" 
			    	keyboardHeight={keyboardHeight} 
			    	style={{ backgroundColor: colors.red }} 
			    	textStyle={{ color: colors.white }} 
			    />
			    <Toast ref="toast" />
		        {this.renderModal()}
	      	</View>
	    );
  	}
}

const withMutation = graphql(EDIT_USER_MUTATION, { name: 'editUserMutation' })(SideMenu)
// const withMutation = graphql(EDIT_USER_MUTATION, { name: 'editUserMutation' })(SideMenu)
export default withMutation
