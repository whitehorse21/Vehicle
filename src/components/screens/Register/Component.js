import React, {Component} from "react";
import ReactNative, {View, Text, Image, TouchableOpacity, ScrollView, findNodeHandle, Keyboard, Touchable} from 'react-native';
import {connect} from "react-redux";
import {Navigation} from 'react-native-navigation';
import { graphql, ApolloConsumer } from 'react-apollo';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {ADD_USER_MUTATION} from '../../../graphql/mutations';
import {AUTH_USER} from "../../../graphql/queries";
import styles from './Style';
import {colors} from '../../../colors';
import ModalBox from '../../common/ModalBox/Component';
import TermsAndService from '../../common/TermsAndService/Component';
import InlineLabelTextInput from '../../common/InlineLabelTextInput/Component';
import FullWidthButton from '../../common/FullWidthButton/Component';
import WrongInputWarning from '../../common/WrongInputWarning/Component';
import BackHeader from '../../common/BackHeader/Component';
import {navigateToScreen, startSingleScreenApp} from '../../../navigation/navigation_settings';
import {validateEmail, validateName, validatePassword} from '../../../utils/validators';
import {setMultipleData} from '../../../storage';
import {Logo, images} from '../../../../assets';



class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {name: "", username: "", email: "", password: ""},
      displayModal: false,
      errorText: undefined,
      agreedToTOS: false
    };
  }

  handleInput = ({ key, value }) => {
    const credentials = this.state.credentials
    credentials[key] = value
    this.setState({ credentials })
  };

  handleAgreeToTOS = () => {
    this.setState({ agreedToTOS: !this.state.agreedToTOS })
  }

  renderModal = () => {
    return (
      <ModalBox
        displayModal={this.state.displayModal}
        closeModal={() => this.setState({ displayModal: false })}
        displayCloseIcon={true}
      >
       <TermsAndService onClosePress={() => this.setState({ displayModal: false })} />
      </ModalBox>
    )
  }

  handleSignup = async (client) => {
    if (this.validateInputs()) {
      Keyboard.dismiss()
      try {
        const res = await this.props.mutate({
          variables: {
            ...this.state.credentials,
            agreedToTOS: this.state.agreedToTOS
          }
        });
        this.loginAfterSignUp(client);
      } catch (error) {
        try {
          this.setState({errorText: this.errorMap(error.graphQLErrors[0].message)});
        } catch (e) {
          this.setState({ errorText: 'No se puede registrar' })
        }
      }
    }
  }

  loginAfterSignUp = async (client) => {
    try {
      const { data } = await client.query({
        query: AUTH_USER,
        variables: {
          email: this.state.credentials.email.trim(),
          password: this.state.credentials.password,
        },
      });
      this.onLoginSuccess(data)
    } catch (error) {
      try {
        this.setState({ errorText: error.graphQLErrors[0].message });
      } catch (e) {
        console.log(e);
      }
    }
  }

  onLoginSuccess = async (data) => {
    const keyValuePairs = [
      ['userId', data.authUser._id],
      ['token', data.authUser.token],
      ['username', data.authUser.username],
      ['email', data.authUser.email]
    ]
    await setMultipleData(keyValuePairs);
    navigateToScreen(this.props.componentId, 'UserType')
    // startSingleScreenApp('UserType')
  }

  errorMap = (value) => {
    switch (value) {
      case 'Email already exists. [403]': 
        return 'Correo electrónico ya existe';
        
      case 'Username already exists. [403]':
        return 'nombre de usuario ya existe';
        
      default: 
        return value;
    }
  }

  validateInputs = () => {
    // navigateToScreen(this.props.componentId, 'UserType')
    const { credentials, agreedToTOS } = this.state
    if (!validateName(credentials.name.trim())) {
      const errorText = credentials.name.length > 0 ? 'Por favor ingrese alfabetos solo en nombre y apellido' : 'Por favor ingrese nombre y apellido'
      this.setState({ errorText })
      this.scrollToWarning()
      return false
    }
    if (credentials.username.trim().length === 0) {
      this.setState({ errorText: 'Por favor ingrese nombre de usuario' })
      this.scrollToWarning()
      return false
    }
    if (!validateEmail(credentials.email.trim())) {
      const errorText = credentials.email.length > 0 ? 'Correo electrónico inválido' : 'Por favor ingrese correo electrónico'
      this.setState({ errorText })
      this.scrollToWarning()
      return false
    } 
    if (credentials.password.length === 0) {
      this.setState({ errorText: 'Por favor ingrese contraseña' })
      this.scrollToWarning()
      return false
    }
    if (credentials.password.length < 6) {
      this.setState({ errorText: 'Ingrese al menos una contraseña de seis caracteres' })
      this.scrollToWarning()
      return false
    }
    if (!agreedToTOS) {
      this.setState({ errorText: 'por favor leído y acepto los términos y condiciones' })
      this.scrollToWarning()
      return false
    }
    return true
  }

  scrollToWarning = () => {
    this.scroll.scrollTo({x: 0, y: 0, animated: true})
  }

  scrollToInput (reactNode: any) {
    this.scroll?.props?.scrollToFocusedInput(reactNode)
  }

  render() {
    const { credentials, errorText, agreedToTOS } = this.state
    return (
      <ApolloConsumer>
        {client => (
          <View style={styles.container}>
            <BackHeader screenId = {this.props.componentId}/>
            <KeyboardAwareScrollView 
              contentContainerStyle={styles.keyboardAvoidingContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
              innerRef={ref => { this.scroll = ref }}
              keyboardShouldPersistTaps={'always'}
            >
              <View style={styles.logo} >
                <Logo width={127} height={127} />
              </View>
              {errorText && (
                <WrongInputWarning warningText={errorText} />
              )}
              <InlineLabelTextInput
                value={credentials.name}
                onChangeText={changedText => this.handleInput({key: "name", value: changedText})}
                placeholder={'Nombre y apellido'}
                reference={(input) => { this.name = input }}
                blurOnSubmit={false}
                onSubmitEditing={() => this.username.focus()}
                onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
                type={'name'}
              />
              <InlineLabelTextInput
                value={credentials.username}
                onChangeText={changedText => this.handleInput({key: "username", value: changedText})}
                placeholder={'Nombre de usuario'}
                reference={(input) => { this.username = input }}
                blurOnSubmit={false}
                onSubmitEditing={() => this.email.focus()}
                onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
                type={'name'}
              />
              <InlineLabelTextInput
                value={credentials.email}
                onChangeText={changedText => this.handleInput({key: "email", value: changedText})}
                placeholder={'Correo electrónico'}
                reference={(input) => { this.email = input }}
                blurOnSubmit={false}
                onSubmitEditing={() => this.password.focus()}
                onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
                type={'email'}
              />
              <InlineLabelTextInput
                secureTextEntry
                value={credentials.password}
                onChangeText={changedText => this.handleInput({key: "password", value: changedText})}
                placeholder={'Contraseña'}
                reference={(input) => { this.password = input }}
                blurOnSubmit={true}
                onSubmitEditing={() => this.handleSignup(client)}
                onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
                type={'password'}
              />
              <View style={styles.row}>
                <TouchableOpacity onPress={() => this.handleAgreeToTOS()} activeOpacity={0.6}>
                  {agreedToTOS ? <Image source={images.checkbox} style={styles.checkboxImg} resizeMode={'contain'} /> : <View style={styles.checkboxWrapper} />}
                </TouchableOpacity>
                <Text style={styles.termsText}>He leído y acepto los </Text>
                <TouchableOpacity onPress={() => this.setState({ displayModal: true })} activeOpacity={0.6}>
                  <Text style={styles.tosTitle}>términos y condiciones</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWrapper}>
                <FullWidthButton 
                  buttonText={'continuar'}
                  onPress={() => this.handleSignup(client)}
                />
              </View>
            </KeyboardAwareScrollView>
            {this.renderModal()}
          </View>
        )}
      </ApolloConsumer>
    );
  }
}

const withMutation = graphql(ADD_USER_MUTATION)(Register)
export default withMutation