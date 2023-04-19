import React, {Component} from 'react';
import ReactNative, {View, Text, TextInput, TouchableOpacity, DatePickerAndroid, DatePickerIOS, Platform, Image, findNodeHandle, Keyboard} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from "moment";
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import {ADD_SHIPMENT} from '../../../graphql/mutations';
import styles from './Style';
import { colors } from '../../../colors';
import {images} from '../../../../assets';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { validateDimensions } from '../../../utils/validators';
import ModalBox from '../../common/ModalBox/Component';
import TopNavBar from '../../common/TopNavBar/Component';
import FullWidthButton from '../../common/FullWidthButton/Component';
import SimpleButton from '../../common/SimpleButton/Component';
import InformationBar from '../../common/InformationBar/Component';
import WrongInputWarning from '../../common/WrongInputWarning/Component';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import CloseModalButton from '../../common/CloseModalButton/Component'

class FreightInfo extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	displayModal: false,
	    	shipment: {
	    		origin: props.data && props.data.origin ? props.data.origin : '', 
	    		destination: props.data && props.data.destination ? props.data.destination : '', 
	    		distance: props.data && props.data.distance ? props.data.distance : 0,
	    		description: '', 
	    		fromDate: '', 
	    		toDate: '', 
	    		dimensions: props.data && props.data.dimensions ? props.data.dimensions : '', 
	    		weight: props.data && props.data.weight ? props.data.weight : ''
	    	},
	    	type: '',
	    	datePickerType: '',
	    	errorText: undefined,
	    	isSaving: false
	    }
	    Navigation.events().bindComponent(this);
	}

	componentDidAppear() {
		const { props } = this
		this.setState({ 
			errorText: undefined,
			shipment: {
				origin: props.data && props.data.origin ? props.data.origin : '', 
				destination: props.data && props.data.destination ? props.data.destination : '', 
				distance: props.data && props.data.distance ? props.data.distance : 0,
				description: '', 
				fromDate: '', 
				toDate: '', 
				dimensions: props.data && props.data.dimensions ? props.data.dimensions : '', 
				weight: props.data && props.data.weight ? props.data.weight : ''
			},
			isSaving: false
	    })
	}

	addShipment = async () => {
		if (this.validateInputs()) {
			this.setState({ errorText: undefined })
			Keyboard.dismiss()
			this.setState({ isSaving: true })
			const { shipment } = this.state
			const dimensionArray = shipment.dimensions.split(/x|X/)
			let dimensions = {}
			if(dimensionArray && dimensionArray.length > 0) {	
				dimensions['width'] = dimensionArray[0]
				if(dimensionArray[1]) dimensions['height'] = dimensionArray[1]
				if(dimensionArray[2]) dimensions['length'] = dimensionArray[2]
			}
		    try {
		        const result = await this.props.addShipment({
			        variables: {
			            ...shipment,
			            dimensions
			        }
		        })
		        if (result && result.data && result.data.addShipment) {
		        	const data = result.data.addShipment
		        	const shipment = {
		        		shipmentId: data._id, 
		        		fromDate: data.fromDate, 
		        		toDate: data.toDate, 
		        		dimensions, 
		        		weight: data.weight
		        	}
		        	navigateToScreen(this.props.componentId, 'Carriers', {shipment})
		        }
		    } catch (error) {
		    	this.setState({ errorText: 'No se puede agregar carga' })
		    }
		    this.setState({ isSaving: false })
		} 
	}

	validateInputs = () => {
	    const { shipment } = this.state
	    if (shipment.origin === '' || shipment.destination === '' || shipment.description === '' || shipment.fromDate === '' || shipment.toDate === '' || shipment.dimensions === '' || shipment.weight === '') {
	      this.setState({ errorText: 'Por favor llene todo los campo' })
	      this.scrollToWarning()
	      return false
	    }
	    if (moment(shipment.fromDate).format('YYYY-MM-DD') > moment(shipment.toDate).format('YYYY-MM-DD')) {
	      this.setState({ errorText: 'Rango de fechas inválido' })
	      this.scrollToWarning()
	      return false
	    }    
	    if(!validateDimensions(shipment.dimensions)) {
    	  this.setState({ errorText: 'por favor ingrese dimensiones en formato válido' })
      	  this.scrollToWarning()
      	  return false
	    }
	    return true
	}

	scrollToWarning = () => {
		this.scroll.scrollTo({x: 0, y: 0, animated: true})
	}

	scrollToInput (reactNode) {
    	this.scroll?.props?.scrollToFocusedInput(reactNode)
  }

	renderModal = () => {
		const { type } = this.state
	    return (
		    <ModalBox
		        displayModal={this.state.displayModal}
		        closeModal={() => this.setState({ displayModal: false })}
		        style={{ backgroundColor: type && type === 'datePicker' ? colors.white : colors.blue }}
		    >
		    	{this.renderModalView()}
		    </ModalBox>
	    )
	}

	renderModalView = () => {
		const { type } = this.state
		if(type === 'datePicker' && Platform.OS === 'ios') {
			return this.renderDatePicker()
		}
		if(type === 'instructions') {
			return this.renderInstructionsView()
		}
	}

	renderDatePicker = () => {
		const { datePickerType } = this.state
		return (
			<View style={{flex: 1}}>
				<CloseModalButton onPress={() => this.setState({ displayModal: false })}/>
				<View style={styles.modalViewWrapper}>
					<DatePickerIOS 
						mode={'date'} 
						date={this.state.shipment[datePickerType] ? this.state.shipment[datePickerType] : new Date()} 
						onDateChange={(selectedDate) => this.handleInput({key: datePickerType, value: selectedDate})} 
						minimumDate={new Date()} 
						maximumDate={new Date(new Date().getFullYear(), 11, 31)}
					/>
					<SimpleButton buttonText={'conjunto'} onPress={() => {
							this.setState({ displayModal: false })
							if(this.state.shipment[datePickerType] == '') {
								this.handleInput({key: datePickerType, value: new Date()})
							}
						}} 
					/>
				</View>
		    </View>
		)
	}

	renderInstructionsView = () => {
		return (
			<View style={{flex: 1}}>
				<CloseModalButton onPress={() => this.setState({ displayModal: false })}/>
				<View style={styles.instructionsWrapper}>
					<Text style={styles.headText}>¿Cómo calcular las dimensiones y el peso?</Text> 
					<View style={styles.innerWrapper}>
						<Text style={styles.instructionText}>Dimensiones</Text>
						<Text style={styles.instructionText}>En caso de enviar varios bultos, podes juntarlos en el suelo formando un cubo y anotar las medidas en centímetros: ​<Text style={styles.dimensionFormateText}>ancho x alto x largo</Text></Text>
					</View>
					<View style={styles.innerWrapper}>
						<Text style={styles.instructionText}>Peso</Text>
						<Text style={styles.instructionText}>Si tienes tus objetos en cajas, pesa la caja más pesada y multiplica el peso de esta por el número de cajas.   </Text>
					</View>
				</View>
			</View>
		)
	}

	renderLocationInput = (key, value, placeholder, reference, blurOnSubmit, onSubmit) => {
		return (
			<View style={styles.textInputwrapper}> 
	        	<TextInput
	                style={styles.inlineLabelTextInput}
	                autoCapitalize="none"
	                selectionColor={colors.blue}
	                onChangeText={changedText => this.handleInput({ key, value: changedText})}
	                placeholder={placeholder}
	                placeholderTextColor={colors.violet}
	                value={value} 
	                underlineColorAndroid={'transparent'}
	                blurOnSubmit={blurOnSubmit}
                    ref={reference}
                    onSubmitEditing={onSubmit}
                    onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
	            /> 
	            <Image source={images.location} resizeMode={'contain'} style={[ styles.locationIcon, { tintColor: key === 'origin' ? colors.lightGreen : colors.navyBlue }]} /> 
	        </View>
		)
	}

	handleInput = ({ key, value }) => {
	    const shipment = this.state.shipment
	    shipment[key] = value
	    this.setState({ shipment })
	}

	openDatePicker = async (type) => {
		if(Platform.OS === 'ios') {
			this.setState({ displayModal: true, type: 'datePicker', datePickerType: type })
		} else {
			try {
			    await DatePickerAndroid.open({
			        date: this.state.shipment.type ? this.state.shipment.type : new Date(),
			        minDate: new Date(),
			        maxDate: new Date(new Date().getFullYear(), 11, 31),
			        mode: 'spinner'
			    }).then(date => {
			        if (date.action !== DatePickerAndroid.dismissedAction) {
			          this.handleInput({key: type, value: new Date(`${date.month + 1}/${date.day}/${date.year}`)})
			        }
			    });
			} catch ({ code, message }) {
			    console.log('Cannot open date picker', message);
			}
		} 
  	}

	renderButton = (type) => {
		const date = this.state.shipment[type]
		return (
			<TouchableOpacity activeOpacity={0.8} style={styles.btnWrapper} onPress={() => this.openDatePicker(type)}>
				<Text style={styles.btnText}>{date ? `${date.getDate()}/${date.getMonth() + 1}` : 'dd/mm'}</Text>
			</TouchableOpacity>
		)
	}

	render() {
		const { props } = this
		const { shipment, errorText, isSaving } = this.state
		return (
			<View style={styles.container}>
				<TopNavBar title={props.title} componentId={this.props.componentId} />
				<InformationBar titleText={'Distancia'} value={`${shipment['distance']} Kilómentros`} />
				<KeyboardAwareScrollView 
					style={styles.keyboardAvoidingContainer}
		          	contentContainerStyle={styles.keyboardAvoidingContentContainer}
		          	showsVerticalScrollIndicator={false}
		          	bounces={false}
		          	extraHeight={140}
		          	innerRef={ref => { this.scroll = ref }}
		          	keyboardShouldPersistTaps={'always'}
		        >
		        	{errorText && (
              			<WrongInputWarning warningText={errorText} style={styles.warningStyle} />
            		)}
		        	<View>
			        	{this.renderLocationInput('origin', shipment.origin, 'Origen', (input) => { this.origin = input }, false, () => this.destination.focus())}
				        {this.renderLocationInput('destination', shipment.destination, 'Destino', (input) => { this.destination = input }, false, () => this.description.focus())}
				    </View>
				    <View>
				        <Text style={styles.titleText}>Descripción del envío</Text>
				        <TextInput
			                style={[styles.inlineLabelTextInput, { paddingLeft: 15 }]}
			                autoCapitalize="none"
			                selectionColor={colors.blue}
			                onChangeText={changedText => this.handleInput({key: "description", value: changedText})}
			                placeholder={'Descripción'}
			                placeholderTextColor={colors.violet}
			                value={shipment.description} 
			                underlineColorAndroid={'transparent'}
			                blurOnSubmit={props.data && props.data.dimensions ? true : false}
                    		ref={(input) => { this.description = input }}
                    		onSubmitEditing={props.data && props.data.dimensions ? () => this.addShipment() : () => this.dimensions.focus()}
                    		onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
			            /> 
			            {(props.data && props.data.dimensions) &&
			            	<Text style={styles.textStyle}>Dimensiones máximas {props.data.dimensions}</Text>
			            }
			            {(props.data && props.data.weight) &&
			            	<Text style={styles.textStyle}>Peso máximo {props.data.weight}Kgrs</Text>
			            }
			        </View>
			        <View>
			            <Text style={styles.titleText}>Fecha deseada</Text>
			            <View style={styles.rowWrapper}>
			            	{this.renderButton('fromDate')}
			            	<Text style={styles.rangeText}>a</Text>
			            	{this.renderButton('toDate')}
			            </View>
			        </View>
		            {(!props.data || (!props.data.dimensions && !props.data.weight)) && (
		            	<View>
				            <Text style={styles.titleText}>Dimensiones</Text>
				            <View style={styles.rowWrapper}>
				            	<View>
					            	<TextInput
						                style={styles.textInput}
						                autoCapitalize="none"
						                selectionColor={colors.blue}
						                onChangeText={changedText => this.handleInput({key: "dimensions", value: changedText})}
						                placeholder={'Dimensiones'}
						                placeholderTextColor={colors.violet}
						                value={shipment.dimensions} 
						                underlineColorAndroid={'transparent'}
						                blurOnSubmit={false}
                    					ref={(input) => { this.dimensions = input }}
                    					onSubmitEditing={() => this.weight.focus()}
                    					onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
						            /> 
						            <Text style={styles.titleText}>Peso</Text>
					            	<TextInput
						                style={[styles.textInput, {width: 100}]}
						                autoCapitalize="none"
						                selectionColor={colors.blue}
						                onChangeText={changedText => this.handleInput({key: "weight", value: changedText})}
						                placeholder={'Peso'}
						                placeholderTextColor={colors.violet}
						                value={shipment.weight} 
						                underlineColorAndroid={'transparent'}
						                blurOnSubmit={true}
                    					ref={(input) => { this.weight = input }}
                    					onSubmitEditing={() => this.addShipment()}
                    					onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
                    					keyboardType={'number-pad'}
						            /> 
						        </View>
						        <TouchableOpacity style={styles.infoWrapper} onPress={() => this.setState({ displayModal: true, type: 'instructions' })} activeOpacity={0.8}>
						        	<Text style={styles.infoText}>¿Cómo calcular las dimensiones y el peso de tu envío?</Text>
						        </TouchableOpacity>
				            </View>
				        </View>
			        )}
		            <View style={styles.btnContainer}>
					    <FullWidthButton 
				            buttonText={'continuar'}
				            onPress={() => this.addShipment()}
				            loading={isSaving}
				        />
				    </View>
			    </KeyboardAwareScrollView> 
			    {this.renderModal()}
			</View>
		)
	}
}

const withMutation = compose(
  graphql(ADD_SHIPMENT, { name: 'addShipment' })
)(FreightInfo);

export default withMutation;