import React, {Component} from 'react';
import {View, Text, Image, TextInput, Platform} from 'react-native';
import { graphql } from 'react-apollo';
import apolloClient from '../../../graphql/client';
import {VALIDATE_PROMO_CODE} from '../../../graphql/queries';
import {ADD_MERCHADOPAGO_ACCOUNT} from '../../../graphql/mutations';
import SimpleButton from '../SimpleButton/Component';
import Toast from '../Toast/Component';
import Spinner from '../Spinner/Component';
import styles from './Style';
import {colors} from '../../../colors';
import {images} from '../../../../assets';
import AuthWebView from '../AuthWebView/Component';
import { navigateToScreen } from '../../../navigation/navigation_settings';
import config from '../../../../config';
import CloseModalButton from '../CloseModalButton/Component'
import { Colors } from 'react-native/Libraries/NewAppScreen';

class PremiumPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          promoCode: '',
          displayModal: false,
          isDisabled: false,
          chargeAmount: 100,
          type: 'linkAccount'
        }
    }

    handlePayment = async () => {
        const { promoCode } = this.state
        this.setState({ isDisabled: true })
        if(promoCode) {
            try {
                const result = await apolloClient.query({
                    query: VALIDATE_PROMO_CODE,
                    variables: {
                        amount: 100,
                        code: promoCode
                    },
                    fetchPolicy: 'no-cache'
                })
                if (result && result.data && result.data.validatePromoCode) {
                    this.setState({ chargeAmount: result.data.validatePromoCode })
                    this.setState({ displayModal: true })
                } else {
                    this.setState({ isDisabled: false })
                    this.refs.toast.show('inválido código de descuento')
                }
            } catch (error) {
                this.setState({ isDisabled: false })
                this.refs.toast.show('inválido código de descuento')
            }
        } else this.setState({ displayModal: true })
    } 

    closeModal = async (data, type) => {
        const { chargeAmount } = this.state
        if (type && type === 'linkAccount' && data) {
            this.setState({ type: 'payment', code: data })
        } else if(type && type === 'payment' && data && data.token) {
            var paymentObj = {
                installments: data && data.installments ? data.installments : '',
                issuer_id: data && data.issuer_id ? data.issuer_id : '',
                token: data && data.token ? data.token : ''
            }
            if(Platform.OS === 'android') paymentObj['payment_method_id'] = data && data.collection_method_id ? data.collection_method_id : ''
            else paymentObj['payment_method_id'] = data && data.payment_method_id ? data.payment_method_id : ''
                
            var paymentInfo = { 
                code: this.state.code,
                type: 'premium',
                amount: chargeAmount,
                paymentData: paymentObj
            }
            this.setState({ loading: true })
            try {
                const response = await this.props.addMerchadopagoAccount({
                    variables: {
                        ...paymentInfo
                    }
                })
                if(response && response.data && response.data.addMerchadopagoAccount) this.props.onPress()
                this.setState({ displayModal: false, isDisabled: false, chargeAmount: 100, type: 'linkAccount', code: '', loading: false })
            } catch (error) {
                this.setState({ displayModal: false, isDisabled: false, chargeAmount: 100, type: 'linkAccount', code: '', loading: false })
                this.refs.toast.show('no se puede actualizar el tipo de usuario')
            }
        } else { 
            this.setState({ displayModal: false, isDisabled: false, chargeAmount: 100, type: 'linkAccount', code: '', loading: false }) 
        }
    }

    render() {
        const { props } = this
        const { displayModal, loading, isDisabled, chargeAmount } = this.state, data = { type: this.state.type, publicKey: config.merchadopago.merchadoPublicKey }
        if(this.state.type === 'payment') data['amount'] = chargeAmount
        
        if(loading) return <Spinner />
        return (
            <View style={{flex: 1}}>
                <CloseModalButton onPress={this.props.closeModal} color = {colors.navyBlue}/>
                <View style={styles.modalContentView}>
                    <Text style={styles.titleText}>USUARIO PREMIUM</Text>
                    <Text style={styles.priceText}>$100 por mes</Text>
                    <Image source={images.mercadopago} resizeMode={'contain'} style={styles.imageStyle} />
                    <TextInput
                        style={styles.textInputStyle}
                        autoCapitalize="none"
                        selectionColor={colors.blue}
                        onChangeText={text => this.setState({promoCode: text})}
                        placeholder={'Ingresar código de descuento'}
                        placeholderTextColor={colors.aquaBlue}
                        value={this.state.promoCode} 
                        underlineColorAndroid={'transparent'}
                    /> 
                    <SimpleButton buttonText={'realizar pago'} onPress={() => this.handlePayment()} disabled={isDisabled} />
                    <Toast ref="toast" position={'top'} positionValue={270} />
                    {displayModal && <AuthWebView displayModal={this.state.displayModal} closeModal={(code, type) => this.closeModal(code, type)} paymentInfo={data} />}
                </View>
            </View>        
        );
    }
}

const withMutation = graphql(ADD_MERCHADOPAGO_ACCOUNT, { name: 'addMerchadopagoAccount' })(PremiumPayment)
export default withMutation