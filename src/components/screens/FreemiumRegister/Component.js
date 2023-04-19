import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import {ADD_MERCHADOPAGO_ACCOUNT} from '../../../graphql/mutations';
import styles from './Style';
import {colors} from '../../../colors';
import Toast from '../../common/Toast/Component';
import ModalBox from '../../common/ModalBox/Component';
import PremiumPayment from '../../common/PremiumPayment/Component';
import AuthWebView from '../../common/AuthWebView/Component';
import {startInitialisation} from '../../../navigation/navigation_settings';
import BackHeader from '../../common/BackHeader/Component';

class FreemiumRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      displayAccountLinkModal: false,
      isSaving: false
    }
  }

  renderModal = () => {
    return (
      <ModalBox
        displayModal={this.state.displayModal}
        closeModal={() => this.setState({displayModal: false, discountCode: ''})}
        style={{backgroundColor: colors.white}}
      >
        <PremiumPayment value={100} onPress={() => this.openScreen()} closeModal={() => this.setState({displayModal: false, discountCode: ''})}/> 
      </ModalBox>
    )
  }

  openScreen = async () => {
    await this.setState({displayModal: false})
    startInitialisation()
  }

  closeAccountLinkModal = async (code) => {
    this.setState({ displayAccountLinkModal: false })
    if (code) {
      this.setState({ isSaving: true })
      try {
        const response = await this.props.addMerchadopagoAccount({
          variables: {
            code,
            type: 'free'
          }
        })
        if(response && response.data && response.data.addMerchadopagoAccount) startInitialisation()
      } catch (error) {
        this.refs.toast.show('Cannot link merchdopago account')
      }
      this.setState({ isSaving: false })
    } else {
      this.refs.toast.show('Cannot link merchdopago account')
    }
  }

  render() {
    const { displayModal, displayAccountLinkModal, isSaving } = this.state
    return (
      <View style={styles.container}>
        <BackHeader screenId = {this.props.componentId}/>
        <View style={styles.firstContainer}>
          <TouchableOpacity style={styles.freeServiceButton} activeOpacity={0.8} onPress={() => this.setState({ displayAccountLinkModal: true })} disabled={isSaving}>
            <Text style={styles.freeServiceBtnText}>FECIT FREE</Text>
          </TouchableOpacity>
          <Text style={styles.textStyle}>Publica tus servicios</Text>
          <Text style={styles.textStyle}>{`Ofrece y recibi pagos a traves de\nmercadopago`}</Text>
        </View>
        <View style={styles.secondContainer}>
          <TouchableOpacity style={styles.premiumServiceButton} activeOpacity={0.8} onPress={() => this.setState({displayModal: true})} disabled={isSaving}>
            <Text style={styles.premiumServiceBtnText}>FECIT PREMIUM</Text>
          </TouchableOpacity>
          <Text style={styles.msgText}>Aparece primero en las búsquedas</Text>
          <Text style={styles.msgText}>Ofrece y recibi pagos en efectivo</Text>
          <Text style={styles.infoText}>Publica tus servicios</Text>
          <Text style={styles.infoText}>{`Ofrece y recibi pagos a traves de\nmercadopago`}</Text>
        </View>
        <Toast ref="toast" />
        {displayModal && this.renderModal()}
        {displayAccountLinkModal && <AuthWebView displayModal={this.state.displayAccountLinkModal} closeModal={(code) => this.closeAccountLinkModal(code)} />}
      </View>    
    )
  }
}

const withMutation = compose(graphql(ADD_MERCHADOPAGO_ACCOUNT, { name: 'addMerchadopagoAccount' }))(FreemiumRegister);

export default withMutation;