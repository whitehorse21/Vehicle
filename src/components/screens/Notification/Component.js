import React, {Component} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, TextInput, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from 'moment';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import apolloClient from '../../../graphql/client';
import {GET_NOTIFICATIONS, REJECT_FREIGHT_REQUEST, START_TRIP, SHIPMENT_CONFIRMED, DELIVERY_CONFIRMED} from '../../../graphql/queries';
import {SEND_FREIGHT_REQUEST_RESPONSE, ADD_ORDER} from '../../../graphql/mutations';
import styles from './Style';
import {colors} from '../../../colors';
import {images, Camera} from '../../../../assets';
import {shadow} from '../../../common_style';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import TopNavBar from '../../common/TopNavBar/Component';
import ModalBox from '../../common/ModalBox/Component';
import Toast from '../../common/Toast/Component';
import WrongInputWarning from '../../common/WrongInputWarning/Component';
import Spinner from '../../common/Spinner/Component';
import Rating from '../../common/Rating/Component';
import AuthWebView from '../../common/AuthWebView/Component';
import {getData} from '../../../storage';
import config from '../../../../config';
import CloseModalButton from '../../common/CloseModalButton/Component'

class Notification extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isConnected: true,
			notifications: [],
			userType: undefined,
			loading: true,
			displayModal: false,
			type: '',
			selectedFreight: {},
			paymentType: 'cash',
			amount: '',
			errorText: undefined,
			displayPaymentModal: false,
			paymentLoading: false
		}
	}

	async componentWillMount() {
		this.setState({userType: JSON.parse(await getData('userType'))})
		this.fetchNotifications()
	}

	fetchNotifications = async () => {
		try {
	      	const result = await apolloClient.query({
		        query: GET_NOTIFICATIONS,
		        fetchPolicy: 'no-cache'
		    })
			console.log("noti response", JSON.stringify(result))
	      	if (result && result.data && result.data.getNotifications) {
	        	this.setState({ notifications: result.data.getNotifications })
	      	}
	      	this.setState({ loading: false })
	    } catch (error) {
	    	console.log(error)
	      	this.setState({ loading: false })
	    }
	}

	handleFreightRequestRejection = async (notification) => {
		if(notification && notification.freightRequestId) {
			try {
				const result = await apolloClient.query({
		        	query: REJECT_FREIGHT_REQUEST,
		        	variables: {
		            	freightRequestId: notification.freightRequestId 
		          	},
		        	fetchPolicy: 'network-only'
		      	})
		        if (result && result.data && result.data.rejectFreightRequest) {
		          	this.refs.toast.show('Cotización rechazada con éxito')
		          	await this.fetchNotifications()
		        }
		    } catch (error) {
		    	console.log(error)
		    	this.refs.toast.show('no puede rechazar la Cotización')
		    }
		} else {
			this.refs.toast.show('no puede rechazar la Cotización')
		}
	}

	sendQuoteToClient = async (shipmentId) => {
		const { amount } = this.state
		if(amount === '') {
			this.setState({ errorText: 'Please insert value'})
		} else {
			try {
		        const result = await this.props.sendFreightRequestResponse({
		          variables: {
		            shipmentId,
		            amount
		          }
		        })
		        await this.setState({ displayModal: false })
		        if (result && result.data && result.data.addFreightRequestAmount) {
		          	this.refs.toast.show('Cotización Enviada')
		          	await this.fetchNotifications()
		        }
		    } catch (error) {
		    	await this.setState({ displayModal: false })
		    	try {
		    		if(error.graphQLErrors[0].message === 'Freight response already sent to this user') 
		    			this.refs.toast.show('Cotización ya enviada')
		    		else 
		    			this.refs.toast.show('no se puede enviar Cotización')
		    		
			    } catch (e) {
			        this.refs.toast.show('no se puede enviar Cotización')
			    }
		    }
		}
	}

	handlePayment = async (paymentData) => {
		const { selectedFreight, paymentType } = this.state 
		if(selectedFreight && selectedFreight.freightRequestId && selectedFreight.shipmentId && selectedFreight.amount) {
			const data = {
				freightRequestId: selectedFreight.freightRequestId, 
	            shipmentId: selectedFreight.shipmentId, 
	            amount: selectedFreight.amount, 
	            paymentMethod: paymentType
			}
			if((paymentType && paymentType === 'mercadopago') && paymentData) {
				var paymentObj = {
					installments: paymentData && paymentData.installments ? paymentData.installments : '',
					issuer_id: paymentData && paymentData.issuer_id ? paymentData.issuer_id : '',
					token: paymentData && paymentData.token ? paymentData.token : ''
				}
				if(Platform.OS === 'android') paymentObj['payment_method_id'] = paymentData && paymentData.collection_method_id ? paymentData.collection_method_id : ''
				else paymentObj['payment_method_id'] = paymentData && paymentData.payment_method_id ? paymentData.payment_method_id : ''
				data['paymentData'] = paymentObj
			}
			try {
		        const result = await this.props.addOrder({
		          variables: {
		            ...data
		          }
		        })
		        await this.setState({ displayModal: false, paymentLoading: false })
		        if (result && result.data && result.data.addOrder) {
		          	this.refs.toast.show('Pago realizado')
		          	await this.fetchNotifications()
		        }
		    } catch (error) {
		    	await this.setState({ displayModal: false, paymentLoading: false })
			    this.refs.toast.show('pago no realizar')
		    }
		} else {
			await this.setState({ displayModal: false, paymentLoading: false })
			this.refs.toast.show('pago no realizar')
		}
	}

	handleStartTrip = async (notification) => {
		if(notification && notification.shipmentId) {
			try {
		      	const result = await apolloClient.query({
		        	query: START_TRIP,
		        	variables: {
		        		shipmentId: notification.shipmentId
		        	},
		        	fetchPolicy: 'network-only'
		      	})
		      	if (result && result.data && result.data.startTrip) {
		        	this.refs.toast.show('Comenzaste el flete')
		        	await this.fetchNotifications()
		      	}
		    } catch (error) {
		    	console.log(error)
			    this.refs.toast.show('no se puede iniciar el flete')
		    }
		} 
	}

	handleDeliveryConfirmed = async (notification) => {
		const { userType } = this.state
		if(notification && notification.shipmentId) {
			if(userType && userType === 'carrier') {
				try {
			      	const result = await apolloClient.query({
			        	query: DELIVERY_CONFIRMED,
			        	variables: {
			        		shipmentId: notification.shipmentId
			        	},
			        	fetchPolicy: 'network-only'
			      	})
			      	if (result && result.data && result.data.deliveryConfirmation) {
			        	this.refs.toast.show('Confirmaste la entrega con éxito')
			        	await this.fetchNotifications()
			      	}
			    } catch (error) {
				    this.refs.toast.show('no se puede confirmar la entrega')
			    }
			} else if (userType && userType === 'client') {
				try {
			      	const result = await apolloClient.query({
			        	query: SHIPMENT_CONFIRMED,
			        	variables: {
			        		shipmentId: notification.shipmentId
			        	},
			        	fetchPolicy: 'network-only'
			      	})
			      	if (result && result.data && result.data.shipmentConfirmation) {
			        	this.refs.toast.show('Confirmaste la entrega con éxito')
			        	await this.fetchNotifications()
			      	}
			    } catch (error) {
				    this.refs.toast.show('no se puede confirmar la entrega')
			    }
			}
		} else {
			this.refs.toast.show('no se puede confirmar la entrega')
		}
	}

	onPaymentButtonPress = () => {
		const { selectedFreight, paymentType } = this.state 
		if(paymentType === 'mercadopago') {
		 	if(selectedFreight && selectedFreight.freightRequest && selectedFreight.freightRequest.carrier && selectedFreight.freightRequest.carrier.publicKey) {
				this.openPaymentview()
			} else {
				this.setState({ displayModal: false })
				this.refs.toast.show('El carrier no ha configurado Mercadopago')
			}
		} else if(paymentType === 'cash') {
			this.handlePayment()
		}
	}

	openPaymentview = () => {
		this.setState({ displayPaymentModal: true })
	}

	closePaymentView = (data) => {
		this.setState({ displayPaymentModal: false })
		if(data && data.token) {
			this.setState({ paymentLoading: true })
			this.handlePayment(data)
		}
	}

	renderShipmentInfo = (notification) => {
		const { userType } = this.state
		let url = ''
		if(userType && userType === 'carrier' && notification.shipment &&  notification.shipment.user && notification.shipment.user.image) url = notification.shipment.user.image
		else if (userType && userType === 'client' && notification.freightRequest && notification.freightRequest.carrier && notification.freightRequest.carrier.image) url = notification.freightRequest.carrier.image
		return (
			<View style={styles.rowWrapper}>
				{ url ?
					<Image source={{ uri: url }} style={styles.image} />
				:
					<View style={styles.imageWrapper}>
						<Image source={images.camera} style={styles.cameraIcon} />
	    			</View>
				}
				<View>
					<Text style={styles.infoText}>{userType && userType === 'client' ? 'Ha cotizado tu solicitud de flete' : 'Te ha enviado una solicitud de flete'}</Text>
					<Text style={styles.infoText}>Envío: {notification.shipment.description}</Text>
					<Text style={styles.textStyle}>Origen: {notification.shipment.origin.address}</Text>
					<Text style={styles.textStyle}>Destino: {notification.shipment.destination.address}</Text>
					{notification.shipment.distance > 0 && 
						<Text style={styles.textStyle}>Recorrido: {notification.shipment.distance} kilómetros</Text>
					}
					<Text style={styles.textStyle}>Fecha: {moment(notification.shipment.fromDate).format('DD/MM')} - {moment(notification.shipment.toDate).format('DD/MM')}</Text>
					{userType && userType === 'client' && (
						<View style={styles.valueWrapper}>
							<Text style={styles.valueText}>Valor ${notification.amount}</Text>
						</View>
					)}
				</View>
			</View>
		)
	}

	renderNotifications = () => {
		const { loading } = this.state
    	if (loading) return <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} /> 

		if(this.state.notifications && this.state.notifications.length > 0) {
			return (
				<FlatList
					ref={elm => this.flatList = elm}
		          	keyExtractor={(notification, index) => index.toString()}
		          	data={this.state.notifications}
		          	extaraData={this.state}
		          	onContentSizeChange={() => this.flatList.scrollToEnd()}
      				onLayout={() => this.flatList.scrollToEnd()}
		          	renderItem={notification => this.renderNotification(notification)}
		          	bounces={false}
		          	contentContainerStyle={styles.containerStyle}
		          	indicatorStyle={'white'}
		        />  
			)
		} else {
			return (
				<View style={styles.mainContainer}>
					<Text style={styles.notFoundText}>No se encontraron notificaciones</Text>
				</View>
			)
		}
	}

	renderNotification = ({item, index}) => {
		const { userType } = this.state
		if(item.type && item.type === 1) return this.broadCastNotification(item)
		if((userType && userType === 'carrier') && (item.type && item.type === 2)) return this.freightRequestNotification(item)
		if((userType && userType === 'client') && (item.type && item.type === 3)) return this.freightRequestResponseNotification(item)
		if((userType && userType === 'client') && (item.type && item.type === 4)) return this.giveRateToCarrierNotification(item)
		if((userType && userType === 'carrier') && (item.type && item.type === 5)) return this.ratingNotification(item)
		if((userType && userType === 'carrier') && (item.type && item.type === 6)) return this.startTripNotification(item)
		if((userType && userType === 'client') && (item.type && item.type === 7)) return this.travelTrakingNotification(item)
		if((userType && userType === 'carrier') && (item.type && item.type === 8)) return this.deliveryConfirmationNotification(item)
		if((userType && userType === 'client') && (item.type && item.type === 9)) return this.deliveryConfirmationNotification(item)
		if((userType && (userType === 'client' || userType === 'carrier')) && (item.type && item.type === 10)) return this.freightRequestRejectedNotification(item)
		if((userType && userType === 'carrier') && (item.type && item.type === 11)) return this.paymentReceivedNotification(item)
		return null
	}

	broadCastNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<Text style={styles.broadCastNotificationTitleText}>{notification.title}</Text>
			    <Text style={styles.broadCastNotificationDetailText}>{notification.detail}</Text>	
		    </View>
		)
	}

	freightRequestNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				{this.renderShipmentInfo(notification)}
				{(notification.isRequestAcceptedByCarrier === 1 || notification.isRequestAcceptedByCarrier === null) && (
					<View style={styles.wrapper}>
						{notification.isRequestAcceptedByCarrier === null && (
							<TouchableOpacity style={styles.payButton} activeOpacity={0.8} onPress={() => this.openModal('sendQuote', notification)}>
								<Text style={styles.buttonText}>Cotizar</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity style={styles.openChatButton} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'Chat', {userId: notification.shipment.userId, userName: notification.shipment.user.name})}>
							<Text style={styles.buttonText}>Abrir chat</Text>
						</TouchableOpacity>
						{notification.isRequestAcceptedByCarrier === null && (
							<TouchableOpacity style={styles.rejectButton} activeOpacity={0.8} onPress={() => this.handleFreightRequestRejection(notification)}>
								<Text style={styles.buttonText}>Rechazar</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>
		)
	}

	freightRequestResponseNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				{this.renderShipmentInfo(notification)}
				{(notification.isRequestAcceptedByClient === 1 || notification.isRequestAcceptedByClient === null) && (
					<View style={styles.wrapper}>
						{notification.isRequestAcceptedByClient === null && (
							<TouchableOpacity style={styles.payButton} activeOpacity={0.8} onPress={() => this.openPaymentModal('payment', notification)}>
								<Text style={styles.buttonText}>Abonar</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity style={styles.openChatButton} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'Chat', {userId: notification.freightRequest.carrierId, userName: notification.freightRequest.carrier.name})}>
							<Text style={styles.buttonText}>Abrir chat</Text>
						</TouchableOpacity>
						{notification.isRequestAcceptedByClient === null && (
							<TouchableOpacity style={styles.rejectButton} activeOpacity={0.8} onPress={() => this.handleFreightRequestRejection(notification)}>
								<Text style={styles.buttonText}>Rechazar</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>
		)
	}

	freightRequestRejectedNotification = (notification) => {
		const { userType } = this.state
		let url = ''
		if(userType && userType === 'carrier' && notification.shipment &&  notification.shipment.user && notification.shipment.user.image) url = notification.shipment.user.image
		else if (userType && userType === 'client' && notification.freightRequest && notification.freightRequest.carrier && notification.freightRequest.carrier.image) url = notification.freightRequest.carrier.image
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<View style={styles.rejectNotificationWrapper}>
					{ url ?
						<Image source={{ uri: url }} style={styles.image} />
					:
						<View style={styles.imageWrapper}>
		    				<Camera />
		    			</View>
		    		}
					<Text style={styles.textStyle}>{userType && userType === 'client' ? `Su solicitud de flete rechazada` : `Su cotización rechazada`}</Text>
				</View>
			</View>
		)
	}

	startTripNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<View style={styles.rowWrapper}>
					{notification && notification.shipment && notification.shipment.user && notification.shipment.user.image ? 
						<Image source={{ uri: notification.shipment.user.image }} style={styles.image} />
					:
						<View style={styles.imageWrapper}>
			    			<Camera />
			    		</View>
			    	}
					<Text style={styles.infoText}>Hoy tienes un flete programado de {notification.shipment.distance} kilómetros.</Text>
				</View>
				<View style={styles.wrapper}>
					<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.handleStartTrip(notification)}>
						<Text style={styles.buttonText}>Iniciar viaje</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	travelTrakingNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<View style={styles.rowWrapper}>
					{notification.freightRequest && notification.freightRequest.carrier && notification.freightRequest.carrier.image ?
			            <Image source={{ uri: notification.freightRequest.carrier.image }} style={styles.image} />
			        :
						<View style={styles.imageWrapper}>
			    			<Camera />
			    		</View>
			    	}
					<Text style={styles.infoText}>Hoy tienes un flete programado de {notification.shipment.distance} kilómetros.</Text>
				</View>
				<View style={styles.wrapper}>
					{ notification.shipment.isDeliveredByCarrier !== 1 &&
						<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'ShippingTracking', {shipment: {origin: notification.shipment.origin, destination: notification.shipment.destination, carrierId: notification.shipment.carrierId}})}>
							<Text style={styles.buttonText}>Seguir envío</Text>
						</TouchableOpacity>
					}
				</View>
			</View>
		)
	}

	deliveryConfirmationNotification = (notification) => {
		const { userType } = this.state
		let url = ''
		if(userType && userType === 'carrier' && notification.shipment &&  notification.shipment.user && notification.shipment.user.image) url = notification.shipment.user.image
		else if (userType && userType === 'client' && notification.freightRequest && notification.freightRequest.carrier && notification.freightRequest.carrier.image) url = notification.freightRequest.carrier.image
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<View style={styles.rowWrapper}>
					{ url ?
						<Image source={{ uri: url }} style={styles.image} />
					:
						<View style={styles.imageWrapper}>
		    				<Camera />
		    			</View>
		    		}
					<Text style={styles.infoText}>{userType && userType === 'client' ? `El flete ha llegado a destino, confirma la entrega del flete.` : `Has llegado a destino, confirma la entrega del flete.`}</Text>
				</View>
				{ userType && ((userType === 'client' && notification.shipment.status !== 1) || (userType === 'carrier' && notification.shipment.isDeliveredByCarrier !== 1)) && (
					<View style={styles.wrapper}>
						<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.handleDeliveryConfirmed(notification)}>
							<Text style={styles.buttonText}>Entregado</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.button, styles.btnStyle]} activeOpacity={0.8} onPress={() => this.openModal('notDelivered', notification)}>
							<Text style={styles.buttonText}>No entregado</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		)
	}

	giveRateToCarrierNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<Rating notification={notification} displayRatingMsg={(msg) => this.displayRatingMsg(msg)} fetchNotifications={() => this.fetchNotifications()} />
			</View>
		)
	}

	ratingNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<View style={styles.rowWrapper}>
					{notification && notification.shipment && notification.shipment.user && notification.shipment.user.image ? 
						<Image source={{ uri: notification.shipment.user.image }} style={styles.image} />
					:
						<View style={styles.imageWrapper}>
		    				<Camera />
		    			</View>
					}
		    		<View>
						<Text style={styles.infoText}>¡Te han calificado con {notification.rating} estrellas!</Text>
						<View style={styles.starWrapper}>
							{this.renderStars(notification.rating)}
						</View>
					</View>
				</View>
			</View>
		)
	}

	paymentReceivedNotification = (notification) => {
		return (
			<View style={styles.notificationWrapper}>
				<Text style={styles.timeText}>{moment(notification.createdAt).format('HH:mm')}hs</Text>
				<View style={styles.rejectNotificationWrapper}>
					{notification && notification.shipment && notification.shipment.user && notification.shipment.user.image ? 
						<Image source={{ uri: notification.shipment.user.image }} style={styles.image} />
					:
						<View style={styles.imageWrapper}>
		    				<Camera />
		    			</View>
					}
					<Text style={styles.textStyle}>Nuevo flete recibida</Text>
				</View>
			</View>
		)
	}

	renderStars = (rating) => {
		const stars = []
		for(let i = 1; i <= 5; i++) {
			stars.push(
				<Image 
					key={i}
					source={i <= rating ? images.fullStar : images.star} 
					style={[styles.starImage, {tintColor: i <= rating ? colors.yellow : colors.white}]} 
					resizeMode={'contain'} 
				/>
			)
		}
		return stars
	}

	displayRatingMsg = (msg) => {
		this.refs.toast.show(msg)
	}

	openModal = (type, selectedFreight) => {
		this.setState({ displayModal: true, type, selectedFreight})
	}

	openPaymentModal = (type, selectedFreight) => {
		if(selectedFreight.freightRequest.carrier && selectedFreight.freightRequest.carrier.carrierType && selectedFreight.freightRequest.carrier.carrierType === 'premium') this.setState({ displayModal: true, type, selectedFreight, paymentType: 'cash' })
		else this.setState({ displayModal: true, type, selectedFreight, paymentType: 'mercadopago' })
	}

	closeModal = () => {
		this.setState({ displayModal: false, type: '', selectedFreight: {}, paymentType: 'cash', amount: '', errorText: undefined})
	}

	renderModal = () => {
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
		const { type } = this.state
		if(type === 'payment') {
			return this.renderPaymentView()
		}
		if(type === 'notDelivered') {
			return this.renderNotDeliveredView()
		}
		if(type === 'sendQuote') {
			return this.renderSendQuoteView()
		}
	}

	handlePaymentType = (paymentType) => {
		this.setState({ paymentType })
	}

	renderPaymentView = () => {
		const { paymentType, selectedFreight, displayPaymentModal, paymentLoading } = this.state
		const data = {
			type: 'payment',
			publicKey: selectedFreight.freightRequest.carrier && selectedFreight.freightRequest.carrier.publicKey ? selectedFreight.freightRequest.carrier.publicKey : '',
			amount: selectedFreight.amount ? selectedFreight.amount : ''
		}

		if (paymentLoading) return <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} /> 
		return (
			<View style={styles.paymentWrapper}>
				<CloseModalButton onPress={this.closeModal}/>
				<View style={styles.paymentWrapper}>
					<View>
						<Text style={styles.headText}>¿Cómo deseas abonar el flete?</Text>
						<View style={styles.valueWrapper}>
							<Text style={styles.valueText}>Valor ${selectedFreight.amount}</Text>
						</View>
					</View>
					<View style={styles.wrapper}>
						{selectedFreight.freightRequest.carrier.carrierType === 'premium' && (
							<TouchableOpacity 
								style={paymentType === 'cash' ? styles.selectedpaymentButton : styles.paymentButton} 
								activeOpacity={0.8} 
								onPress={() => this.handlePaymentType('cash')}
								disabled={paymentType === 'cash'}
							>
								<Text style={styles.valueText}>Efectivo</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity 
							style={[paymentType === 'mercadopago' ? styles.selectedpaymentButton : styles.paymentButton, {marginLeft: 10}]} 
							activeOpacity={0.8} 
							onPress={() => this.handlePaymentType('mercadopago')}
							disabled={paymentType === 'mercadopago'}
						>
							<Text style={styles.valueText}>Mercadopago</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.confirmButton} activeOpacity={0.8} onPress={() => this.onPaymentButtonPress()}>
						<Text style={styles.confirmButtonText}>CONFIRMAR</Text>
					</TouchableOpacity>
					{displayPaymentModal && <AuthWebView displayModal={this.state.displayPaymentModal} closeModal={(code) => this.closePaymentView(code)} paymentInfo={data} />}
				</View>
			</View>
		)
	}

	renderNotDeliveredView = () => {
		const { userType } = this.state
		return (
			<View style={styles.mainContainer}>
				<CloseModalButton onPress={this.closeModal}/>
				<View style={styles.mainContainer}>
					<Text style={styles.headText}>{userType && userType === 'client' ? '¿Tu flete aún no ha llegado?' : '¿No pudiste entregar el pedido?'}</Text>
					<Text style={styles.msgText}>{userType && userType === 'client' ? `Comunicate con tu\ntransportista` : 'Comunicate con tu cliente'}</Text>
					<TouchableOpacity 
						style={[styles.selectedpaymentButton, shadow]} 
						activeOpacity={0.8} 
						onPress={() => this.openChatScreen()}
					>
						<Text style={styles.buttonText}>Abrir chat</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	renderSendQuoteView = () => {
		const { selectedFreight, amount, errorText } = this.state
		return (
			<View style={styles.mainContainer}>
				<CloseModalButton onPress={this.closeModal}/>
					<View style={styles.mainContainer}>
					{errorText && (
						<WrongInputWarning warningText={errorText} style={styles.wrongInputWarningWrapper} />
					)}
					<Text style={styles.buttonText}>SOLICITUD DE FLETE</Text>
					<View style={styles.freightInfoWrapper}>
						{selectedFreight && selectedFreight.shipment && selectedFreight.shipment.user && selectedFreight.shipment.user.image ? 
							<Image source={{ uri: selectedFreight.shipment.user.image }} style={styles.image} />
						:
							<View style={styles.imageWrapper}>
								<Camera />
							</View>
						}
						<View style={styles.infoWrapper}>
							<Text style={styles.text} numberOfLines={2} ellipsizeMode={'tail'}>Envío: {selectedFreight.shipment.description}</Text>
							<Text style={styles.text} numberOfLines={2} ellipsizeMode={'tail'}>Origen: {selectedFreight.shipment.origin.address}</Text>
							<Text style={styles.text} numberOfLines={2} ellipsizeMode={'tail'}>Destino: {selectedFreight.shipment.destination.address}</Text>
							{selectedFreight.shipment.distance > 0 &&
								<Text style={styles.text}>Recorrido: {selectedFreight.shipment.distance} kilómetros</Text>
							}
							<Text style={styles.text}>Fecha: {moment(selectedFreight.shipment.fromDate).format('DD/MM')} - {moment(selectedFreight.shipment.toDate).format('DD/MM')}</Text>
							{selectedFreight.shipment.user && selectedFreight.shipment.user.name !== '' && 
								<Text style={styles.nameText}>Cliente: {selectedFreight.shipment.user.name}</Text>
							}
						</View>
					</View>
					<TextInput
						style={styles.valueTextInput}
						autoCapitalize="none"
						selectionColor={colors.aquaBlue}
						onChangeText={changedText => this.setState({ amount: changedText})}
						placeholderTextColor={colors.white}
						placeholder={'Valor $'}
						value={amount} 
						underlineColorAndroid={'transparent'}
						keyboardType={'number-pad'}
					/> 
					<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.sendQuoteToClient(selectedFreight.shipmentId)}>
						<Text style={styles.buttonText}>Enviar cotización</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	openChatScreen = async () => {
		const { userType, selectedFreight } = this.state
		const user = {
			userId: userType === 'client' ? selectedFreight.freightRequest.carrierId : selectedFreight.shipment.userId, 
			userName: userType === 'client' ? selectedFreight.freightRequest.carrier.name : selectedFreight.shipment.user.name
		}
		await this.setState({ displayModal: false })
		navigateToScreen(this.props.componentId, 'Chat', user)
	} 

	render() {
		return (
			<View style={styles.container}>
				<TopNavBar onPress={() => this.fetchNotifications()} type={'notification'} componentId = {this.props.componentId}/>
				<View style={styles.mainWrapper}>
     				{this.renderNotifications()}
     			</View>
     			<Toast ref="toast" />
     			{this.renderModal()}
			</View>
		)
	}
}

const withMutation = compose(
  graphql(SEND_FREIGHT_REQUEST_RESPONSE, { name: 'sendFreightRequestResponse' }),
  graphql(ADD_ORDER, { name: 'addOrder' })
)(Notification);

export default withMutation;